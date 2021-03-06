// require  es module
(() => { // build source code
  const modules = {
    './src/index.js': (module, exports, _require) => {
      // Symbol.stringTag控制Object.prototype.toString后打印的字符内容
      _require.r(exports);
      const title = _require('./src/title02.js');
      console.log('title', title);
    },
    './src/title02.js': (module, exports, _require) => {
      // 源代码
      // exports : 导出的内容
      const __WEBPACK_DEFAULT_EXPORT__ = 'title name';
      const age = 'title_age';
      _require.r(exports);
      // 为exports 传入所有的 getter
      _require.d(exports, { // 给module.exports 导出的对象添加了default,age方法
        default: () => __WEBPACK_DEFAULT_EXPORT__,
        age: () => age
      });
    }
  };
  const cache = {};

  function _require (moduleId) {
    const module = cache[moduleId] = { exports: {} };
    modules[moduleId].call(module, module, module.exports, _require);
    return module.exports; // 'title'
  }

  // define __esModule on exports
  // Symbol.toStringTag 是一个字符串属性值，在创建一个对象默认字符串描述中被使用
  // 通过Object.prototype.toString方法来内部的访问它
  // 这里的作用 Object.prototype.toString.call(esModule) === '[object Module]'
  // 用于区分对象的类型，可以判断是否是esModule，并且为其添加了__esModule属性
  _require.r = function (exports) {
    if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
      Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
    }
    Object.defineProperty(exports, '__esModule', { value: true });
  };
  // hasOwnProperty shorthand
  _require.o = function (obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
  };

  // define getter function for harmony exports
  _require.d = function (exports, definition) {
    for (const key in definition) {
      if (_require.o(definition, key) && !_require.o(exports, key)) {
        Object.defineProperty(exports, key, {
          enumerable: true,
          get: definition[key]
        });
      }
    }
  };
  // index.js: self execute function avoid pollute global variables
  (() => {
    _require('./src/index.js');
  })();
})();
