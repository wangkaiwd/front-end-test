// 可能的类型：
// JSON.parse(JSON.stringify())
// A value can be a string in double quotes, or a number, or true or false or null, or an object or an array.
// 1. 对象或数组的原型要拷贝吗？(目前不拷贝)
// 2. Date, Math如何处理？
// 3. regexp 要如何处理: ok
// 4. function 如何处理: ok
// 5. undefined 如何处理？(JSON.stringify)
// 6. 环形对象该如何处理？
//    1.通过数组来存放处理过的数组和对象，每次遍历时先在数组中查找，找到说明是循环引用，停止遍历: 注意数组中要具体如何存放
//    2.通过WeakMap来存放处理过的数组和对象，每次遍历时现在WeakMap中查找，找到说明循环引用，停止遍历: WeakMap的key和value是哪些值
// 7. 爆栈问题如何解决？
//    使用循环来实现deepClone
// https://www.json.org/json-en.html

// 思路：
// what: 解决什么问题？
// how: 怎么解决？
// pros: 优点?
// cons: 缺点？
// more: 解决缺点的方案？
function getType (value) {
  return Object.prototype.toString.call(value).slice(8, -1);
}

const strategies = {};
// 数组：
// [{raw: obj, copy: _obj}]
// 问题：查找是否处理过该对象比较麻烦，每次都要遍历数组，时间复杂度较高
//      最好单独创建一个函数来完成这件事，之后直接调用该函数即可
strategies.object = function (value, cache) {
  // 如果value已经遍历过的话，返回其对应的deepClone的值
  if (cache.has(value)) {
    // var obj = {a:1}
    // obj.self = obj
    // {a:1,self:{a:1,self: {a:1,self: {a:1, ...}}}}
    // 当处理到self时,会发现之前已经将{a:1,self:{...}}存到了cache中，此时将
    return cache.get(value);
  } else {
    const result = {};
    // 要先将result添加到cache中，之后会由于引用关系，在修改result时也会同时修改cache中的result
    // 之后通过value从缓存中找到result,然后将其赋值给了result.self属性，完成了一个环的拷贝 // result.self = result
    // 要在再次调用deepClone之前来将其添加到缓存中，否则先调用deepClone，会无法在缓存中找到对应的引用
    cache.set(value, result);
    // Object.keys只会按照对象被遍历的顺序来遍历对象自身的可枚举属性
    const keys = Object.keys(value);
    keys.forEach(key => {
      result[key] = deepClone(value[key], cache);
    });
    return result;
  }
};
strategies.regexp = function (value) {
  return new RegExp(value.source, value.flags);
};
strategies.array = function (value, cache) {
  if (cache.has(value)) {
    return cache.get(value);
  } else {
    const result = [];
    cache.set(value, result);
    value.forEach(item => {
      result.push(deepClone(item, cache));
    });
    return result;
  }
};
strategies.function = function (value) {
  return function () { // 这里通过bind进行拷贝，this需要在调用前指定，不太好
    // 函数的拷贝：返回一个新的函数，该函数会执行被拷贝的函数，并且通过apply将新函数和被拷贝函数的this指向同一个值
    return value.apply(this, arguments);
  };
};
// 所有的策略都不满足，执行默认策略
strategies.default = function (value) {
  return value;
};
// 如果key为对象的话，并且不需要所有key的列表，最好使用WeakMap
// 问题？
// 1. 可以用Set吗？
// 2. WeakMap vs Map
// 3. es5： 数组
const deepClone = (value, cache = new WeakMap()) => { // clone之后返回深拷贝后的内容
  const type = getType(value).toLowerCase();
  const strategy = strategies[type] || strategies.default;
  return strategy(value, cache);
};

class Person {
  say () {
    console.log('say');
  }
}

function cloneRegexp () {
  const p = new Person();
  const reg = /a/g;
  const cloneReg = deepClone(reg);
  cloneReg.lastIndex = 2;
  console.log(cloneReg.lastIndex, reg.lastIndex);
}

function cloneCircular () {
  const obj = { a: 1 };
  obj.self = obj;
  const cloneObj = deepClone(obj);
  obj.self = 'xx';
  console.log(cloneObj, obj);
}

cloneCircular();