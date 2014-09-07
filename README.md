# koa-logify

[logify]() middleware for [koa]().

## Install

Install the [package]() with [npm](http//npmjs.org):

```sh
$ npm install koa-logify
```

## Usage

```js
var koa = require('koa');
var logger = require('koa-logify');

var app = koa();

app.use(logger());

app.use(function* () {
  this.body = 'Hello world!';
});
```

## API

### logger([opts])

Creates a logify middleware.
You can pass your own `logify` instance in `opts.logger`,
or you can pass logger options in `opts.loggerOpts`.

### logger.error()

Creates a simple try-catch error middleware.

## License

MIT
