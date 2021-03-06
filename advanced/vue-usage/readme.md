## Vue使用
### 响应式


### 实例常见属性
* vm.$mount
* vm.$el
* vm.$options
* vm.$$data
* vm.$watch
* vm.$nextTick
* vm.$set
* vm.$delete

### 指令
* v-once
* v-html
* v-text
* v-if(阻止后续逻辑的生成)
* v-show(不能再template上使用)
* v-bind(:)
* v-on(@) 事件绑定直接绑定给当前元素
* v-model(.lazy,.number,.trim)
* custom directive
  * v-focus
  * v-click-outside

v-for和v-if 不要使用在同一个元素上，可能会导致性能浪费

可以先通过计算属性将值计算好，然后再进行遍历

### watch + computed
* computed set 方法(结合v-model)
  * 例子：全选，反选
  * 计算属性取值的时候才会执行
* watch: 属性值为字符串表示method中的方法
  * 首次渲染时一定会执行，用来来计算老值。之后再赋值时获取新值

### 生命周期
> 由于`Vue`实例是一个引用类型，所以可以通过深拷贝，或者通过断点来查看每个生命周期对应的Vue实例内容，可以查看其初始化进行到了哪里，哪些值能用，哪些值不能用。

* mixins

### 动画
* 添加购物车动画
* v-leave 没有用，只是为了设计美感

### 组件
* `Vue.extend`用法
* 手动挂载组件
* 组件通信
  * props
  * emit
  * 双向绑定 v-model/.sync
  * custom event
  * provide/inject(自己实现工具库)
  * $children/$parent 直接触发儿子或父亲的事件
  * $attrs/$listeners
* 原型自定义方法，实现快速跨级通信：
  * $dispatch
  * $broadcast
* eventBus 
* 子组件如何监听父组件的`mounted`事件(`eventBus`)
* slot

#### 快速原型开发
* [instant prototyping](https://cli.vuejs.org/guide/prototyping.html#instant-prototyping)
* `yarn`的[全局安装命令](https://classic.yarnpkg.com/en/docs/cli/global/) 没有类似于`npm`一样的缩写： `yarn global add package-name`
