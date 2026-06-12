// css fragmentation module: page breaks, orphans and widows

# 02. Fragmentation (Page Breaks)

Controlling where content breaks across pages. Implements the CSS Fragmentation Module Level 3.

---

## Forced breaks before an element

`break-before` forces the element to start a new page (or a specific side). Works on block and inline elements.

```css
/* Start every chapter on a fresh page */
h2 {
  break-before: page;
}
```

```css
/* Start chapters on a right-hand page */
.chapter {
  break-before: right; /* also: left, recto, verso */
}
```

Supported values: `page`, `left`, `right`, `recto`, `verso`. Not supported: `avoid`, `avoid-page`.

## Forced breaks after an element (GAP — supported, not yet written up)

`break-after` is the mirror of `break-before` and is supported in Paged.js with the same value set (`page`, `left`, `right`, `recto`, `verso`). Use it to push whatever follows a section onto a new page.

```css
.section-end {
  break-after: page;
}
```

To find: confirm behaviour on inline vs block elements in a live test.

## Avoiding breaks inside an element (GAP — supported, high value)

`break-inside: avoid` keeps an element from splitting across a page boundary — the single most useful break rule for a structured document: keep an agenda item, an action-item row, or a signature block intact.

```css
.agenda-item,
.action-row,
.signature-block {
  break-inside: avoid;
}
```

Supported: `break-inside: avoid`. Not supported: `avoid-page`, `avoid-column`, `avoid-region`.

## Orphans and widows (GAP — browser-provided)

`orphans` sets the minimum lines left at the bottom of a page; `widows` the minimum carried to the top of the next. These come from the browser engine: Chromium supports them, Firefox does not — which is fine for a Chromium/Paged.js pipeline.

```css
p {
  orphans: 3;
  widows: 3;
}
```

## Not supported

`box-decoration-break` (slice/clone) is not implemented.
