import Document from "next/document.js";

if (!Document.getInitialProps) {
  throw new Error("Document.getInitialProps is not defined in ESM.");
} else {
  console.log("Document.getInitialProps is defined in ESM.");
}

/**
 Consumer app fails with:

  ⨯ Error: Document.getInitialProps is not defined in ESM.
    at file:///Users/diegoandai/MUI/experiments/esm-test-7-consumer-of-test-6/node_modules/esm-test-6/test-2.mjs:4:9
    at ModuleJob.run (node:internal/modules/esm/module_job:195:25)
    at async ModuleLoader.import (node:internal/modules/esm/loader:336:24)
    at async importModuleDynamicallyWrapper (node:internal/vm/module:429:15) {
  page: '/'

  Which is weird: next/document.js is correctly interpreted as CJS, but the default export is not properly set.

  Document.default.getInitialProps is defined, but it's unexpected having to use it like that in ESM.
 */
