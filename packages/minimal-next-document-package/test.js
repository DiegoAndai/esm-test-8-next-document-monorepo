const Document = require("next/document.js");

if (!Document.default.getInitialProps) {
  throw new Error("Document.default.getInitialProps is not defined in CJS.");
} else {
  console.log("Document.default.getInitialProps is defined in CJS.");
}

/**
 * Consumer app runs successfully.
 */
