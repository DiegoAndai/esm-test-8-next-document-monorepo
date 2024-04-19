# Repro for `next/document` import issue

## Context

Issue found when trying to add `exports` field to `material-nextjs` integration package.
This is a minimal repro with the following structure:

- `packages/minimal-next-document-package` is a package which imports the default from `next/document.js` and checks if `getInitialProps` is defined. This is a minimal version of what `material-nextjs` does (reference). It has two equivalent versions:
  - `test.js` is a CommonJS module, which works as expected.
  - `test.mjs` is an ESM module, which doesn't work.
- `apps/consumer` is an app which consumes the `minimal-next-document-package` package.

## Issue

When importing `next/document.js` from an ESM module, the default value is not properly set:

```js
import Document from "next/document.js";

Document.getInitialProps; // unexpectedly undefined
Document.default.getInitialProps; // function
```

This is also the case when importing the module from a CommonJS module:

```js
const Document = require("next/document.js");

Document.getInitialProps; // expectedly undefined
Document.default.getInitialProps; // function
```

But this is expected and properly handled when transpiling ([reference](<https://unpkg.com/browse/@mui/material-nextjs@5.15.11/node/v13-pagesRouter/pagesRouterV13Document.js#:~:text=_document.default.getInitialProps(ctx)>)).

## Expected behavior

In ESM, the default import should be set with using the syntax:

```js
import Document from "next/document.js";

Document.getInitialProps; // function
```

Reference: https://nodejs.org/docs/latest/api/esm.html#esm_commonjs_namespaces:~:text=The%20preceding%20module%20supports%20named%20imports%20in%20ES%20modules%3A

## Running the repro

1. Clone the repo
2. `cd esm-test-8-next-document-monorepo/apps/consumer`
3. `pnpm install`
4. `pnpm dev`

You can switch the import in the consumer app to see the difference:

```js
// apps/consumer/pages/_document.js
import test from "minimal-next-document-package/test.js"; // This works
```

```js
// apps/consumer/pages/_document.js
import test from "minimal-next-document-package/test.mjs"; // This doesn't work
```
