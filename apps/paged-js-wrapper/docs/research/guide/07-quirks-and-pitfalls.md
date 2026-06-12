// every warning, quirk, and dead-end in one place

# 07. Quirks and Pitfalls

A cross-cutting index of every caveat flagged across the collection — the things that waste time if you hit them unaware. References point to the guide with the full detail.

## Behavioral traps (will bite you)

- **Styling location** — `string-set` styles go in the margin box; `running()` styles go on the element. The #1 cause of "my styles do nothing." (03)
- **`element()` can't be combined** with other content values in the same declaration. (03)
- **Page counter resets to 1 only** — no arbitrary reset value. (01)
- **Named strings update from the page where the new value first appears** and carry forward until the next change — variable-like, not per-page. (03)

```css
/* the styling-location trap, both ways */
@page {
  @bottom-center {
    content: string(title);
    text-transform: uppercase;
  }
} /* string-set → in the box */

.title {
  position: running(t);
  text-transform: uppercase;
} /* running → on the element */
@page {
  @top-center {
    content: element(t);
  }
}
```

## Buggy / partial (works, but verify in a live render)

- **`string-set` content(before/after/first-letter)** — buggy, issue #45. (03)
- **`string()` keywords first/start/last** — pending upstream; only `first-except` is solid. (03)
- **`target-counter`** — works with issue #46; `target-counters` doesn't. (03)
- **orphans / widows** — Chromium only, not Firefox (fine for a Chromium/Paged.js pipeline). (02)

## React / integration (06)

- Paged.js mutates the DOM directly — never let React render into its target container.
- React 18 StrictMode double-invokes effects in dev → double pagination; guard and clear the container before each run.
- `await document.fonts.ready` before paginating, or late-loading fonts shift every break.
- The viewer renders pages into the DOM; producing a PDF is a separate step (06, 05).

## Dead-ends (unsupported upstream — don't build on these)

margin-inside / margin-outside · `break-*: avoid` / `avoid-page` · `break-inside: avoid-column` / `avoid-region` · box-decoration-break · `string-set` with counter() / counters() / attr() · `element()` position keywords · footnotes · leaders · PDF bookmarks.

## Supported but undocumented (GAP — verify, then write up)

`break-inside: avoid` · named pages / page groups · page backgrounds · `break-after` · cross-references (target-text / target-counter) · orphans / widows. See 00 for the ranked list and why each matters.
