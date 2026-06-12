// pagedjs-cli: generating a pdf from the command line

# 05. Command-Line Interface

Generate a PDF from an HTML file with pagedjs-cli.

```
pagedjs-cli index.html -o result.pdf
```

## Options

| Option                       | Description                                                  |
| ---------------------------- | ------------------------------------------------------------ |
| `-h, --help`                 | output usage information                                     |
| `-V, --version`              | output the version number                                    |
| `-i, --inputs [inputs]`      | Inputs                                                       |
| `-o, --output [output]`      | Output                                                       |
| `-d, --debug`                | Show Electron Window to Debug                                |
| `-l, --landscape`            | Landscape printing                                           |
| `-s, --page-size [size]`     | Print to Page Size [size]                                    |
| `-w, --width [size]`         | Print to Page Width [width]                                  |
| `-h --height [size]`         | Print to Page Height [height]                                |
| `-m, --page-margin [margin]` | Print with margin [margin]                                   |
| `-n, --hyphenate [lang]`     | Hyphenate with language, defaults to "en-us"                 |
| `-hi, --hyphen_ignore [str]` | Ignore passed element selectors, e.g. ".class_to_ignore, h1" |
| `-ho, --hyphen_only [str]`   | Only hyphenate passed selectors, e.g. ".hyphenate, aside"    |
| `-e, --encoding [type]`      | Set the encoding of the input html, defaults to "utf-8"      |
| `-t, --timeout [ms]`         | Set a max timeout of [ms]                                    |
