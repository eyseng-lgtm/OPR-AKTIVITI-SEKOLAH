const UNSUPPORTED_COLOR_FN_RE = /(?<![a-zA-Z0-9_-])(oklch|oklab|lch|lab|color-mix|color)\s*\(/i;

const COLOR_CSS_PROPERTIES: readonly string[] = [
  'color',
  'background-color',
  'background-image',
  'border-top-color',
  'border-right-color',
  'border-bottom-color',
  'border-left-color',
  'outline-color',
  'text-decoration-color',
  '-webkit-text-stroke-color',
  'box-shadow',
  'text-shadow',
  'caret-color',
  'column-rule-color',
  'fill',
  'stroke',
];

function resolveColorToRgba(colorExpr: string, ctx: CanvasRenderingContext2D): string {
  const sentinel = '#123456';
  ctx.fillStyle = sentinel;
  ctx.fillStyle = colorExpr;

  // If browser ignored the expression and it wasn't literally the sentinel, return safe transparent
  if (ctx.fillStyle === sentinel && colorExpr.toLowerCase() !== sentinel) {
    return 'rgba(0, 0, 0, 0)';
  }

  ctx.clearRect(0, 0, 1, 1);
  ctx.fillRect(0, 0, 1, 1);
  const data = ctx.getImageData(0, 0, 1, 1).data;
  const r = data[0];
  const g = data[1];
  const b = data[2];
  const a = data[3];

  if (a === 255) {
    return `rgb(${r}, ${g}, ${b})`;
  }
  if (a === 0) {
    return 'rgba(0, 0, 0, 0)';
  }
  return `rgba(${r}, ${g}, ${b}, ${(a / 255).toFixed(4)})`;
}

function replaceUnsupportedColorFunctions(
  cssValue: string,
  ctx: CanvasRenderingContext2D,
  cache: Map<string, string>
): string {
  if (!cssValue || !UNSUPPORTED_COLOR_FN_RE.test(cssValue)) {
    return cssValue;
  }

  const fnStartRe = /(?<![a-zA-Z0-9_-])(oklch|oklab|lch|lab|color-mix|color)\s*\(/gi;
  let result = '';
  let lastIndex = 0;

  while (true) {
    fnStartRe.lastIndex = lastIndex;
    const match = fnStartRe.exec(cssValue);
    if (!match) {
      result += cssValue.slice(lastIndex);
      break;
    }

    const startIdx = match.index;
    const openParenIdx = cssValue.indexOf('(', startIdx);
    let depth = 1;
    let cursor = openParenIdx + 1;

    while (cursor < cssValue.length && depth > 0) {
      const ch = cssValue[cursor];
      if (ch === '(') depth++;
      else if (ch === ')') depth--;
      cursor++;
    }

    const fullExpr = cssValue.slice(startIdx, cursor);
    let replacement = cache.get(fullExpr);
    if (!replacement) {
      replacement = resolveColorToRgba(fullExpr, ctx);
      cache.set(fullExpr, replacement);
    }

    result += cssValue.slice(lastIndex, startIdx) + replacement;
    lastIndex = cursor;
  }

  return result;
}

function sanitizeElementComputedColors(
  el: Element,
  view: Window,
  ctx: CanvasRenderingContext2D,
  cache: Map<string, string>
) {
  if (!('style' in el)) {
    return;
  }

  const styledEl = el as HTMLElement | SVGElement;
  const computed = view.getComputedStyle(styledEl);
  for (const prop of COLOR_CSS_PROPERTIES) {
    const val = computed.getPropertyValue(prop);
    if (val && UNSUPPORTED_COLOR_FN_RE.test(val)) {
      const sanitized = replaceUnsupportedColorFunctions(val, ctx, cache);
      styledEl.style.setProperty(prop, sanitized, 'important');
    }
  }
}

export function sanitizeDocumentColorsForHtml2Canvas(
  clonedDoc: Document,
  targetElement?: HTMLElement | null
) {
  const view = clonedDoc.defaultView || window;
  const canvas = clonedDoc.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return;

  const cache = new Map<string, string>();

  // 1. Sanitize any inline <style> blocks in clonedDoc (covers CSS variables & pseudo-elements)
  const styleTags = clonedDoc.querySelectorAll('style');
  styleTags.forEach((styleTag) => {
    const text = styleTag.textContent;
    if (text && UNSUPPORTED_COLOR_FN_RE.test(text)) {
      styleTag.textContent = replaceUnsupportedColorFunctions(text, ctx, cache);
    }
  });

  // 2. Ensure html and body in clonedDoc use plain hex colors (html2canvas parses both)
  if (clonedDoc.documentElement) {
    clonedDoc.documentElement.style.setProperty('background-color', '#ffffff', 'important');
    clonedDoc.documentElement.style.setProperty('color', '#1e293b', 'important');
  }
  if (clonedDoc.body) {
    clonedDoc.body.style.setProperty('background-color', '#ffffff', 'important');
    clonedDoc.body.style.setProperty('color', '#1e293b', 'important');
  }

  // 3. Sanitize computed styles on target ancestors (up to html), target itself, and all descendants
  const root = targetElement || clonedDoc.body;
  if (!root) return;

  let ancestor: Element | null = root.parentElement;
  while (ancestor) {
    sanitizeElementComputedColors(ancestor, view, ctx, cache);
    ancestor = ancestor.parentElement;
  }

  sanitizeElementComputedColors(root, view, ctx, cache);
  const descendants = root.querySelectorAll('*');
  descendants.forEach((node) => {
    sanitizeElementComputedColors(node, view, ctx, cache);
  });
}
