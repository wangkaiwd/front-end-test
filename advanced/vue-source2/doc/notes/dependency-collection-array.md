## 依赖收集
* 数组依赖收集处理
* `[[1],2,3]`: 二维数组如何处理？

总结：  
* 为数组单独创建依赖进行收集，因为数组中的值依旧是数组的话，不会执行其对应的`get`方法，无法进行依赖收集
* 解决方法是为数组添加`__ob__`属性，该属性中拥有`dep`，可以收集`watcher`，方便在调用数组方法后进行更新

### 作业
* 查看源码是如何处理这里的逻辑的

