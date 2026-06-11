# Implementation Plan: Schema-Driven PDF Document Engine

A planning document, not a solution. It captures the architecture and the
decisions reached so far so you have a spine to build against. No
implementation code — that’s yours to write.

---

## North Star

A low-cognitive-load web tool where a non-technical person fills a structured
form, and the tool emits a consistently-formatted PDF with a collection of
mandatory and optional documents appended in a defined order. Different projects
use different templates through the _same_ interface.

**The load-bearing principle (already decided, do not relitigate):** generate the
body as its own PDF via a reflow engine, then concatenate attachments. This works
_with_ the grain of PDF (pages are self-contained; merging is copying page
objects). Never map glyphs onto a blank page. Never stuff text into fixed form
fields and hope it fits.

---

## The Architecture: One File In, Three Consumers Out

The core idea you arrived at — a single document that defines both the interface
and the template — is sound, but it resolves into **one authoring file per
project with three internally-bound sections**, not one flat list of slots. The
binding between sections is _shared field names_; the responsibilities stay
separate.

```
  project-definition file (one per project)
  ├── 1. FIELD SCHEMA      → generates the form + validation
  ├── 2. LAYOUT TEMPLATE   → positions field values on paginated pages
  └── 3. ATTACHMENT MANIFEST → drives upload UI + gates final output
            │
            ▼
  form (data in) → validate → render body PDF → append attachments in
  manifest order → set /Title → save
```

Why three sections and not one: a form and a document template have overlapping
but **non-identical** needs. A flat “one input = one slot” model collapses the
moment you need a variable-length list (“add another agenda item” = a UI control
_and_ a template loop) or a section that disappears when empty (“hide Apologies
if nobody sent regrets” = a template conditional). Those mechanics don’t live in
a slot annotation; they live in the template. Keep the two bound by name,
decoupled in job.

---

## Technology Decisions (and the forks already made)

| Concern                    | Choice                                                                       | Rejected alternative & why                                                                                        |
| -------------------------- | ---------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Body layout                | **HTML/CSS + CSS Paged Media**                                               | — (this is what “document design in HTML/CSS” _is_)                                                               |
| Pagination engine          | **Paged.js** (browser polyfill, WYSIWYG paged preview)                       | Vivliostyle — heavier, book-grade; only if Paged.js hits a wall                                                   |
| Body rendering             | reflow engine (Paged.js, or HTML→headless Chromium)                          | **AcroForm field-stuffing** — fields don’t reflow; they clip or shrink to illegibility on variable-length minutes |
| Form generation            | **JSON Schema** + a schema-driven form lib (**RJSF**, JSONForms, or Formily) | hand-built forms per project — defeats the “add a project = one file” goal                                        |
| Validation                 | **Ajv** against the same schema                                              | bespoke validation — duplicate source of truth                                                                    |
| Templating (data → markup) | JSX via `react-dom/server` `renderToStaticMarkup`, or Eta/Handlebars         | a freeform rich-text editor — reintroduces the inconsistency you’re killing                                       |
| Merge / compile            | **pdf-lib** (client-side, no native deps)                                    | —                                                                                                                 |
| Title on output            | set PDF `/Title` metadata, not just the OS filename                          | filename-only — viewers show the renderer’s junk title                                                            |

**The clarification that prevents a wrong turn:** `@react-pdf/renderer` is _not_
HTML/CSS. It’s JSX with a Flexbox subset and its own StyleSheet — a different
paradigm with no real CSS cascade. Since you want HTML/CSS, your road is
**Paged.js**, not react-pdf. Choose deliberately; don’t blur them.

---

## The One Decision Still Open

**Are attachments always already PDFs (or images), or can they arrive as
Word/Excel/other formats?**

- **PDF/image only →** the entire tool can be browser-only. pdf-lib merges PDFs
  and embeds images client-side. No backend.
- **Office files possible →** you acquire a backend whether you want one or not.
  There is no clean client-side `.docx`/`.xlsx` → PDF conversion; the honest
  options are LibreOffice headless or a conversion API, both server-side.

Decide this _before_ building the editor, because it determines your whole
deployment shape. The mental model holds either way: everything must become a
fixed-page PDF before it can join the page tree.

---

## Build Order (isolation before integration)

Build each piece alone with fake data before wiring anything together, or you’ll
debug three unfamiliar systems at once and won’t know which is lying to you.

1. **Paged.js template, standalone.** Hardcode fake data. Get one good-looking
   paginated page: `@page` setup (size, margins), a running header, page numbers,
   an embedded `<img>`, and a list that breaks across pages correctly. Learn
   paged media here, with nothing else moving.
1. **Schema-driven form, standalone.** Feed RJSF (or chosen lib) a hand-written
   JSON Schema. Watch it generate fields; get the data object out. Learn
   schema-driven UI here.
1. **pdf-lib merge, standalone.** Three sample PDFs → concatenate in order → set
   `/Title`. ~20 lines. Builds confidence, exposes the merge API.
1. **Bind.** Now flow the form’s field names into the template, and wire the
   manifest gate. The binding is the easy part once all three halves are real.

---

## The Manifest Gate (the thing that actually solves your stated problem)

Your real pain is _“no one can produce it correctly.”_ That’s a structure
problem, and the fix isn’t the editor — it’s a **validation gate that refuses to
emit the final document** when a mandatory field is missing or a mandatory
attachment is absent or out of order. The manifest (ordered, mandatory-vs-
optional) is both the upload UI’s source and the output gate. Bake this in from
the start; it’s the guardrail, not a nicety.

---

## Pitfalls to Watch (so you recognize them mid-build)

- **Design against the Paged.js preview, never the normal browser scroll view.**
  Page boundaries behave differently than screen scroll. The gap between “looks
  fine scrolling” and “looks right paginated” is where the hours disappear.
- **`break-inside: avoid`** is usually the answer when an agenda item or table row
  splits across a page edge. Reach for it when content breaks badly.
- **Set `/Title` in PDF metadata** on the final output, not just the filename.
- **Structured inputs, not a blank canvas.** Give named fields that map to
  template regions. Only accept rich text (markdown, then render) if a field
  genuinely needs bold/lists — don’t default to WYSIWYG.

---

## Scope Discipline: Where Your Actual Value Is

The “schema generates a form” wheel is already round — RJSF, JSONForms, Formily
are mature. **Do not rebuild it.** Stand on it.

Your novel, off-the-shelf-unavailable value is the **binding of a field schema to
a paged document template, plus the ordered PDF-compilation pipeline with a
manifest gate.** That’s where your engineering effort belongs. The form generator
is a commodity; the template-binding-plus-merge engine is your product. Spend
accordingly.

---

## Refined Pipeline (one line)

structured form → validate (Ajv) → reflow-render body PDF (Paged.js) → check
manifest → append PDFs/images in declared order (convert Office docs to PDF first,
server-side, if they exist) → set `/Title` → save.
