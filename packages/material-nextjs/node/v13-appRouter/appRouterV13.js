"use strict";
'use client';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = AppRouterCacheProvider;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var React = _interopRequireWildcard(require("react"));
var _cache = _interopRequireDefault(require("@emotion/cache"));
var _react2 = require("@emotion/react");
var _navigation = require("next/navigation");
var _jsxRuntime = require("react/jsx-runtime");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
/**
 * Emotion works OK without this provider but it's recommended to use this provider to improve performance.
 * Without it, Emotion will generate a new <style> tag during SSR for every component.
 * See https://github.com/mui/material-ui/issues/26561#issuecomment-855286153 for why it's a problem.
 */
function AppRouterCacheProvider(props) {
  const {
    options,
    CacheProvider = _react2.CacheProvider,
    children
  } = props;
  const [registry] = React.useState(() => {
    var _options$key;
    const cache = (0, _cache.default)((0, _extends2.default)({}, options, {
      key: (_options$key = options == null ? void 0 : options.key) != null ? _options$key : 'mui'
    }));
    cache.compat = true;
    const prevInsert = cache.insert;
    let inserted = [];
    // Override the insert method to support streaming SSR with flush().
    cache.insert = (...args) => {
      if (options != null && options.enableCssLayer) {
        args[1].styles = `@layer mui {${args[1].styles}}`;
      }
      const [selector, serialized] = args;
      if (cache.inserted[serialized.name] === undefined) {
        inserted.push({
          name: serialized.name,
          isGlobal: !selector
        });
      }
      return prevInsert(...args);
    };
    const flush = () => {
      const prevInserted = inserted;
      inserted = [];
      return prevInserted;
    };
    return {
      cache,
      flush
    };
  });
  (0, _navigation.useServerInsertedHTML)(() => {
    const inserted = registry.flush();
    if (inserted.length === 0) {
      return null;
    }
    let styles = '';
    let dataEmotionAttribute = registry.cache.key;
    const globals = [];
    inserted.forEach(({
      name,
      isGlobal
    }) => {
      const style = registry.cache.inserted[name];
      if (typeof style !== 'boolean') {
        if (isGlobal) {
          globals.push({
            name,
            style
          });
        } else {
          styles += style;
          dataEmotionAttribute += ` ${name}`;
        }
      }
    });
    return /*#__PURE__*/(0, _jsxRuntime.jsxs)(React.Fragment, {
      children: [globals.map(({
        name,
        style
      }) => /*#__PURE__*/(0, _jsxRuntime.jsx)("style", {
        nonce: options == null ? void 0 : options.nonce,
        "data-emotion": `${registry.cache.key}-global ${name}`
        // eslint-disable-next-line react/no-danger
        ,
        dangerouslySetInnerHTML: {
          __html: style
        }
      }, name)), styles && /*#__PURE__*/(0, _jsxRuntime.jsx)("style", {
        nonce: options == null ? void 0 : options.nonce,
        "data-emotion": dataEmotionAttribute
        // eslint-disable-next-line react/no-danger
        ,
        dangerouslySetInnerHTML: {
          __html: styles
        }
      })]
    });
  });
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(CacheProvider, {
    value: registry.cache,
    children: children
  });
}