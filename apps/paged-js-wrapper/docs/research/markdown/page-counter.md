// inserting a page number using the page counter

# Page Counter

To define page numbers, Paged.js uses a CSS counter that gets incremented for each new page.

To insert a page number on a page or retrieve the total number of pages in a document, the W3C proposes a specific counter named page. The counters declaration must be used within a content property in the margin-boxes declaration. The following example declares the page number in the bottom-left box:

```
@page {
  @bottom-left {
    content: counter(page);
  }
}
```

You can also add a bit of text before the page number:

```
@page {
  @bottom-left {
    content: "page " counter(page);
  }
}
```

To tally the total number of pages in your document, you can write this:

```
@page {
  @bottom-left {
    content: "Page " counter(page) " of " counter(pages);
  }
}
```

Reset the page counter

Right now, reseting the page count to 1 is the only possible options
