## `jQuery`源码

### `jQuery`整体思想

#### 无`new`使用`jQuery`
* `jQuery.fn.init`
* `jQuery.extend`
* `jQuery.fn.ready`
* `jQuery.noConflict`

`$('.box)`执行做了什么事情

理解`jQuery`的多种角色：
* 普通函数
* 构造函数
* 对象

### 原生对象和`jQuery`对象相互转换
> 一个函数传入不同数量和类型的参数实现不同的功能(函数重载)

相互之间灵活转化，分别调用`jQuery`对象的属性和方法和原生`DOM`对象上的属性和方法

### 数据类型检测

### 事件绑定
> 核心思想：发布订阅模式
* `on`
* 快捷绑定: `element.click`
* `bind/delegate/one`

### 常用`api`
* `each`