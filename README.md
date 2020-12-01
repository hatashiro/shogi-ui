# shogi-ui

A collection of HTML, CSS and JS for Shogi (将棋) UI on Web.

## How to use

Import CSS/JS files under [`src/`](src).

CSS is mandatory, but JS is optional. shogi-ui is a UI library; it doesn't
include any of actual Shogi logic. The JS API is only to create and manipulate
SVG/HTML elements. What can be done with JS API can also be done with plain
HTML. Nevertheless, using JS API is still recommended as it's smaller in its
size and thus faster to load.

- [JS API Reference](JS_API.md)

## Demo

- [Shogi UI Builder](#): WIP

## Samples

The [`samples/`](samples) directory contains sample files. Files with the
`_static` suffix are ones without JS.

- [koma.html](https://hatashiro.github.io/shogi-ui/samples/koma.html)
  [static](https://hatashiro.github.io/shogi-ui/samples/koma_static.html)
- [board.html](https://hatashiro.github.io/shogi-ui/samples/board.html)
  [static](https://hatashiro.github.io/shogi-ui/samples/board_static.html)
- [mochigoma.html](https://hatashiro.github.io/shogi-ui/samples/mochigoma.html)
  [static](https://hatashiro.github.io/shogi-ui/samples/mochigoma_static.html)

## Development

### Compilation

```
$ scripts/compile.sh
```

The command above executes the Closure Compiler and compile `shogi.js` into
`shogi-compiled.js`.

Java runtime is required to run the Closure Compiler.

### Documentation

```
$ scripts/jsdoc.py
```

The command above generates `JS_API.md` from the JSDoc comments in `shogi.js`.

Python is required to run the script.

## License

[ISC](LICENSE)
