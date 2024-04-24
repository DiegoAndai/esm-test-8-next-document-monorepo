"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DocumentHeadTags = DocumentHeadTags;
exports.createGetInitialProps = createGetInitialProps;
exports.documentGetInitialProps = documentGetInitialProps;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var React = _interopRequireWildcard(require("react"));
var _createInstance = _interopRequireDefault(require("@emotion/server/create-instance"));
var _document = _interopRequireDefault(require("next/document"));
var _createCache = _interopRequireDefault(require("./createCache.js"));
var _jsxRuntime = require("react/jsx-runtime");
var _meta;
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
let Document = _document.default;
if (!Document.getInitialProps) {
  // @ts-ignore
  Document = Document.default;
}
/**
 * A utility to compose multiple `getInitialProps` functions.
 */
function createGetInitialProps(plugins) {
  return async function getInitialProps(ctx) {
    const originalRenderPage = ctx.renderPage;
    ctx.renderPage = () => originalRenderPage({
      enhanceApp: App => plugins.reduce((result, plugin) => plugin.enhanceApp(result), App)
    });
    const initialProps = await Document.getInitialProps(ctx);
    const finalProps = await plugins.reduce(async (result, plugin) => plugin.resolveProps(await result), Promise.resolve(initialProps));
    return finalProps;
  };
}
function DocumentHeadTags(props) {
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(React.Fragment, {
    children: [_meta || (_meta = /*#__PURE__*/(0, _jsxRuntime.jsx)("meta", {
      name: "emotion-insertion-point",
      content: ""
    })), props.emotionStyleTags]
  });
}

// `getInitialProps` belongs to `_document` (instead of `_app`),
// it's compatible with static-site generation (SSG).
async function documentGetInitialProps(ctx, options) {
  var _options$emotionCache, _options$plugins;
  // Resolution order
  //
  // On the server:
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. document.getInitialProps
  // 4. app.render
  // 5. page.render
  // 6. document.render
  //
  // On the server with error:
  // 1. document.getInitialProps
  // 2. app.render
  // 3. page.render
  // 4. document.render
  //
  // On the client
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. app.render
  // 4. page.render

  // You can consider sharing the same Emotion cache between all the SSR requests to speed up performance.
  // However, be aware that it can have global side effects.
  const cache = (_options$emotionCache = options == null ? void 0 : options.emotionCache) != null ? _options$emotionCache : (0, _createCache.default)();
  // The createEmotionServer has to be called directly after the cache creation due to the side effect of cache.compat = true,
  // otherwise the <style> tag will not come with the HTML string from the server.
  const {
    extractCriticalToChunks
  } = (0, _createInstance.default)(cache);
  return createGetInitialProps([{
    enhanceApp: App => function EnhanceApp(props) {
      return /*#__PURE__*/(0, _jsxRuntime.jsx)(App, (0, _extends2.default)({
        emotionCache: cache
      }, props));
    },
    resolveProps: async initialProps => {
      const {
        styles
      } = extractCriticalToChunks(initialProps.html);
      return (0, _extends2.default)({}, initialProps, {
        emotionStyleTags: styles.map(style => /*#__PURE__*/(0, _jsxRuntime.jsx)("style", {
          "data-emotion": `${style.key} ${style.ids.join(' ')}`,
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML: {
            __html: style.css
          }
        }, style.key))
      });
    }
  }, ...((_options$plugins = options == null ? void 0 : options.plugins) != null ? _options$plugins : [])])(ctx);
}