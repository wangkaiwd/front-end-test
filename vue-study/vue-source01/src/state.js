import { observe } from './observer';
import { nextTick } from './util';
import Watcher from './observer/watcher';

function initState (vm) {
  const { props, methods, data, computed, watch } = vm.$options;
  if (props) {
    initProps(vm);
  }
  if (methods) {
    initMethods(vm);
  }
  if (data) {
    initData(vm);
  }
  if (computed) {
    initComputed(vm);
  }
  if (watch) {
    initWatch(vm);
  }
}

function initProps (vm) {}

function initMethods (vm) {}

function initData (vm) {
  let data = vm.$options.data;
  vm._data = data = typeof data === 'function' ? data.call(vm) : data;
  // 放在了vm._data上，方便之后直接调用
  observe(data);
  // 通过vm._data.xxx来访问比较麻烦，可以通过将_data的属性直接代理到vm上
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      proxy(vm, data, key);
    }
  }
}

function initComputed (vm) {
  const { computed } = vm.$options;
  const watchers = vm._computedWatchers = {};
  for (const key in computed) {
    if (computed.hasOwnProperty(key)) {
      const userDef = computed[key];
      // function() {}  {get() {},set() {}}
      const getter = typeof userDef === 'function' ? userDef : userDef.get;
      watchers[key] = new Watcher(vm, getter, () => {}, { lazy: true });
      defineGetter(vm, key, userDef);
    }
  }
}

function computedGetter (key) {
  return function () { // 获取计算属性的值
    const watcher = this._computedWatchers[key];
    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate();
      }
      return watcher.value;
    }
  };
}

function defineGetter (target, key, userDef) {
  // const config = {};
  // if (typeof userDef === 'function') {
  //   config.get = userDef;
  // } else if (typeof userDef === 'object') {
  //   config.get = userDef.get;
  //   config.set = userDef.set;
  // }
  Object.defineProperty(target, key, {
    get: computedGetter(key)
  });
}

function createWatcher (vm, key, handler) {
  vm.$watch(key, handler);
}

function initWatch (vm) {
  const { watch } = vm.$options;
  for (const key in watch) {
    if (watch.hasOwnProperty(key)) {
      const handler = watch[key];
      createWatcher(vm, key, handler);
    }
  }
}

export default initState;

function proxy (target, source, key) {
  Object.defineProperty(target, key, {
    get () {
      return source[key]; // 会调用data中属性的取值操作
    },
    set (newValue) {
      source[key] = newValue; // 会调用data中属性的设置值操作
    }
  });
}

export function stateMixin (Vue) {
  Vue.prototype.$nextTick = function (cb) {
    nextTick(cb);
  };

  Vue.prototype.$watch = function (key, handler, options) {
    new Watcher(this, key, handler, { ...options, user: true });
  };
}
