// paged.js internals: how margin boxes are built with css grid and sized

# 04. Margin Box Rendering (Paged.js Internals)

How Paged.js actually builds the margin boxes — useful when you need to target the generated DOM with CSS or understand auto-sizing. This is Paged.js-specific implementation, not a W3C spec.

---

## Grid layout of the page

Paged.js uses CSS grid and flexbox. The page is four corner margins plus four margin groups on a 3×3 grid, sized from CSS variables Paged.js derives from your margin and page-size declarations.

```css
.pagedjs_pagebox {
  grid-template-columns:
    [left] var(--pagedjs-margin-left)
    [center] calc(
      var(--pagedjs-pagebox-width) - var(--pagedjs-margin-left) - var(--pagedjs-margin-right)
    )
    [right] var(--pagedjs-margin-right);
  grid-template-rows:
    [header] var(--pagedjs-margin-top)
    [page] calc(
      var(--pagedjs-pagebox-height) - var(--pagedjs-margin-top) - var(--pagedjs-margin-bottom)
    )
    [footer] var(--pagedjs-margin-bottom);
}
```

Corner classes (grid position): `pagedjs_margin-top-left-corner-holder` (left/header), `…top-right-corner-holder` (right/header), `…bottom-left-corner-holder` (left/footer), `…bottom-right-corner-holder` (right/footer).

Group classes (grid position): `pagedjs_margin-top` (center/header), `pagedjs_margin-bottom` (center/footer), `pagedjs_margin-left` (left/page), `pagedjs_margin-right` (right/page).

## Boxes inside each group

Each group holds three boxes in a single-direction grid (horizontal for top/bottom, vertical for left/right), labelled A / B / C:

| Group  | A                          | B                            | C                           |
| ------ | -------------------------- | ---------------------------- | --------------------------- |
| Top    | pagedjs_margin-top-left    | pagedjs_margin-top-center    | pagedjs_margin-top-right    |
| Bottom | pagedjs_margin-bottom-left | pagedjs_margin-bottom-center | pagedjs_margin-bottom-right |
| Left   | pagedjs_margin-left-top    | pagedjs_margin-left-middle   | pagedjs_margin-left-bottom  |
| Right  | pagedjs_margin-right-top   | pagedjs_margin-right-middle  | pagedjs_margin-right-bottom |

Each box is displayed with flex and contains a div.pagedjs_margin-content holding the generated content. Target that class to style the content rather than the whole box:

```css
.pagedjs_left_page .pagedjs_margin-top-left .pagedjs_margin-content {
  background-color: #ffd2b5;
  color: #fe4017;
  padding: 2mm 5mm;
}
```

## Auto-sizing rules

If you set no explicit box size, sizes compute per group. For top/bottom groups "size" = width; for left/right groups "size" = height. Top/bottom boxes are 100% of group height; left/right boxes 100% of group width.

**Only one box generated:** it takes the full group size.

**Two boxes — A and C:**

- No size set: B = 0; A and C size to their content.
- One size set: B = 0; the unsized box fills the remaining space.
- Both sizes set: A aligns to the start, C to the end; B takes the gap (no content).

**Two boxes — A+B or B+C:**

- No size set: boxes size to content, and the "center rule" holds — A always equals C.
- One size set: the other two fill remaining space under the center rule.
- Two sizes set: sized boxes use their size; the third (no content) takes the rest.

**All three generated:** same logic — center rule when unsized, declared sizes honoured when set, the unsized/empty box absorbs remaining space; with all sizes set boxes align left (top/bottom) or top (left/right).
