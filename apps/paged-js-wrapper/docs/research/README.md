# Paged.js Research

Distilled reference for the CSS Paged Media features Paged.js supports, assembled for the minutes-maker print pipeline. Covers how to define pages, place running headers/footers, control breaks, generate content, and wire Paged.js into a web/React front end.

## Layout

```
research/
├── README.md                 ← you are here
├── guide/                    ← THE COLLECTION TO USE (consolidated, standardized)
├── markdown/sources/         ← raw per-topic notes the guides were built from
└── screen-caps/              ← original documentation screenshots
```

Use `guide/`. The `sources/` and `screen-caps/` folders are kept for provenance and fact-checking; you shouldn't need them day to day.

## The guide collection

Read in order, or jump via the coverage map.

| File                         | Scope                                                                                                       |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `00-coverage-map.md`         | **start here** — every W3C feature, its Paged.js support, which guide covers it, and the gaps still to fill |
| `01-paged-media.md`          | `@page` rules (size, margins, marks, bleed), page selectors, margin boxes, counters, named pages            |
| `02-fragmentation.md`        | page breaks (`break-before/after/inside`), orphans/widows                                                   |
| `03-generated-content.md`    | the `content` property, named strings, running elements, cross-references                                   |
| `04-margin-box-rendering.md` | Paged.js grid implementation + box size computation (internals)                                             |
| `05-cli.md`                  | `pagedjs-cli` usage and options                                                                             |
| `06-integrating-in-react.md` | where the CSS lives, running Paged.js, React gotchas, a viewer component                                    |
| `07-quirks-and-pitfalls.md`  | cross-cutting index of every trap, partial feature, and dead-end                                            |

## How to use it

1. `00-coverage-map.md` tells you what's supported and where it's documented — and flags **GAP** items (supported by Paged.js but not yet written up, e.g. `break-inside: avoid`, named pages, page backgrounds) and confirmed dead-ends.
2. `01`–`03` are the working reference for authoring the print stylesheet.
3. `06` covers integration; `05` covers generating the actual PDF.

## Provenance

Source notes in `markdown/sources/` were transcribed from the screenshots in `screen-caps/` and from two Paged.js documentation pages:

- Generated Content in Margin Boxes — https://pagedjs.org/en/documentation/7-generated-content-in-margin-boxes/
- Supported feature of the W3C specifications — https://pagedjs.org/en/documentation/14-supported-feature-of-the-w3c-specifications/

`guide/07-quirks-and-pitfalls.md` is the polished cross-cutting index of caveats; `sources/quirks-and-pitfalls.md` is its origin note. The same warnings are also embedded inline in each guide and summarized in `00`.

## Caveats

- **Support statuses come from the Paged.js W3C matrix**, which can lag the library. Treat `GAP` items as supported-but-unverified until tested in a live render.
- **`06` (React) is not runtime-tested** — Paged.js needs a real browser layout engine, so the component pattern is documented-but-unverified. It carries its own "verify in a browser" checklist.
- Paged.js renders **paginated pages into the DOM**; producing a PDF is a separate step (native print on the output, or `pagedjs-cli` / headless Chromium — see `05`).
