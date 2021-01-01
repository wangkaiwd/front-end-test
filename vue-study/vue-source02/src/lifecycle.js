import { patch } from './vdom/patch';

export function lifecycleMixin (Vue) {
  Vue.prototype._update = function (vNode) {
    const vm = this;
    // 会创建新的DOM，需要将旧的vm.$el替换掉
    vm.$el = patch(vm.$el, vNode);
  };
}

export function mountComponent (vm) {
  vm._update(vm._render());
}
