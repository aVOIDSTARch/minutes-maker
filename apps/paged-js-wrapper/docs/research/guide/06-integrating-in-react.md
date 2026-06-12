// where paged.js css lives, how to run it, and embedding the viewer in react

# 06. Integrating in a Web App (and React)

Where the paged-media CSS actually goes, how Paged.js runs, the specific things that break under React, and a viewer component.

> Not runtime-verified here: Paged.js needs a real browser layout engine (it measures rendered geometry to place breaks), which can't be exercised in a headless/jsdom sandbox. The pattern below is the documented approach; verify the marked points in an actual browser.

---

## Where the CSS goes

The paged-media rules from guides 01–04 (`@page`, margin boxes, named strings, breaks) live in **ordinary CSS** — a linked stylesheet or a `<style>` block. Paged.js parses them at runtime; you do **not** need to wrap them in `@media print` for Paged.js itself (it processes `@page` directly). Wrap in `@media print` only if the same page must also look normal under the browser's native print.

Two stylesheets is the clean split:

- **paged.css** — your `@page`/margin-box/break rules (the document's print layout).
- **preview.css** — on-screen chrome only: gray background behind pages, drop shadows, centering. Paged.js renders each page as a `.pagedjs_page` element, so you style those for screen.

```css
/* preview.css — screen presentation of the generated pages */
.pagedjs_pages {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.pagedjs_page {
  background: white;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.2);
  margin: 8px 0;
}
```

## How Paged.js runs — two modes

**Auto polyfill** — include `paged.polyfill.js` and it runs on load, paginating `<body>` in place. Fine for a static HTML file; **wrong for React** (runs once on load, mutates the body React wants to own).

**Previewer API** — explicit and the right choice for an app. You hand it content, stylesheets, and a target element:

```js
import { Previewer } from "pagedjs";

const paged = new Previewer();
const flow = await paged.preview(
  htmlString, // source content (string or DOM node)
  ["/css/paged.css"], // array of stylesheet URLs
  document.querySelector("#out"), // element to render the pages into
);
console.log(flow.total, "pages"); // page count
```

## Why React needs care

Paged.js works by **deleting the source content and injecting paginated `.pagedjs_page` nodes** into the target. That is direct DOM mutation, which collides with React's virtual DOM. The rules that keep them from fighting:

1. **Give Paged.js a container React doesn't render into.** Render into a bare `ref`'d `<div>` and never put React children inside it — treat it as an escape hatch.
2. **Run pagination in `useEffect`, not during render**, and clear the container before each run (the Previewer _appends_, so a re-run duplicates pages).
3. **React 18 StrictMode double-invokes effects in dev** — this paginates twice. Guard with a cancellation flag and a container reset (below).
4. **Wait for fonts before paginating.** Web fonts that load late change text metrics and move every break. `await document.fonts.ready` first.
5. **It's async and can be slow** on large documents — show a loading state; don't block render.

## A viewer component

```tsx
import { useEffect, useRef, useState } from "react";
import { Previewer } from "pagedjs";

type Props = { html: string; stylesheets: string[] };

export function PagedPreview({ html, stylesheets }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [pages, setPages] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false; // guards StrictMode double-run
    const el = ref.current;
    if (!el) return;

    (async () => {
      setLoading(true);
      el.innerHTML = ""; // clear before (re)render — Previewer appends
      await document.fonts.ready; // metrics stable before breaking
      const flow = await new Previewer().preview(html, stylesheets, el);
      if (cancelled) {
        el.innerHTML = "";
        return;
      } // a newer run superseded us
      setPages(flow.total);
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    }; // cleanup on unmount / dep change
  }, [html, stylesheets]);

  return (
    <div>
      {loading && <p>Paginating…</p>}
      {pages !== null && <p>{pages} pages</p>}
      <div ref={ref} className="pagedjs-preview" />
    </div>
  );
}
```

Usage — note `stylesheets` is a **stable reference** (define it outside the component or memoize it), otherwise a new array each render re-triggers the effect:

```tsx
const SHEETS = ["/css/paged.css", "/css/preview.css"];

<PagedPreview html={bodyHtml} stylesheets={SHEETS} />;
```

## Passing dynamic CSS (not a file)

`preview()` takes stylesheet **URLs**. To feed CSS generated at runtime, wrap it in a Blob URL:

```ts
const href = URL.createObjectURL(new Blob([cssText], { type: "text/css" }));
// pass [href] to preview(); URL.revokeObjectURL(href) when done
```

## To verify in a browser

- Exact `preview(content, stylesheets, renderTo)` argument forms (URL strings vs objects) against your Paged.js version.
- That `flow.total` is the page count field (stable, but confirm).
- StrictMode behavior: confirm no duplicate pages in dev with the guard above.
- Generating the final PDF: on-screen this only _renders pages in the DOM_. For an actual PDF, either trigger the browser's native print on the paginated output, or generate server-side with `pagedjs-cli` (guide 05) / headless Chromium.
