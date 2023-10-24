# 附录A：类型注释

本书主要采用JavaScript编写插件，同时通过JSDoc的方式标注变量和函数的类型信息。JSDoc语法也是TypeScript支持的，特别适合描述API的类型信息，同时保持实现的灵活性。这些简要介绍类型注释的基本用法。

## A.1 基本用法

变量在声明时可以通过注释语法明确指定一个类型：

```js
/**@type {number} */
let x;
```

也可以对一个值做强制转型：

```js
let x = /**@type {any}*/(0);
```

给函数增加类型信息：

```js
/**
 * @param  {number} a
 * @param  {...number} more
 * @return {number}
 */
function sum(a, ...more) {
	for(let i = 0; i < more.length; i++) {
		a += more[i];
	}
	return a;
}
```

参数`a`是数值类型，`more`是可变数值类型参数，返回值是数值类型。

如果是函数类型的变量或常量类型，可以这样表示：

```js
/**@type {function(number, number):number} */
let sum2;

/**@type {(a:number, b:number) => number} */
let sum3;
```

如果是遇到不好表示的类型可以暂时忽略，毕竟我们优先选择JavaScript的因素是方便先实现功能。

## A.2 基础类型

基础类型是JavaScript已有的基础类型，主要有`boolean`、`number`、`string`等。基础类型直接通过内置的名字就可以引用：

```js
/**@type {boolean} */
let b0;

/**@type {number} */
let i0;

/**@type {string} */
let s0;
```

上面的例子就是定义了三个对于三种基本类型的变量。通过组合基础类型可以构造更复杂的类型。JavaScript种除了基础类型之外，还有`object`和`any`表示的对象。在这里不用纠结这些类型在运行时的差异，只要是TypeScript内置名字的类型都可以看作是基础类型，比如`unknown`等在编译阶段也可以算是基础类型。此外还有仅针对函数返回值的`void`类型。


## A.3 复合类型

复合类型是通过组合基础类型或者是其它的复合类型，组合有数组、元组、联合、对象等多种不同的方式。以下是复合类型的一些例子：

```js
/**@type {boolean[]} */
let array0;

/**@type {[number,string]} */
let tulpe0;

/**@type {number|string} */
let union0;

/**@type { {a:boolean, b:number, c:object} } */
let object0;

/**@type { (number|string)[] } */
let array_union;
```

其中`array0`是在布尔基础类型之上通过数组的方式构建出布尔数组复合类型。而`tulpe0`是基于数值和字符串构造的元组类型。`union0`则是可以表示数值或字符串之一的联合类型。然后`object0`通过对象方式构造出一个有三个不同类型成员的对象类型。最后的`array_union`则是在联合类型的基础之上又结合数组组合方式构造的联合数组类型变量。


## A.4 命名类型

不管是基础类型还是复合类型，只有底层的类型组合方式完全一致就是相同的类型。而命名类型只是为了方便表示，命名类型和原始的类型依然是同一种类型。

通过`@typedef`可以给类型命名：

```js
/**@typedef { boolean } MyBool*/

/**@type {boolean} */
let b2;

/**@type {MyBool} */
let b3 = b2;
```

在这里`boolean`被重新命名为`MyBool`。不过两者依然是相同的类型，因此`b2`和`b3`可以不用强制转型直接进行相互赋值。

通过`@typedef`还可以给复合类型命名：

```js
/**@typedef { {x:number, y:number, z:number} } Point*/

/**@type {Point} */
let pt1 = null;
```

这里例子定义了一个`Point`点对象类型，每个点对象必须有`x`、`y`、`z`三个成员表示三维坐标信息。


## A.5 类型导入

类型导入是指从其它的JavaScript模块导入类型。为了方便演示，我们先构造一个`lib.js`文件：

```js
/**
 * @typedef { {Name:string, Age:number} } Person
 */

/**@type {Person} */
export let gopher = {
	Name: "golang",
	Age: 10,
};
```

其中定义了一个`Person`类型，定义并且导出了一个该类型的变量`gopher`。然后我们创建`main.js`文件，并在其中导入`lib.js`模块中的类型：

```js
/**@type { import("./lib.js").Person } */
let clang;
```

注释中的`import("./lib.js").Person`引用的就是导入`lib.js`模块中的类型。除了可以直接引用导入模块的类型之外，我们也可以从导入模块的变量或常量推导类型：

```js
/**@type { typeof import("./lib.js").gopher } */
let cpplang;
```

注释中的`typeof import("./lib.js").gopher`根据`lib.js`模块导出的`gopher`变量推导出`Person`类型信息。甚至我们可以将从导入模块引用或者推导出的类型再次命名。

这时候`x`将明确指定为数值类型。但是`typeof x`在运行时输出的依然是`undefined`。因此TypeES6编程实践中的类型更多的是开发阶段的类型信息，所以的编译阶段的类型信息在运行时将不再存在。

在编译阶段（或者叫开发阶段），对于指定了数值类型的变量将不再接受字符串赋值：

```js
/**@type {number} */
let x;
x = 'abc';
```


我们也可以用以下两种方式明确指定数组的类型：

```js
/**@type {number []}*/
let list2 = [1, 2, 3];

let list3 = /**@type {number[]}*/([1, 2, 3]);
```

其中第一个语句是在声明时通过TypeES6的注释语法将`list2`变量声明为`number []`类型。第二个语句则是通过将初始化的数组值`[1, 2, 3]`转型为`number[]`类型后赋值给`list3`变量，这样`list3`变量就可以根据初始化的值类型推导出自己的类型。

需要的注意的是，在给初始值转型时千万要用小括号将值包括起来，否则会导致类型注释不能生效。比如下面的写法是错误的：

```js
// 错误: 类型注释没有生效, 缺少了小括号
let list4_failed = /**@type {number[]}*/[1, 2, 3];
```

虽然最终`list4_failed`变量依然是`number[]`类型，但是这个类型却不是由`/**@type {number[]}*/`类型注释产生，而是因为`[1, 2, 3]`默认就是`number[]`类型的数组。


比如下面的代码将无法即使发现错误：

```js
// 错误: 类型注释没有生效, 缺少了小括号
let list5_failed = /**@type {number[]}*/[1, 2, '3'];
```

这时候初始值默认是`(number|string)[]`类型，而不是我们注释的`number[]`类型。下面通过添加缺少的小括号让类型注释生效：

```js
let list5_ok1 = /**@type {number[]}*/([1, 2, '3']);
let list5_ok2 = /**@type {(number|string)[]}*/([1, 2, 'a']);
```

这样的话，`list5_ok1`变量就是明确的`number[]`类型，而`list5_ok2`则是`(number|string)[]`类型。现在虽然变量是我们期望的类型，但是`list5_ok1`变量初始值的第三个元素被错误地写成了字符串类型，而且命令行没有任何错误提升！


我们采用第一种指定变量类型的写法，这样可以发现初始值不匹配的错误：

```js
/**@type {number []}*/
let list5_ok3 = [1, 2, 'a'];
```


最后，我们依然可以定义`any`类型的数组：

```js
/**@type {any[]}*/
let list6 = [true, 1, 'a', {}, null];
```

这样的话，我们就可以在`list6`数组变量中存放不同类型的元素。不过这样也就丢失TypeES6的类型检查优势，因此建议谨慎使用`any`类型的数组。


