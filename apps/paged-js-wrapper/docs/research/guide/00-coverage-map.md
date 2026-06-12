// coverage map: every W3C paged-media feature, paged.js support, our docs, and gaps

# 00. Coverage Map

This maps the three W3C specifications Paged.js implements against our consolidated guides, so nothing is lost and the gaps are explicit. Source of truth for support status: pagedjs.org "Supported feature of the W3C specifications".

Legend for support: **yes** = works in Paged.js · **partial** = works with caveats/bugs · **no** = not implemented · **browser** = relies on the browser engine.

Legend for our coverage: doc number where it lives, or **GAP** = supported by Paged.js but not yet written up (the "stuff to find"), or **n/a** = unsupported, nothing to write.

---

## CSS Paged Media Module Level 3 → see 01-paged-media.md

| Feature                      | Syntax                                      | Paged.js                | Our doc                            |
| ---------------------------- | ------------------------------------------- | ----------------------- | ---------------------------------- |
| Page size (length)           | `size: <length>{1,2}`                       | yes                     | 01                                 |
| Page size (keyword)          | `size: A4 \| letter \| legal …`             | yes                     | 01                                 |
| Orientation                  | `size: portrait \| landscape`               | yes                     | 01                                 |
| Marks                        | `marks: none \| crop \|\| cross`            | yes                     | 01                                 |
| Bleed                        | `bleed: <length>`                           | yes                     | 01 (was only in an example before) |
| Margins (1–2 lengths)        | `margin: <length>{1,2}`                     | yes                     | 01                                 |
| Margins (4 sides)            | `margin-top/right/bottom/left`              | yes                     | 01                                 |
| Margins (inside/outside)     | `margin-inside / margin-outside`            | **no**                  | n/a                                |
| Page background color        | `background-color`                          | yes                     | **GAP**                            |
| Page background image        | `background-image: url()`                   | yes                     | **GAP**                            |
| Page background values       | `background-size/repeat/position`           | yes                     | **GAP**                            |
| Spread selectors             | `@page :left / :right`                      | yes                     | 01                                 |
| First page                   | `@page :first`                              | yes                     | 01                                 |
| Blank page                   | `@page :blank`                              | yes                     | 01                                 |
| nth page                     | `@page :nth(n)`                             | yes                     | 01                                 |
| Margin-box default alignment | —                                           | yes                     | 01                                 |
| Margin-box styles            | `background / color / border`               | yes                     | 01                                 |
| Margin-box text-align        | `text-align`                                | yes                     | 01                                 |
| Margin-box vertical-align    | `vertical-align / align-items`              | yes                     | 01                                 |
| Margin-box computed sizing   | —                                           | in progress (upstream)  | 04 (Paged.js rules)                |
| Page counter                 | `counter(page)`                             | yes                     | 01                                 |
| Pages total counter          | `counter(pages)`                            | yes                     | 01                                 |
| Named page                   | `@page <name>` + `section { page: <name> }` | yes                     | **GAP**                            |
| Page group                   | `@page <name>` grouping                     | yes                     | **GAP**                            |
| Page-group spread/first      | `@page <name>:left/:first`                  | yes                     | **GAP**                            |
| Page-group blank/nth         | `@page <name>:blank/:nth`                   | **no** (issues #30/#29) | n/a                                |

## CSS Fragmentation Module Level 3 → see 02-fragmentation.md

| Feature                              | Syntax                                     | Paged.js                    | Our doc                                            |
| ------------------------------------ | ------------------------------------------ | --------------------------- | -------------------------------------------------- |
| Break before (page)                  | `break-before: page`                       | yes                         | 02                                                 |
| Break before (left/right)            | `break-before: left \| right`              | yes                         | 02                                                 |
| Break before (recto/verso)           | `break-before: recto \| verso`             | yes                         | 02                                                 |
| Break before (avoid)                 | `break-before: avoid \| avoid-page`        | **no**                      | n/a                                                |
| Break after (all values)             | `break-after: page/left/right/recto/verso` | yes                         | **GAP**                                            |
| Break inside (avoid)                 | `break-inside: avoid`                      | yes                         | **GAP** — high value for keeping rows/items intact |
| Break inside (avoid-page/col/region) | `break-inside: avoid-*`                    | **no / ?**                  | n/a                                                |
| Orphans                              | `orphans: <integer>`                       | browser (Chrome yes, FF no) | **GAP**                                            |
| Widows                               | `widows: <integer>`                        | browser (Chrome yes, FF no) | **GAP**                                            |
| Box decoration break                 | `box-decoration-break`                     | **no**                      | n/a                                                |

## CSS Generated Content for Paged Media → see 03-generated-content.md

| Feature                                       | Syntax                                 | Paged.js                       | Our doc                           |
| --------------------------------------------- | -------------------------------------- | ------------------------------ | --------------------------------- |
| string-set (string / content(text))           | `string-set: x content(text)`          | yes                            | 03                                |
| string-set content(before/after/first-letter) | —                                      | **partial** (buggy, issue #45) | 03 (noted)                        |
| string-set counter()/counters()/attr()        | —                                      | **no**                         | 03 (noted)                        |
| string() in margin box                        | `content: string(x)`                   | yes                            | 03                                |
| string() keyword first/start/last             | `string(x, first)`                     | partial (pending merge)        | 03 (noted)                        |
| string() first-except                         | `string(x, first-except)`              | yes                            | 03                                |
| Running element                               | `position: running(x)`                 | yes                            | 03                                |
| element() in margin box                       | `content: element(x)`                  | yes                            | 03                                |
| element() keywords                            | `element(x, first…)`                   | **no**                         | 03 (noted)                        |
| Cross-ref counter                             | `target-counter(attr(href url), page)` | partial (issue #46)            | **GAP** — useful for "see page N" |
| Cross-ref text                                | `target-text(attr(href))`              | yes                            | **GAP**                           |
| Footnotes (all)                               | `float: footnote`, `@footnote` …       | **no**                         | n/a                               |
| Leaders                                       | `content: leader(dotted)`              | **no**                         | n/a                               |
| PDF bookmarks                                 | `bookmark-level/label/state`           | **no**                         | n/a                               |

---

## Gaps to find/write, ranked by relevance to a paginated minutes document

1. **`break-inside: avoid`** (02) — keep an agenda item, action row, or signature block from splitting across a page. Directly needed.
2. **Named pages** `@page <name>` (01) — give the minutes body and appended attachments different page styles/headers in one stylesheet. Directly useful.
3. **Page backgrounds** (01) — letterhead/branding, watermarks behind the page. Useful.
4. **`break-after`** (02) — force what follows a section onto a new page.
5. **Cross-references** `target-text` / `target-counter` (03) — auto "see page N" references.
6. **Orphans / widows** (02) — typographic polish; Chromium-only, which is fine for a Chromium/Paged.js pipeline.

## Confirmed dead-ends (do not build on these)

margin-inside/outside · break-\*: avoid-page/avoid · box-decoration-break · string-set with counter()/counters()/attr() · element() position keywords · footnotes · leaders · PDF bookmarks. All report **no** upstream.

---

## The consolidated collection

| File                       | Scope                                                                      |
| -------------------------- | -------------------------------------------------------------------------- |
| 00-coverage-map.md         | this map                                                                   |
| 01-paged-media.md          | @page rules, page selectors, margin boxes, counters, named pages           |
| 02-fragmentation.md        | page breaks, orphans/widows                                                |
| 03-generated-content.md    | content property basics, named strings, running elements, cross-references |
| 04-margin-box-rendering.md | Paged.js grid implementation + size computation (internals)                |
| 05-cli.md                  | pagedjs-cli usage and options                                              |
| 06-integrating-in-react.md | where the CSS lives, running Paged.js, React gotchas, viewer component     |
