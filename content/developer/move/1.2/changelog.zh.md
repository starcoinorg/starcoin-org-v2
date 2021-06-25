+++
title = "Move 1.2 更新"
date = "2020-04-09"
image = 'read.jpg'
summary = " "
archives="2020"
author = "Tim"
+++

<br />

# Abilities

* 状态：Move 1.2已实现



### 介绍

Abilities是Move 1.2中支持的新的特性，可以更好地控制给定类型的值所允许的操作。在Move以前的类型系统中，有copyable的值和 `resource` 的值。在旧的系统中，copyable的值是不受约束的，但是resource的值不能被拷贝并且必须被使用掉。使用ability，Move的类型系统有更细粒度的控制能力，允许类型对它的值专门进行某些操作，这些操作以前会根据“分类”(copyable还是resource)隐式允许或者不允许。



### 动机

Move的分类系统是强大的，但是对某些场景来说，没有足够的表达能力。Resource类型非常强大，但是系统捆绑了多种行为到这一个分类上，这些行为并不是所有场景都需要。在Diem框架中，需要表达一种像“烫手的山芋”一样的类型——它不能被拷贝或者丢弃(像一个resource)，但是也不能保存到全局存储中。那么它就像一个“烫手的山芋”，因为你必须一直传递它，并且必须在交易完成之前消耗掉它。具有这些约束的类型，必须允许通过move prover来验证这些特殊的能力。



扩展分类系统可以处理“烫手的山芋”这个例子，但不是最好的面向未来的解决方案。一个更细粒度的系统可以给程序员更多的控制权，不仅可以实现“烫手的山芋”这样的类型，还可以满足未知的需求。例如，我们希望新系统足够灵活，以便在未来进行扩展，而无需对类型系统进行另一次大规模重构。



### 描述

copyable和resource分类被4种新的ability替代。这些ability可以通过多种字节码指令获得。为了让某个值有相应的ability(如果只需要一种ability——并不需要把所有的ability都加上)，只需要使用对应的字节码指令。



### ability

这4个添加的ability分别是`copy`, `drop`, `store`, 和 `key`。下面是详细介绍：

* `copy`
  * 允许这个类型的值可以被拷贝
  * 入口： `CopyLoc` 和 `ReadRef`
  * 如果一个值可以拷贝，那么它内部所有值都能被拷贝
* `drop`
  * 允许这个类型的值被弹出或者丢弃
    * 所有权不能被转移
  * 入口：`Pop`, `WriteRef`, `StLoc`, `Eq` 和 `Neq`
  * 当函数返回`Ret`时，保留在局部变量中的值必须能`drop`
  * 如果一个值可以`drop`，那么它内部所有值都能被`drop`
* `store`
  * 允许这个类型的值保存在全局存储的结构体中
    * 但不一定是全局存储中的顶级值
  * 这是目前唯一不能被直接检查的ability，但是可以通过`key`间接检查
  * 如果一个值可以`store`，那么它内部所有值都能被`store`
* `key`
  * 允许这个类型作为全局存储的键操作
    * 让这个类型的值在全局存储的顶级
  * 入口： `MoveTo`, `MoveFrom`, `BorrowGlobal`, `BorrowGlobalMut`, 和 `Exists`
  * 如果一个值可以`key`，那么它内部所有值都能被`store`



### 原始类型

除了`signer`之外，其他的所有原始类型都有 `copy`, `drop`, 和 `store`。

* `bool`, `u8`, `u64`, `u128`, 和 `address` 都有 `copy`, `drop`, and `store`。
* `signer`有`drop`。
  * 不能拷贝，并且不能保存到全局存储中。
* `vector<T>`有没有`copy`, `drop`, 和`store`依赖于`T`的ability。
  * 查看更多[泛型类型的条件ability](#泛型类型的条件ability)
* 不可变引用 `&` 和可变引用 `&mut` 都有 `copy` 和 `drop`。
  * 这是指复制和删除引用本身，而不是它们所引用的内容。
  * 引用不能保存到全局存储中，因此它们没有 `store`。



### 声明结构体的ability

给 `struct` 添加ability，在结构体名称后面，但是在字段的前面，使用 `has ` 声明。例如:

~~~move
struct Ignorable has drop { f: u64 }
struct Pair has copy, drop, store { x: u64, y: u64 }
~~~

这样 `Ignorable` 有 `drop` 的ability， `Pair` 有 `copy`, `drop`, 和 `store`。

声明一个结构体的ability，对字段有一定的要求。所有字段都必须满足这些约束。这些规则是必要的，这样结构体才能满足上面的这些ability。如果一个结构体声明了ability...

- `copy`, 所有字段必须能 `copy`
- `drop`, 所有字段必须能 `drop`
- `store`, 所有字段必须能 `store`
- `key`, 所有字段必须能`store`
  - `key` 是目前唯一不需要自身的ability

举个栗子：

~~~move
// A struct without any abilities
struct NoAbilities {}

struct WantsCopy has copy {
    f: NoAbilities, // ERROR 'NoAbilities' does not have 'copy'
}
~~~

相似地：

~~~move
// A struct without any abilities
struct NoAbilities {}

struct MyResource has key {
    f: NoAbilities, // Error 'NoAbilities' does not have 'store'
}
~~~



### 基本例子

Copy

~~~move
struct NoAbilities {}
struct S has copy, drop { f: bool }

fun example(x: u64, s: S) {
    let x2 = copy x; // Valid, 'u64' has 'copy'
    let s2 = copy s; // Valid, 'S' has 'copy'
}

fun invalid(account: signer, n: NoAbilities) {
    let a2 = copy account; // Invalid, 'signer' does not have 'copy'
    let n2 = copy n; // Invalid, 'NoAbilities' does not have 'drop'
}
~~~

Drop

~~~move
struct NoAbilities {}
struct S has copy, drop { f: bool }

fun unused() {
    true; // Valid, 'bool' has 'drop'
    S { f: false }; // Valid, 'S' has 'drop'
}

fun left_in_local(account: signer): u64 {
    let b = true;
    let s = S { f: false };
    // Valid return: 'account', 'b', and 's' have values
    // but 'signer', 'bool', and 'S' have 'drop'
    0
}

fun invalid_unused() {
    NoAbilities {}; // Invalid, Cannot ignore 'NoAbilities' without 'drop'
}

fun invalid_left_in_local(): u64 {
    let n = NoAbilities{};
    // Invalid return: 'n' has a value and 'NoAbilities' does not have 'drop'
    0

}
~~~

Store

~~~move
// 'MyInnerResource' is declared with 'store' so all fields need 'store'
struct MyInnerResource has store {
    yes: u64, // Valid, 'u64' has 'store'
    // no: signer, Invalid, 'signer' does not have 'store'
}

// 'MyResource' is declared with 'key' so all fields need 'store'
struct MyResource has key {
    yes: u64, // Valid, 'u64' has 'store'
    inner: MyInnerResource, // Valid, 'MyInnerResource' has 'store'
    // no: signer, Invalid, 'signer' does not have 'store'
}
~~~

Key

~~~move
struct NoAbilities {}
struct MyResource has key { f: u64 }

fun valid(account: &signer) acquires MyResource {
    let addr = Signer::address_of(account);
    let has_resource = exists<MyResource>(addr); // Valid, 'MyResource' has 'key'
    if (!has_resource) {
        move_to(account, MyResource { f: 0 }) // Valid, 'MyResource' has 'key'
    };
    let r = borrow_global_mut<MyResource>(addr) // Valid, 'MyResource' has 'key'
    r.f = r.f + 1;
}

fun invalid(account: &signer) {
   let has_it = exists<NoAbilities>(addr); // Invalid, 'NoAbilities' does not have 'key'
   let NoAbilities {} = move_from<NoAbilities>(addr); // Invalid, does not have 'key'
   move_to(account, NoAbilities {}); // Invalid, 'NoAbilities' does not have 'key'
   borrow_global<NoAbilities>(addr); // Invalid, 'NoAbilities' does not have 'key'
}
~~~



### 泛型约束

ability也可用于约束泛型，只有具有相应ability的类型，才能实例化对应ability的泛型参数。这可以用于函数和结构体类型参数：

~~~move
fun foo<T: copy>(x: T): (T, T) { (copy x, x) }
struct CopyCup<T: copy> has copy { item: T }
~~~

类型参数可以用 `+` 表示多个约束

~~~move
fun bar<T: copy + drop>(x: T): T { copy x }
struct AllCup<T: copy + drop + store + key> has copy, drop, store, key { item: T }
~~~



## 泛型类型的条件ability

在泛型类型上声明ability时，并非该类型的所有实例都保证具有该ability。例如这个结构体声明：

~~~move
struct Cup<T> has copy, drop, store, key { item: T }
~~~

假定类型参数 `T` 在结构体内部使用，因此仅当 `T` 满足上述这些要求时结构体才有这些ability。这意味着

- `Cup` 只有在  `T` 有 `copy` 时才能 `copy`
- 只有在  `T` 有 `drop` 时才能 `drop`
- 只有在  `T` 有 `store` 时才能 `store`
- 只有在  `T` 有 `store`时才能 `key`

这种做法可能让人有点困惑，但对于类似集合类型非常有用。例如  `vector`：我们可以认为它具有以下类型声明：

~~~move
vector<T> has copy, drop, store;
~~~

这样，只有内部的元素能被拷贝，才能拷贝 `vector` 的值。只有内部的元素能被忽略或者丢弃，才能忽略 `vector` 的值。并且只有内部的元素能被保存在全局存储中， `vector` 才能保存到全局存储中。



### 更多例子

Copy

~~~move
struct NoAbilities {}
struct S has copy, drop { f: bool }
struct Cup<T> has copy, drop, store { item: T }

fun example(c_x: Cup<u64>, c_s: Cup<S>) {
    // Valid, 'Cup<u64>' has 'copy' because 'u64' has 'copy'
    let c_x2 = copy c_x;
    // Valid, 'Cup<S>' has 'drop' because 'S' has 'drop'
    let c_s2 = copy c_s;
}

fun invalid(c_account: Cup<signer>, c_n: Cup<NoAbilities>) {
    // Invalid, 'Cup<signer>' does not have 'copy'.
    // Even though 'Cup' was declared with copy, the instance does not have 'copy'
    // because 'signer' does not have 'copy'
    let c_account2 = copy c_account;
    // Invalid, 'Cup<NoAbilities>' does not have 'drop'
    // because 'NoAbilities' does not have 'drop'
    let c_n2 = copy c_n;
}
~~~

Drop

~~~move
struct NoAbilities {}
struct S has copy, drop { f: bool }
struct Cup<T> has copy, drop, store { item: T }

fun unused() {
    Cup<bool> { item: true }; // Valid, 'Cup<bool>' has 'drop'
    Cup<S> { item: S { f: false }}; // Valid, 'Cup<S>' has 'drop'
}

fun left_in_local(c_account: Cup<signer>): u64 {
    let c_b = Cup<bool> { item: true };
    let c_s = Cup<S> { item: S { f: false }};
    // Valid return: 'c_account', 'c_b', and 'c_s' have values
    // but 'Cup<signer>', 'Cup<bool>', and 'Cup<S>' have 'drop'
    0
}

fun invalid_unused() {
    // Invalid, Cannot ignore 'Cup<NoAbilities>' because it does not have 'drop'.
    // Even though 'Cup' was declared with 'drop', the instance does not have 'drop'
    // because 'NoAbilities' does not have 'drop'
    Cup<NoAbilities> { item: NoAbilities {}};
}

fun invalid_left_in_local(): u64 {
    let n = Cup<NoAbilities> { item: NoAbilities {}};
    // Invalid return: 'c_n' has a value
    // and 'Cup<NoAbilities>' does not have 'drop'
    0

}
~~~

Store

~~~move
struct Cup<T> has copy, drop, store { item: T }

// 'MyInnerResource' is declared with 'store' so all fields need 'store'
struct MyInnerResource has store {
    yes: Cup<u64>, // Valid, 'Cup<u64>' has 'store'
    // no: Cup<signer>, Invalid, 'Cup<signer>' does not have 'store'
}

// 'MyResource' is declared with 'key' so all fields need 'store'
struct MyResource has key {
    yes: Cup<u64>, // Valid, 'Cup<u64>' has 'store'
    inner: Cup<MyInnerResource>, // Valid, 'Cup<MyInnerResource>' has 'store'
    // no: Cup<signer>, Invalid, 'Cup<signer>' does not have 'store'
}
~~~

Key

~~~move
struct NoAbilities {}
struct MyResource<T> has key { f: T }

fun valid(account: &signer) acquires MyResource {
    let addr = Signer::address_of(account);
     // Valid, 'MyResource<u64>' has 'key'
    let has_resource = exists<MyResource<u64>>(addr);
    if (!has_resource) {
         // Valid, 'MyResource<u64>' has 'key'
        move_to(account, MyResource<u64> { f: 0 })
    };
    // Valid, 'MyResource<u64>' has 'key'
    let r = borrow_global_mut<MyResource<u64>>(addr)
    r.f = r.f + 1;
}

fun invalid(account: &signer) {
   // Invalid, 'MyResource<NoAbilities>' does not have 'key'
   let has_it = exists<MyResource<NoAbilities>>(addr);
   // Invalid, 'MyResource<NoAbilities>' does not have 'key'
   let NoAbilities {} = move_from<NoAbilities>(addr);
   // Invalid, 'MyResource<NoAbilities>' does not have 'key'
   move_to(account, NoAbilities {});
   // Invalid, 'MyResource<NoAbilities>' does not have 'key'
   borrow_global<NoAbilities>(addr);
}
~~~



### 向后兼容

新的ability系统能够兼容旧的分类系统的几乎所有场景。在字节码层面，旧分类的模块和脚本可以像ability编写出来的一样被加载。

对于任何结构体来说：

* 如果声明为可拷贝的，非`resource`结构体，那么该结构体将可以`copy`, `drop`, 和 `store`
* 如果声明为`resource`，该结构体将可以`store` 和 `key`
* 对于类型参数：
  * `copyable` 变成 `copy + drop`
  * `resource` 变成 `key`
  * `store` 没有，因为类型参数不需要关心这个限制。任何惯例将仍然可用。

对于任何函数来说：

* 对于类型参数：
  * `copyable` 变成 `copy + drop + store`
  * `resource` 变成 `key + drop`
  * `store` 是需要的，因为需要确定类型参数是否可以操作全局存储

将所有的这些规则总结起来，旧代码

~~~move
struct S<T: copyable> {}
resource struct R<T1: resource, T2> {}

fun foo<Tc: copyable, Tr: resource, T>() {}
~~~

将像下面这样被加载：

~~~move
struct S<T: copy + drop> has copy, drop, store {}
struct R<T1: key, T2> {}

fun foo<Tc: copy + drop + store, Tr: key + store, T: store>() {}
~~~

这导致了一个重大变化，即任何使用`signer`作为类型参数实例化的函数现在都不会加载，因为类型参数将具有`store`约束——所有旧的函数类型参数都被赋予`store`约束——但`signer`会没有`store`。鉴于`signer`的使用受限，这可能是一个极端情况，我们认为这不是问题。



## 其他考虑

### 扩展分类系统

作为这个更改的主要动机的例子，考虑向系统添加“烫手的山芋”的分类。在分类系统中有：

* `Copyable` 相当于 `copy + drop + store`
* `Resource` 相当于 `key + store`
* `All` 有时候相当于 `store` ，有时候相当于没有任何ability

可以看成`Copyable <: All` 和 `Resource <: All`这样的子分类系统。添加一种`HotPotato`分类比较难，可能的层次结构是`Copyable <: All` 和 `Resource <: HotPotato <: All`。但是，这样会混乱：

* 添加一种`AllWithStore`分类，层次结构`Copyable <: AllWithStore <: All` 和 `Resource <: AllWithStore <: All` 和 `Resource <: HotPotato <: All`
* 如果增加任何其他的类型，复杂性可能会迅速爆炸

这种子分类方案的复杂性导致了上面描述的更细粒度的方案。我们非常担心在一两年内需要另一种类型，然后整个事情就会崩溃。有了ability，如果需要，我们随时可以非常轻松地添加新的ability。

### 显式条件ability

当前围绕泛型以泛型类型为条件的规则可能会令人困惑，特别是考虑到关键字 `has` 。例如：

~~~move
struct Cup<T> has copy, drop, store { item: T }
~~~

尽管明确地说“可以拷贝”、“可以丢弃”和“可以存储”，`Cup<T>` 也不一定有对应的ability，取决于 `T` 是什么。这可能比较混乱。你可能会希望这样写泛型类型：

~~~move
struct Cup<T> has ?copy, ?drop, ?store { item: T }
~~~

这将意味着我们现在有明确的定义，它有没有ability取决于`T`，然后使用`has`不使用`?`标记

~~~move
struct Ex<T> has copy {}
~~~

将相当于

~~~move
struct Ex<T: copy> has ?copy {}
~~~

那么潜在的问题就在于，有很多没有意义的组合。因此，在很多情况下，编译器会提示只有一种有效组合。

* `struct Ex<T: copy> has copy` 是多余的，跟 `struct Ex<T> has copy`一样
* 对一个非泛型的类型，`struct Ex has ?copy` 没有意义，等于所有实例都有ability，跟`struct Ex has copy`一样

简而言之，使用`?`标记导致很多混乱。而且，系统并没有增加更多的表达能力，程序员可能会这么声明泛型`struct Cup<T: copy> has copy`，这将强制每个实例以更明确的方式进行复制。简而言之，单一选项和单一规则，在读取方式上可能会有点混乱，但减少了在声明结构体时的复杂性。

### 其他名称

ability系统从各个方面考虑了不同的名称：

* 除了“ability”，“traits”, “type classes”, and “interfaces” 都考虑过。但是这些在其他编程语言中使用的名称，通常用于描述程序员自定义的东西。程序员不能自定义ability。另外，ability不会提供类似动态调度的东西。因此，虽然这些名称可能更熟悉，但我们担心会引起误解。
* 也考虑过`copyable`和`dropable`和`storable`，但是感觉太啰嗦，简洁的名字更合适。
* 也考虑过`mustuse`或者 `mustmove` 替代 `drop`，即使它们的信息量更大，但是更简洁的名称感觉更好。
* 考虑过`resource` 替代`key`。`key`在很多情况下像`resource` ，但是在有些情况下感觉很古怪，比如`Coin`，在旧系统中可能是`resource struct Coin`，在新系统中可能是`struct Coin has store`并且不是“resource”，因此，我们将“resource”预留，以便在没有`copy` 或者 `drop`的时候用。


# Friend可见性

* 状态: Move 1.2已实现

## 说明

Friend可见性是Move 1.2的新特性，用于更好的控制函数的调用。原来函数只有public和private两种可见性，public的函数可以被任意调用，但是private的函数只能在被定义的模块中使用。Friend可见性函数只能被明确允许的模块调用。

## 动机

### 宽松的函数可见性模型

简单的public/private可见性方案，实现“受限访问”函数需要使用public可见性，如下：

* 函数通过已知的特定模块列表（例如，许可名单）进行有限访问
* 特定的许可名单之外的其他模块不能访问

用Diem框架中的`initialize`函数来举例。理论上，`initialize`函数应该只能被`Genesis`模块使用，并且不能暴露给其他模块或者脚本。然而，由于当前可见性模型的限制，这些`initialize`函数必须是`public`(为了`Genesis`能够调用它们)并且执行期检查和静态校验都强制要求，如果不是从创世状态调用这些函数将被终止。

### 未来模块更新不灵活

Public函数有非常受限的更新规则：public函数不能删除或者改名，并且它的函数签名也不能修改。这种限制背后的基本原理是，public函数是面向整个世界的智能合约，一旦合约确定，API不能被轻易修改，一旦修改了API可能导致调用public函数的代码坏掉。public函数的拥有者不能控制谁能调用这个函数。实际上，了解所有调用的地方需要对存储中发布的所有代码进行全局扫描，对于一个开放模型的区块链网络，这不太可能，也不好扩展。

相比之下，friend函数是一个只能友元模块调用的合约，此外，模块的所有者控制着关系列表。这就是说，模块所有者完全知道哪些模块可能访问这个friend函数。因此，friend函数升级更容易，因为只有在朋友列表中的模块需要关心它的变动。当friend函数及其所有友元模块由同一所有者维护时尤其如此。

### 简化规范和验证

Friend可见性能帮助简化Move prover规范的编写和验证。例如，给定一个friend函数，并且它的友元模块列表，我们能简单并且详细的找到所以调用它的地方。有这些信息，作为一个选择，我们能完全跳过friend的规范，将实现内联到它的调用者中。这可能会进一步简化验证技术，并允许证明更强的属性。相比之下，public函数有必要编写完整和准确的规范。

## 描述

Friend可见性扩展了可能的可见性：

* private (没有修饰符)
* public(friend)
* public(script)
* public

这些可见性分别对应Move字节码文件格式的`Private`, `Friend`, `Script`, 和 `Public`。Script可见性解决了Diem框架的一个正交问题，更详细的信息查看这个Script可见性更新描述。

与新的 `public(friend)`修饰符相比，任何模块都允许有一个友元列表，可以通过`friend <address::name>` 声明零个或者多个宿主模块信任的模块列表。友元列表中的模块允许调用宿主模块中定义的 `public(friend)` 函数，但是非友元模块进制调用`public(friend)` 函数。

### New Visibility Modifier新的可见性修饰符

`public(friend)` 是一个新的可见性修饰符，可以用于模块中的任何函数。`public(friend)` 函数能被相同模块中的任何其他函数调用(假设为模块`M`)，或者被模块`M`的友元列表中指定的模块的任何函数调用。

对比可见性规则，`public(friend)` 函数和其他模块函数一样遵循相同规则，意味着它们能调用相同模块中的其他函数(除了 `public(script)` 函数)，创建新的结构体实例，访问全局存储(模块中生命的类型)，等等。

### Friend List Declarations声明友元列表

一个模块能通过友元声明将其他模块声明为友元，格式如下

* `friend <address::name>` — 使用完全限定模块名称的友元声明
* `friend <module-name-alias>` — 使用模块名称别名的友元声明，其中模块别名是通过 use 语句引入的

一个模块可能有多个友元声明，所有的友元模块组成了一个友元列表，这是字节码文件格式的新部分。为了可读性，友元声明通常应该放在模块定义的前面。注意，Move脚本不能定义友元模块，因为友元函数不存在于脚本中。

友元声明需要遵循以下规则：

* 一个模块不能将自己声明为友元

  * 例如，`0x2::M`不能声明`0x2::M`为友元
* 友元模块必须必须在相同账号地址中

  * 例如，`0x2::M`不能声明 `0x3::N` 为友元
  * 注意：这不是技术要求，而是规定，以后可能会放宽
* 友元不能循环依赖

  * 友元关系不能循环，例如，`0x2::A`的友元`0x2::B`,`0x2::B`的友元 `0x2::C` ， `0x2::C` 友元`0x2::A`是不允许的

  * 声明一个友元模块，当前模块添加一个到友元模块的依赖(目的是让友元调用当前模块中的函数)。如果友元模块已经被直接或者间接使用，将出现循环依赖。例如，如果`0x2::A` 的友元 `0x2::B`，并且 `0x2::A` 调用了`0x2::B::foo()，将形成循环依赖。
* 友元必须是已发布
  * 例如，如果`0x2::X` 不能被加载器解析，`0x2::M`不能声明`0x2::X`为友元 。
* 模块的友元列表不能包含重复项

## Examples例子

有`public(friend)`函数和友元列表的典型模块，如下：

```
address 0x2 {
  module A {
    // friend declaration via fully qualified module name
    friend 0x2::B;

    // friend declaration via module alias
    use 0x2::C;
    friend C;

    public(friend) fun foo() {
      // a friend function can call other non-script functions in the same module
      i_am_private();
      i_am_public();
      bar();
    }
    public(friend) fun bar() {}

    fun i_am_private() {
      // other functions in the same module can also call friend functions
      bar();
    }
    public fun i_am_public() {
      // other functions in the same module can also call friend functions
      bar();
    }
  }

  module B {
    use 0x2::A;

    public fun foo() {
      // as a friend of 0x2::A, functions in B can call friend functions in A
      A::foo();
    }

    public fun bar() {
      0x2::A::bar();
    }
  }
}
```

## 其他考虑

### 友元列表的粒度

* 模块到模块(被采用)
  * 模块`B`是模块`A`的一个友元—模块`B`中的任何函数能访问模块`A`的任何friend函数
  * 模块一直是 Move 语言中的信任边界，正如所证明的那样：
    * 现有的可见性模型，针对宿主模块的函数定义了public和private可见性；
    * Struct / Resourc类型的设计，只有定义Struct / Resourc的模块可以访问它们的内部
  * 因此，模块很自然地成为访问friend函数的信任边界
  * 另一个原因是它参考了其他语言中的友元特性的粒度(例如C++)
* 模块到函数
  *  模块`B`是函数 `foo()`的友元—任何模块`B`中的函数能调用`foo()`
  * 这是一个更细粒度的 Module-to-Module 关系声明版本，也可以在其他语言中找到(例如，C++ 也支持 Module-to-Function 关系)。我们不选择这种方式的原因主要是1)它打破了模块作为 Move 界限的模式，2)可能会导致一个模块（例如模块`A`）是每个友元函数的友元，需要为每个友元函数重复指定友元`A`。
* 函数到模块
  * 函数 `foo()` 是模块`A`的友元 — 函数`foo()`能调用模块`A`中的任何friend函数
  * 没有选择这个方案的原因是表达起来很奇怪，作为一个开发者，我们相信函数 `0x3::B::foo()`但是不相信`0x3::B::bar()`，尤其是当它们在同一个`0x3::B`模块中。我们没想到这种场景的合理用例。
* 函数到函数
  * 函数`foo()`是函数`bar()` 的友元 — 函数`foo()`能调用友元函数`bar()`
  * 除了在模块中信任一个函数而不信任另一个函数(类似于Function-to-Module)感觉很奇怪之外，我们认为这种方案过于细粒度，会导致开发不灵活，尤其是在函数名称更新上。例如，假设`foo()`是模块`B`中的私有函数，`bar()`是模块`A`中的友元函数。这个方案要求当私有函数`foo()`重命名时，模块`A`中的一些东西也需要更新！在这个方案下，函数 `foo()` 不再是模块 `B` “私有”的了。


### Location of Friend Declarations友元声明的位置

* 被调用方声明(被采用)
  * 模块开发者在编写源代码时指定该模块的友元。如果后期开发者想要添加/删除友元，他们可以随时更新友元列表并将模块重新发布到链上(要通过可更新性和兼容性检查)。
  * 这是定义友元列表最自然的方式，因为友元列表与模块源代码嵌入在相同的源文件中。与替代方案 — 调用方声明 — 相比，开发人员更容易通过查看相同文件来确定谁可能调用友元函数以及友元函数应如何调整。
* 调用方声明
  * 另一种想法是让友元函数的调用方“请求”权限，而不是让友元函数的所有者“授予”权限。例如，如果模块 `B` 想要访问模块`A`中的一些友元函数，那么模块`B`的源代码中会声明模块`A`是友元(而被调用方要求在模块 `A`的源码中声明)。
  * 这种替代方案的一个主要缺点是，如果开发人员不积极维护友元关系，则代码所有者没有友元列表。对于友元关系，源码可能存储在链上，要么 1) 通过链上模块字节码更新VM，或 2) 用户帐户中的新 `FriendList`。更重要的是，通过查看模块的源代码，开发人员不知道谁可以调用友元函数以及如何调用的。


### Publishing Order

跨模块引用使发布这些模块的过程复杂化。这个问题可以看下面的说明：

```
address 0x2 {
  module M {
    friend 0x2::N;
    public(friend) fun foo() {}
  }
  module N {
    use 0x2::M;
    fun bar() { M::foo(); }
  }
}
```

假设我们像上面一样定义了两个模块 `M` 和 `N`：

* 模块 `N` 依赖模块 `M` ，因为模块 `N` 有 `use 0x2::M`
* 但是，同时，模块`M`引用了`N`，因为模块`M`指定了 `friend 0x2::N`

现在我们考虑一下应该如何在链上升级他们

* 目前使用每次发布一个模块的模式：
  * 很明显模块`M`必须第一个发布。先发布模块`N`会导致`N::bar()`失败，而先发布模块`M`应该没有影响，因为没有人可以调用`M::foo()`。
  * 但是，当发布`M`，字节码验证器会检查可见性约束，检查到它指向一个不存在的函数`N::bar()`。字节码验证器不会解决这个函数句柄，它必须容忍前向声明的可见性约束。
  * 上述过程的问题在于发布模块`N`时可能出现竞争风险。假设 Alice 和 Eve 都可以发布到`0x2`。当`M`发布时，Alice 和 Eve 都看到`M`声明`N`为友元。 Eve可能会抢在Alice前发布模块`N`，并使用错误的`bar()`函数，以利用模块`M`的开发者对 Alice 的信任。
  * 解决这个问题，需要更安全、更复杂的模块发布流程，流程仍然使用每次发布一个模块。上面的例子，总共需要三个步骤：
    * 发布一个空的占位模块`N`
    * 发布模块`M`
    * 发布更新模块`N`使用友元模块`M`
* 未来的多签多模块发布模型：
  * 避免复杂的模块发布流程的另一种解决方案是使用多签 + 多模块发布模型，该模型允许以原子方式发布/更新一组模块，即便这些模块驻留在不同的用户帐户中。在上面的例子中，如果我们可以在一个交易中原子地发布`M`和`N`，就没有竞争的风险了，也就不需要三步模块发布流程。

### 其他“共享”可见性方案

* address可见性
  * Java 使用“pacakge”的概念，映射到给定位置(命名空间)，可以简单的将它当成地址(发布模块的地址)。 Move中的address可以充当 Java 中“pacakge”的角色。使用这种方法，我们可以做一些类似 `public(address)`的事——或者只是`internal`——这将允许跨模块的可见性，但只能在同一个地址下。这个地址的所有者能控制所有发布到这个地址的代码。通过地址可见性很容易实现验证者的强制要求。也就是说，链接时的目标函数必须在相同地址发布的模块中。
  * 这个模型的问题在于，我们没办法控制后续发布到哪个地址，这可能违背Move的设计原则，即发布时所有绑定都是确定的，并且不能更改。如果在相同地址下的某个发布，允许其他人访问这个地址下的其他模块的内部状态，那么，可能导致其他人可以读取甚至更改那些模块里的私有的状态。
* package可见性
    * 这是.NET CLR模型里的“internal”可见性的，即，由于编译在一起，它们能相互访问其内部状态。在Move中， “compiled together”实际上是指一起发布，一个发布包将包含所有更新(并且按模块发布交易)，那么必须使用模块列表，而不是单个模块。这使验证者能够控制跨模块的调用。也就是说，如果所有模块在同一个发布单元(包)中，则可以通过内部可见性实现跨模块调用。
    * 然而，如果没有一些额外的信息来标识包中的模块，这种方案导致在发布后(例如加载)无法验证可见性/可访问性。 VM 只能认为所有内部访问都是正确的，因为在发布之后，没法进行验证。
    * 如果某个版本，在保留可见性许可的情况下，去掉一些模块，版本管理或升级可能会有问题。是不是有问题需要进一步的分析。问题的本质在于发布的时候进行验证是否足以保证正确性。可能会有人说，VM 知道上下游的模块包，可以构建相应的依赖关系图，并且在检测到权限不一致的时候报告错误。
    * 或者，这些模块可以一起声明这个“包”属于哪。二进制格式有一个将这些模块一起发布的东西，并且在检查内部可见性/可访问性时定义包含的范围。整个包仍将一起发布，但是，之后字节码验证器在验证内部访问的时候，明确知道有哪些模块需要考虑。
    * 选择的模块friend可见性的方案，比package可见性方案有更细粒度的访问控制。并且，由于 Move 还没有多模块包的概念，friend可见性是更好的选择。


# Script可见性

* 状态: Move 1.2已实现

## 说明

脚本可见性是Move 1.2的一个新特性，允许模块函数像脚本一样，被安全直接地调用。原来函数只有public和private两种可见性，public的函数可以被任意调用，但是private的函数只能在被定义的模块中使用。一个script可见性的函数可以像脚本一样被直接调用，但是只能在脚本或者其他script可见性的函数中调用。



## 动机

### 管理基于hash的许可名单

在Diem框架中，有一个基于hash的有效脚本的名单，允许的脚本才能在网络上广播。如果脚本的hash在名单中，这个脚本才能被执行，否则，交易会被拒绝。
这个解决方案是有效的，但是带来了麻烦，尤其是一些类似新的Move字节码版本导致所有的hash都变了的情况。 在升级方案中，许可名单应该在同一个write-set交易中被升级。虽然这个升级方案可行，但是不能很好的扩展。在可能的情况下，Diem要继续支持旧的交易，以简化客户端的升级过程，允许很少更新的预签名交易(例如，紧急密钥更新)。许可名单将包括所有前面发布的旧的hash，它可能快速增长并且很难管理。Script可见性通过把允许的脚本作为Diem框架的一部分的方案，代替跟踪他们的hash的方案，很好的解决了这个问题。

### Diem框架更新

在未来的某个时刻，当Diem允许通过随便脚本函数进行交易，Diem框架的public接口将非常难更新，但就目前而言，通过与脚本不兼容的关键更改，来从旧的版本更新框架仍然很重要。这与继续支持旧版本交易的想法冲突。通过script可见性，支持的脚本可以跟框架一起更新，因为这些脚本的Move字节码不包含在交易中，而是作为框架的一部分存储在链上。

### 无意义的包装

我们简单包装的许多脚本实际上只调用了1-2个函数。这些脚本不包含任何有意思的临时计算(并且不能在有许可列表的Diem框架中这么做)。如果模块编写者可以为某些函数自动生成脚本，或者简单地标记哪些函数可以直接调用，就好像它们是脚本一样，将非常方便。

## 描述

`script`可见性解决了这些问题。在Move旧的版本中，模块中的函数只能被声明为`Public` 或者 `Private`(Move二进制文件格式中的`Public` 或者 `Private`)。通过这些更新，现在可能的可见性是： private (没有修饰符), `public(friend)`, `public(script)`, 和 `public`。分别对应文件格式中的Private、Friend、Script、Public。(更详细的信息查看这个Friend可见性更新描述。)

一个`public(script)`函数只能这么调用1) 其他`public(script)`函数, 或者 2) 交易脚本。并且，如果函数具有满足脚本函数必要限制的签名，则它能像脚本那样被Move VM直接调用。

### 新的可见性修饰符

`public(script)`是一个能被应用在任何模块函数的、新的可见性修饰符。一个`public(script)`函数能被任何其他`public(script)`函数(不管在不在相同模块)或者另一个脚本函数调用。除了这个可见性规则之外，`public(script)`函数像其他任何模块函数一样有相同的规则，意味着它们能被private函数调用，创建新的结构体实例，访问全局存储(通过该模块中声明的类型)，等等。

不像脚本函数，`public(script)`函数的签名不受限制。任何对另一个模块函数有效的签名都是有效的`public(script)`签名。但是，要让Move VM像脚本一样调用，`public(script)`函数必须与脚本函数有相同的限制。换句话说，虽然每个脚本函数都有一个受限制的签名，但对`public(script)`函数的限制会在执行入口点时会动态检查。

### New VM Entry Point新的VM入口

VM添加了新的`execute_script_function`入口，允许public(script)`函数在已发布的模块中调用。入口的签名如下：

```
fn execute_script_function(
    &self,
    module: &ModuleId,
    function_name: &IdentStr,
    ty_args: Vec<TypeTag>,
    args: Vec<Vec<u8>>,
    senders: Vec<AccountAddress>,
    data_store: &mut impl DataStore,
    cost_strategy: &mut CostStrategy,
    log_context: &impl LogContext,
) -> VMResult<()>
```

入口设计得像已经存在的`execute_script`，唯一的不同：

* 参数`script: Vec<u8>`(例如，一个原始二进制的序列化脚本)被`module: &ModuleId` 和 `function_name: &IdentStr` 对代替，唯一标识一个已发布的模块中的`public(script)` 函数(假设函数已经存在)。

在以下这些情况中，VM 会拒绝执行并返回正确的状态码：

* 这个 `module` 或者 `function_name` 不存在
* 函数不是 `public(script)` 函数
*  `public(script)` 函数签名没有通过脚本签名检查：
  * 所有 `signer` 参数必须在非`signer`前面
  * 函数不返回任何值
  * 函数类型参数中任何非`signer`类型不能通过脚本签名检查：
    * 表面上，类型有`copy`的ability，并且不是一个结构体
  * 函数类型变量中的每个类型都是封闭的，例如，不能指向其他类型变量
* `senders`, `args`, 或者 `ty_args`不满足函数签名定义

## 例子

当你需要用一个脚本，包装一个模块中的一个函数，这个特性非常好用：

```
script {
    fun call_foo(account: signer, amount: u64) {
        0x42::M::foo(account, amount)
    }
}
```

将模块函数从 `public` 改成 `public(script)` ，可以删除简单包装的脚本：

```
address 0x42 {
module M {
    ...
    // Replace previous "public" visibility...
    public(script) fun foo(account: signer, amount: u64) {
        ...
    }
}
}
```

然而，要记住，这个函数现在只能在其他的 `public(script)` 函数或者脚本函数中被调用。

```
address 0x43 {
module Other {
    fun private_call_foo(account: signer, amount: u64) {
        0x42::M::foo(account, amount) // ERROR Now invalid
    }

    public fun public_call_foo(account: signer, amount: u64) {
        0x42::M::foo(account, amount) // ERROR Now invalid
    }

    public(script) fun script_call_foo(account: signer, amount: u64) {
        0x42::M::foo(account, amount) // Still a valid call
    }
}
}

script {
    fun still_valid(account: signer) {
        0x42::M::foo(account, 0) // Still a valid call
    }
}
```

## 其他考虑

我们没有找到其他方案可以解决基于hash的许可名单引起的脚本版本控制的问题。将交易脚本转换为与对应模块一起发布和更改的`public(script)` 函数是最直接的解决方案。

针对无意义包装这个问题，我们考虑通过编译器自动生成脚本。这样会比较简单，但是在有`public(script)` 函数的情况下是不必要的。
