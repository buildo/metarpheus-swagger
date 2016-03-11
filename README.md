# metarpheus-swagger
metarpheus interpreter producing Swagger specs

[![Build Status](https://travis-ci.org/buildo/metarpheus-swagger.svg?branch=master)](https://travis-ci.org/buildo/metarpheus-swagger)

## Try it!

```sh
npm start
```

Will read `input.json` and produce `swagger.json` and `swagger.yaml`.

You can copy-paste the yaml output to http://editor.swagger.io and see the result.

### Custom Types
If you need custom type mappings, you can provide a json file structured like:

```json
{
  "MyType": { "type": "number", "format": "double" },
  "MyOtherType": { "type": "object" }
}
```

Pass the file using the `-t` or `--customTypes` option, e.g.

```sh
node --harmony-destructuring --harmony_default_parameters index.js -t customTypes.json input.json
```

## Development

```sh
npm run watch
```

Same as `npm start`, but it will watch the source files.
