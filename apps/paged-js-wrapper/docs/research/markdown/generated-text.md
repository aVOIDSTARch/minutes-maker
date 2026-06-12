// prefix or postfix text to an element

# Generated Text

You can directly declare your text in the CSS (like above) but you can also use text specified in a data- custom attribute.

In your HTML:

```
<p class="ref" data-ref-id="0215">Some blabla as a reference</p>
```

In your CSS:

```
p.ref::before {
  content: attr(data-ref-id);
}
```

It's also possible to combine elements in the content property:

```
p.ref::before {
  content: "Reference " attr(data-ref-id) ": ";
}
```

Once displayed you will have this text:

Reference 0215: Some blabla as a reference
