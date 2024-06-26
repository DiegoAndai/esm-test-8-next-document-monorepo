import { Html, Head, Main, NextScript } from "next/document";
import test from "minimal-next-document-package/test.mjs";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
