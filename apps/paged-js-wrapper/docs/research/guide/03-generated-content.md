// generated content: content property, named strings, running elements, cross-references

# 03. Generated Content

Generating text and graphics that aren't in the HTML flow: the content property basics, then the paged-media tools (named strings and running elements) that feed running headers and footers. Implements parts of CSS Generated Content and the CSS Generated Content for Paged Media Module.

---

## The content property

content is used in ::before and ::after pseudo-elements to insert generated content.

```css
.note::before {
  content: "Note: ";
}
```

You can style it where it's set:

```css
.note::before {
  content: "Note: ";
  color: red;
  font-weight: bold;
}
```

### Text from attributes and combinations

Pull text from a data- attribute, and combine strings with attribute values.

```html
<p class="ref" data-ref-id="0215">Some text as a reference</p>
```

```css
p.ref::before {
  content: "Reference " attr(data-ref-id) ": ";
}
/* renders: Reference 0215: Some text as a reference */
```

### Generated links

Print the destination of links after them, useful for paper output.

```css
a::after {
  content: " (" attr(href) ")";
}
```

### Generated images

Insert an image as generated content with url().

```css
.glossary::after {
  content: " " url("/images/glossary-icon.png");
}
```

### Generated counters

Count elements and display the number. Reset on an ancestor, increment per element, display in ::before.

```css
body {
  counter-reset: figureNumber;
}
figcaption {
  counter-increment: figureNumber;
}
figcaption::before {
  content: counter(figureNumber);
}
```

---

## Named strings — running headers/footers from your content

The fastest way to build running heads/feet: copy text already in your content into a named string, then echo it into a margin box.

Step 1 — capture text into a named string with string-set (custom identifier, here "title"). Each time a new h2 appears, the string updates.

```css
h2 {
  string-set: title content(text);
}
```

Step 2 — echo it into a margin box with string().

```css
@page {
  @bottom-center {
    content: string(title);
  }
}
```

The named string acts like a variable: it tracks the DOM and updates from the page where a new h2 appears, carrying into following pages until the next h2.

### Selecting which part of the element

The argument to content() chooses what gets captured (the argument is required).

```css
h2 {
  string-set: title content(text);
} /* full text (default) */
```

| Selector                | Captures                                                 |
| ----------------------- | -------------------------------------------------------- |
| `content(text)`         | full text of the element (default)                       |
| `content(first-letter)` | first letter (per ::first-letter) — **buggy, issue #45** |
| `content(before)`       | the ::before string — **buggy, issue #45**               |
| `content(after)`        | the ::after string — **buggy, issue #45**                |
| `attr(<name>)`          | an attribute's value — **not supported in string-set**   |

You can set multiple values in one string-set:

```css
h2::before {
  content: "Chapter " counter(countChapter, upper-roman);
}
h2 {
  string-set:
    titleBefore content(before),
    title content(text);
}
@page {
  @bottom-center {
    content: string(titleBefore) ". " string(title, first);
  }
}
```

### Styling a named string

The text is copied, so style it in the margin box.

```css
@page {
  @bottom-center {
    content: string(title);
    text-transform: uppercase;
    font-size: 11px;
  }
}
```

### Choosing which occurrence on a page

When a string changes several times on one page, a second argument picks which value to use.

| Argument                  | Uses                                       |
| ------------------------- | ------------------------------------------ |
| `string(x, first)`        | first assignment on the page (default)     |
| `string(x, start)`        | value in effect at the start of the page   |
| `string(x, last)`         | last assignment on the page                |
| `string(x, first-except)` | hide on this page, show on following pages |

Caveat: `first`/`start`/`last` are pending upstream; `first-except` works.

---

## Running elements — headers/footers with complex content

When string-set is too limited — you need to keep HTML tags (`<em>`, `<img>`…), or repeat a complex block (address, contact) — use a running element. Unlike string-set (which copies text), position: running() removes the element from the flow and element() places it in a margin box, preserving all its markup.

Add a dedicated element after the title and mark it running:

```html
<p class="title">The protagonist of <em>Macbeth</em></p>
```

```css
.title {
  position: running(titleRunning);
}
@page {
  @top-center {
    content: element(titleRunning);
  }
}
```

It behaves like a named string: when a new .title appears in the DOM, the running element updates on that page and the following ones. Note: element() cannot be combined with other content values, and its position keywords (first/start/last/first-except) are not supported.

### Styling running elements

Because the element is copied wholesale, its own styles travel with it.

```css
.title {
  position: running(titleRunning);
  text-transform: uppercase;
  font-size: 11px;
}
@page {
  @top-center {
    content: element(titleRunning);
  }
}
```

---

## Styling: where the rules go (quirk)

Where you declare styles depends on how the content was generated — getting this wrong is a common cause of "my styles do nothing":

- **string-set**: the text is copied as plain text, so all styling goes in the margin-box at-rule. To style only the text (not the whole box), target the generated div `.pagedjs_margin-content` (see 04).
- **position: running()**: the element is copied wholesale, so content styles go on the running element itself; use the margin-box at-rule only for box-level properties (padding, alignment).

```css
/* string-set → style in the box */
@page {
  @bottom-center {
    content: string(title);
    text-transform: uppercase;
  }
}

/* running element → style on the element */
.title {
  position: running(t);
  text-transform: uppercase;
}
@page {
  @top-center {
    content: element(t);
    vertical-align: top;
  }
}
```

---

## Cross-references (GAP — partially supported, not yet written up)

Paged.js can resolve references to where a target lands in the paginated output — e.g. automatic "see page N" links.

```css
/* page number of the link's target */
a.xref::after {
  content: " (page " target-counter(attr(href url), page) ")";
}
/* text pulled from the target */
a.xref::after {
  content: " — " target-text(attr(href));
}
```

Support: `target-text` (content/before/after/first-letter) works; `target-counter` works with a known issue (#46); `target-counters` does not. To find: verify exact output in a live test before relying on it.

## Not supported

Footnotes (`float: footnote`, `@footnote`, footnote counters), leaders (`content: leader(...)`), and PDF bookmarks (`bookmark-level/label/state`) are all unimplemented in Paged.js.
