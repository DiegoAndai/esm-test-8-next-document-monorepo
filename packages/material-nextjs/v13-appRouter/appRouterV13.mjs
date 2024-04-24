'use client';

import _extends from "@babel/runtime/helpers/esm/extends";
import * as React from 'react';
import createCache from '@emotion/cache';
import { CacheProvider as DefaultCacheProvider } from '@emotion/react';
import { useServerInsertedHTML } from 'next/navigation';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Emotion works OK without this provider but it's recommended to use this provider to improve performance.
 * Without it, Emotion will generate a new <style> tag during SSR for every component.
 * See https://github.com/mui/material-ui/issues/26561#issuecomment-855286153 for why it's a problem.
 */
export default function AppRouterCacheProvider(props) {
  const {
    options,
    CacheProvider = DefaultCacheProvider,
    children
  } = props;
  const [registry] = React.useState(() => {
    const cache = createCache(_extends({}, options, {
      key: options?.key ?? 'mui'
    }));
    cache.compat = true;
    const prevInsert = cache.insert;
    let inserted = [];
    // Override the insert method to support streaming SSR with flush().
    cache.insert = (...args) => {
      if (options?.enableCssLayer) {
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
  useServerInsertedHTML(() => {
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
    return /*#__PURE__*/_jsxs(React.Fragment, {
      children: [globals.map(({
        name,
        style
      }) => /*#__PURE__*/_jsx("style", {
        nonce: options?.nonce,
        "data-emotion": `${registry.cache.key}-global ${name}`
        // eslint-disable-next-line react/no-danger
        ,
        dangerouslySetInnerHTML: {
          __html: style
        }
      }, name)), styles && /*#__PURE__*/_jsx("style", {
        nonce: options?.nonce,
        "data-emotion": dataEmotionAttribute
        // eslint-disable-next-line react/no-danger
        ,
        dangerouslySetInnerHTML: {
          __html: styles
        }
      })]
    });
  });
  return /*#__PURE__*/_jsx(CacheProvider, {
    value: registry.cache,
    children: children
  });
}