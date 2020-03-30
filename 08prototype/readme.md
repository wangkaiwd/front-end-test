## 原型链和原型的底层运行机制
* 每一个类(函数)都具备`prototype`，并且属性值是一个对象
* `prototype`对象上本身一个属性：`constructor`，指向类本身
* 每一个对象(普通对象、`prototype`、实例、函数等)都具备：`__proto__`属性，属性值是当前实例所属类的原型

```javascript
function Fn () {
  this.x = 100;
  this.y = 200;
  this.getX = function () {
    console.log(this.x);
  };
}

Fn.prototype.getX = function () {
  console.log(this.x);
};

Fn.prototype.getY = function () {
  console.log(this.y);
};

const f1 = new Fn();
const f2 = new Fn;

console.log(f1.getX === f2.getX); // false
console.log(f1.getY === f2.getY); // true

console.log(f1.__proto__.getY === Fn.prototype.getY); // true
console.log(f1.__proto__.getX === f2.getX); // false
console.log(f1.getX === Fn.prototype.getX); // false
console.log(f1.constructor); // Fn
console.log(Fn.prototype.__proto__.constructor); // Object

f1.getX(); // 100
f1.__proto__.getX(); // undefined
f2.getY(); // 200
Fn.prototype.getY(); // undefined
```

<details>
  <summary>diagram</summary>
  
  ![](https://raw.githubusercontent.com/wangkaiwd/drawing-bed/master/20200326232606.png)
  ![](https://raw.githubusercontent.com/wangkaiwd/drawing-bed/master/20200327003810.png)
</details>

数组原型链图，并扩展原型上的方法，且支持链式调用：
![](https://raw.githubusercontent.com/wangkaiwd/drawing-bed/master/20200327004016.png)

借用数组上的`slice`方法，来将字符串或者伪数组(如`arguments`)转换为真实数组：
```javascript
function fn () {
  return Array.prototype.slice.call(arguments, 0);
}
console.log(fn(1, 2, 3, 4, 5));

console.log(Array.prototype.slice.call('这是一段字符串', 0)); // ['这','是','一','段','字','符','串']
```
![](https://raw.githubusercontent.com/wangkaiwd/drawing-bed/master/20200327005239.png)

### 测试题

#### 基于内置类原型扩展方法

在`Number`的原型上添加方法，实现下面的调用
```javascript
let n = 10;
let m = n.plus(10).minus(5);
console.log(m);//=>15（10+10-5）
```
<details>
  <summary>answer</summary>
  
  ```javascript
  (function (proto) {
    const toNumber = number => {
      number = Number(number);
      if (isNaN(number)) {
        number = 0;
      }
      return number;
    };
  
    proto.plus = function (number) {
      return this + toNumber(number);
    };
    proto.minus = function (number) {
      return this - toNumber(number);
    };
  })(Number.prototype);  
  ```
</details>

#### 重置类的原型指向
重置原型指向，会丢失constructor属性，需要进行手动指定：
```javascript
fun.prototype = {
  b: function () {
    this.a = 20;
    alert(this.a);
  },
  c: function () {
    this.a = 30;
    alert(this.a);
  },
};
var my_fun = new fun();
my_fun.b(); // 0
my_fun.c(); // 30
```
<details>
  <summary>answer</summary>
  
  ![](https://raw.githubusercontent.com/wangkaiwd/drawing-bed/master/20200328170420.png)
</details>

理解了详细的执行过程后，我们再回答一下下边的俩个问题：
```javascript
console.log(my_fun.constructor);
fun.prototype.b();
```

#### 对象原型结合代码执行机制
函数多种角色和运算符优先级
![](https://raw.githubusercontent.com/wangkaiwd/drawing-bed/master/20200328180222.png)

#### 惰性函数和闭包
 
编写一个`add`函数满足如下需求
```javascript
add(1);       //1
add(1)(2);    //3
add(1)(2)(3); //6
add(1)(2, 3);  //6
add(1, 2)(3);  //6
add(1, 2, 3);   //6
```