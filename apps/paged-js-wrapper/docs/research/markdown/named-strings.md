// Using name strings

# Named Strings

Named Strings are used to create running headers and footers: they copy text for reuse in margin boxes.

First, the text content of the selected element is cloned into a named string using string-set with a custom identifier (in the code below we call it “title”, but you can name it whatever makes sense as a variable).

In the following example, each time a new <h2> appears in the HTML, the content of the named string gets updated with the text of that <h2>. (It also can be selected with a class if you prefer).

```
h2 {
  string-set: title content(text);
}
```

Next, the string() function copies the value of a named string to the margin boxes, via the content property.

```
@page {
  @bottom-center {
    content: string(title);
  }
}
```

The string property act like a variable. It read your DOM and each time a new title level 2 is encountered, it change the variable from the page where that title appears. This variable is passed into the margin boxes of the page and into all the following margin boxes until there is a new title.

You can set multiple values int eh same string-set

```
h2::before {
  content: "Chapter " counter(countChapter, upper-roman);
}

h2 {
  string-set: titleBefore content(before), title content(text);
}

@page {
  @bottom-center {
    content: string(titleBefore) ". " string(title, first);
}
```

# Styling Named Strings

```
@page {
  @bottom-center {
    content: string(title);
    text-transform: uppercasse;
    font-size: 11px;
  }
}
```

# Running Elements with Complex Content

There are cases where the use of string-set is not suitable for specific or complex running headers and footer. For example, if you need:

- to keep the HTML tags contained in the header/footer ( <em>, <span>, <br>…),
- to insert images or pictograms in the header/footer (with <img> or <svg>),
- to shorten a title that is too long and do that in semantically way (do not use the text-overflow: ellipsis; property but replace the title with a piece that means),
- to repeat complex elements (address, contact…) on all pages for document like invoices or reports.

For these purposes, you can use running elements with position property and element() function. The position property removes the element from the normal flow (instead of copying it like string-set property) and moves it to the margin boxes using the element() function.

This technique allows you to keep all the HTML structuring of the element. But you must add dedicated elements in your HTML.
In the following example, we want to keep the italics contains in the title.

```
<section id="chapter-4">
  <h1>The protagonist of <em>Macbeth<em></h1>
  <p><em>Macbeth</em> is a tragedy by William Shakespeare; it is thought to have been first performed in 1606. It dramatizes the damaging physical and psychological effects of political ambition on those who seek power for its own sake...</p>
</section>
```

First, add dedicated element for running title in your HTML (just after the title) and copy your title inside. Here, it is a paragraph with the class .title

```
<section id="chapter-4">
  <h1>The protagonist of <em>Macbeth<em></h1>
  <p class="title">The protagonist of <em>Macbeth<em></p>
  <p><em>Macbeth</em> is a tragedy by William Shakespeare; it is thought to have been first performed in 1606. It dramatizes the damaging physical and psychological effects of political ambition on those who seek power for its own sake...</p>
</section>
```

After, set the element’s position to running. Here, “titleRunning” is a custom identifier, you can name it whatever makes sense to you.

```
.title {
  position: running(titleRunning);
}
```

Then, place the element into a margin box with the element() function via the content property:

```
@page {
  @top-center {
    content: element(titleRunning);
  }
}
```

The .title element is now removed from you flow and repeated into top-center margins of pages. It's act like the named string, if a new .title element is encountered in the the DOM, the element is changed in the new page and the next ones.

Note: The element() function cannot be combined with other possible values for the content property.

# Styling Running Elements

Since the element is copied, all styles are copied with it. That is, if you have stylized your .title element, the styles will be kept in the margins.

With the following code, your running header will appear in capital letters and with a size of 11px:

```.title {
  position: running(titleRunning);
  text-transform: uppercasse;
  font-size: 11px;
}

@page {
  @top-center {
    content: element(titleRunning);
  }
}
```

This is the DOM created when you move a running element into a margin:

```
<div class="pagedjs_margin pagedjs_margin-top-center hasContent">
  <div class="pagedjs_margin-content">
    <p class="title">The protagonist of <em>Macbeth<em></p>
  </div>
</div>
```

You can see that the paragraph is kept in the margin as well as all its content. You can apply styles on the paragraph or on the margins because of cascading.

# Select element of the page for running title/headers

The value of a named string or the value of a running element may change several times on a page (for example if you have multiple title of the same level in the same page). You can add a second optional argument on the string() function or on the element() function to indicates which element of the page should be used if there is multiple. This argument specify the value of the named string can be combined with other possible values for the content property.

string(<identifier>, first):

- Use the value of the first assignment on the page (default)
  string(<identifier>, start):
- Use the value assigned at the start of the page. If the element is the first element on the page, it's this one. If not, it's the element of the previous page.
  string(<identifier>, last):
- Use the value of the last element on the page.
  string(<identifier>, first-except):
- If the value is assigned on the page, the running element don't appears on this page but appears on next pages

The first three argument are useful for dictionary or glossary. The figure below shows which value appears according to the argument:

# Delete generated content in blank page

Forced page breaks can create blank page, e.g., pages automatically added to make sure a new chapter begins on the desired left or right page. The :blank pseudo class selector selects pages that have no content from the flow. To delete the generated content in blank page, simply use content: none in selected margin boxes of the blank pages.

```
@page: blank {
  @top-left {
    content: none;
  }
};
```

# Styling margin boxes and generated content

You can stylize the margin-boxes by applying styles directly into the at-rules for page-margin boxes.

```
@page {
  @top-left {
    content: "My title";
    padding-left: 15mm;
    color: #ff5733;
  }
}
```

# Default alignment of generated content

Each margin box have default alignments for the content (show in the following table). You can easy change it by using text-align and vertical-align properties into at-rules for page-margin boxes.

# Applying style on generated content

You can specify that some CSS rules only apply to your margin box while others apply to your generated content. It depends on how you created your generated content.

## With position: running()

If you have used position: running, the styles applying to the generated content must be declared in the running element and the styles applying to the margin box in the at-rules for page-margin boxes.

```
.running {
  position: running(chapTitle);
  font-size: 12px;
  text-transform: uppercase;
}

@page: left {
  @top-left {
    content: element(chapTitle);
    vertical-align: top;
    padding-top: 24px;
  }
};
```

## With string-set

If you have used string-set, all styles are declared in the margin box and therefore applied to the margin box. If you want certain rules to apply only to the text and not to the entire margin box, you will have to use the classes created by Paged.js to reach the text.

For example, if you use background-color and padding into the at-rules for page-margin box, the style are applied on the margin box.

```
@page: left {
  @top-left {
    background-color: #ffd2b5;
    color: #fe4017;
    padding: 2mm 5mm;
  }
};
```

If you want to applied this background-color and padding only on the generated content, you need to applied the style on a special div create by Paged.js: pagedjs_margin-content.

```
.pagedjs_left_page .pagedjs_margin-top-left .pagedjs_margin-content {
  width: auto;
  background-color: #ffd2b5;
  color: #fe4017;
  padding: 2mm 5mm;
}
```

# Define width and height of margin boxes

The height and width of the margin boxes are automatically computed by Paged.js (see "Rendering of margin boxes" below) but you can easily define the size you want using relative (%) or absolute values (mm, in, px).

```
@page {
  @left-top {
    width: 28mm;
    height: 10mm;
  }
}
```

# Rotate margin boxes

By using the transform() property you can easily rotate the margin-boxes of your document

```
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

# Rendering of margin boxes with Paged.js

Paged.js use CSS grid and flexbox to create the margin boxes of the page. The figures below represent how margin boxes are placed with the div classes used.

## Margin boxes on the page
