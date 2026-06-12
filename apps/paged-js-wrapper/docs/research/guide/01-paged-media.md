// css paged media module: @page rules, selectors, margin boxes, counters

# 01. Paged Media

Everything for defining the page itself: its size and margins, selecting specific pages, and the sixteen margin boxes where running heads, footers, and page numbers live. Implements the CSS Paged Media Module Level 3.

---

## Page size

By default Paged.js renders A4. Set a different size with the size property inside @page, using a length, a keyword, and/or an orientation.

```css
@page {
  size: A5;
}
```

```css
/* Use A4 paper in landscape orientation */
@page {
  size: A4 landscape;
}
```

```css
/* Explicit dimensions */
@page {
  size: 140mm 200mm;
}
```

| Keyword | Size          | Keyword | Size         |
| ------- | ------------- | ------- | ------------ |
| A0      | 841 × 1189 mm | A7      | 74 × 105 mm  |
| A1      | 594 × 841 mm  | A10     | 26 × 37 mm   |
| A2      | 420 × 594 mm  | B4      | 250 × 353 mm |
| A3      | 297 × 420 mm  | B5      | 176 × 250 mm |
| A4      | 210 × 297 mm  | letter  | 8.5 × 11 in  |
| A5      | 148 × 210 mm  | legal   | 8.5 × 14 in  |
| A6      | 105 × 148 mm  | ledger  | 11 × 17 in   |

## Page margins

Set margins with the margin shorthand or the four side properties. Units: cm, mm, in, px. Default is 1 inch. (margin-inside / margin-outside are not supported by Paged.js.)

```css
/* All margins 30mm */
@page {
  margin: 30mm;
}

/* Top/bottom 3in, left/right 4in */
@page {
  margin: 3in 4in;
}

/* Per side */
@page {
  margin-top: 20mm;
  margin-bottom: 25mm;
  margin-left: 10mm;
  margin-right: 15mm;
}
```

## Bleed and marks

bleed extends the page content area past the trim edge; marks adds printers' crop and/or cross (register) marks. Both go in @page; use either or both marks.

```css
@page {
  bleed: 6mm;
  marks: crop cross; /* or just: crop */
}
```

## Page selectors

Target specific pages with pseudo-classes. They cascade like normal CSS.

```css
@page :first {
} /* the first page */
@page :left {
} /* all left (verso) pages */
@page :right {
} /* all right (recto) pages */
@page :blank {
} /* pages left blank by a forced break */
@page :nth(3) {
} /* the third page */
```

### Facing pages (recto/verso)

Use :left and :right to mirror the layout around the fold — typically larger outside margins.

```css
@page:left {
  margin-left: 25mm;
  margin-right: 10mm;
}
@page:right {
  margin-left: 10mm;
  margin-right: 25mm;
}
```

## Margin boxes

A page box has two areas: the **page area** (where your HTML content flows; when it overflows, Paged.js's chunker creates a new page) and sixteen **margin boxes** around it for generated content like page numbers and running heads. Each margin box has its own margin, border, padding, and content area; by default sizes derive from the page margins.

```
+----------------+-------------+---------------+--------------+-----------------+
| @top-left-     | @top-left   | @top-center   | @top-right   | @top-right-     |
| corner         |             |               |              | corner          |
+----------------+-------------+---------------+--------------+-----------------+
| @left-top      |                                            | @right-top      |
+----------------+                                            +-----------------+
| @left-middle   |                 page area                  | @right-middle   |
+----------------+                                            +-----------------+
| @left-bottom   |                                            | @right-bottom   |
+----------------+-------------+---------------+--------------+-----------------+
| @bottom-left-  | @bottom-    | @bottom-      | @bottom-     | @bottom-right-  |
| corner         | left        | center        | right        | corner          |
+----------------+-------------+---------------+--------------+-----------------+
```

Add content to any box with the content property:

```css
@page :right {
  @top-right {
    content: "My title";
  }
}
```

The full list of box selectors: @top-left-corner, @top-left, @top-center, @top-right, @top-right-corner, @left-top, @left-middle, @left-bottom, @right-top, @right-middle, @right-bottom, @bottom-left-corner, @bottom-left, @bottom-center, @bottom-right, @bottom-right-corner.

### Styling margin boxes

Style a box by declaring properties directly in its at-rule.

```css
@page {
  @top-left {
    content: "My title";
    padding-left: 15mm;
    color: #ff5733;
  }
}
```

### Default alignment

Each box has a default text-align and vertical-align; override with those properties.

| Box                  | text-align | vertical-align |
| -------------------- | ---------- | -------------- |
| @top-left-corner     | right      | middle         |
| @top-left            | left       | middle         |
| @top-center          | center     | middle         |
| @top-right           | right      | middle         |
| @top-right-corner    | left       | middle         |
| @left-top            | center     | top            |
| @left-middle         | center     | middle         |
| @left-bottom         | center     | bottom         |
| @right-top           | center     | top            |
| @right-middle        | center     | middle         |
| @right-bottom        | center     | bottom         |
| @bottom-left-corner  | right      | middle         |
| @bottom-left         | left       | middle         |
| @bottom-center       | center     | middle         |
| @bottom-right        | right      | middle         |
| @bottom-right-corner | left       | middle         |

### Width, height, and rotation

Box sizes are auto-computed (see 04), but you can set them explicitly and rotate.

```css
@page {
  @left-top {
    width: 28mm;
    height: 10mm;
    transform: rotate(-90deg);
    transform-origin: top left;
    position: relative;
    top: 28mm;
  }
}
```

### Deleting content on blank pages

Forced breaks can insert blank pages. Use :blank with content: none to clear a box on those pages.

```css
@page :blank {
  @top-left {
    content: none;
  }
}
```

## Page counters

Paged.js increments a `page` counter per page; `pages` is the total. Use them in a margin box.

```css
@page {
  @bottom-left {
    content: counter(page);
  }
}
```

```css
@page {
  @bottom-left {
    content: "Page " counter(page) " of " counter(pages);
  }
}
```

Note: resetting the page counter to 1 is currently the only reset option.

## Named pages (GAP — supported, not yet written up)

Paged.js supports named pages: define `@page <name>` and assign it to an element with `page: <name>`. This lets the minutes body and each appended attachment carry different page styles/headers in one stylesheet. Syntax to verify against a live test:

```css
@page cover {
  @top-center {
    content: none;
  }
}
.cover-section {
  page: cover;
}
```

To find: full named-page + page-group behaviour and the supported page-group selectors (:left/:right/:first work; :blank and :nth do not).

## Complete example

A full @media print block combining size, bleed, marks, facing margins, and a forced break — a useful starting skeleton:

```css
@media print {
  @page {
    size: 140mm 200mm;
    margin: 10mm 15mm;
    bleed: 6mm;
    marks: crop cross;
  }
  @page:left {
    margin-left: 35mm;
    margin-right: 15mm;
  }
  @page:right {
    margin-left: 15mm;
    margin-right: 35mm;
  }
  .chapter {
    break-before: right;
  }
}
```
