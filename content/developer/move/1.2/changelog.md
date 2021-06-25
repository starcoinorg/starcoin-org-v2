+++
title = "Move 1.2 ChangeLog"
date = "2020-04-09"
image = 'read.jpg'
summary = " "
archives="2020"
author = "Tim"
+++

<br />

# Abilities



* Status: Move 1.2 is implemented







# # #



Abilities are a new feature supported in Move 1.2 that gives you greater control over what operations are allowed for a value of a given type. In the pre-MOVE type system, there were values over copyable and values over 'resource'. In older systems, the values of the copyable yable were unconstrained, but the values of the resource could not be copied and had to be used. Using Ability, Move's type system provides more granular control, allowing a type to do specific actions on its values that were previously implicitly permitted or dispermitted, depending on the copyable versus resource.







# # #



Move's classification system is powerful, but not expressive enough for some scenarios. Resource types are very powerful, but the system binds a variety of behaviors to this category that may not be required in all scenarios. In the DIEM framework, you need to express a type like a "hot potato" -- it can't be copied or discarded (like a Resource), but it can't be saved to global storage either. Then it's like a "hot potato" because you have to pass it around all the time, and you have to consume it before the deal closes. Types with these constraints must allow Move Prover to validate these special capabilities.







Extended classification systems can handle the "hot potato" example, but they are not the best future-oriented solution. A more fine-grained system can give programmers more control, not only to implement "hot potato" types, but also to meet unknown requirements. For example, we want the new system to be flexible enough to scale in the future without having to do another major refactoring of the type system.







# # #



Copyable and resource categories were replaced by four new abilities. These Ability can be obtained through a variety of bytecode instructions. In order for a value to have a corresponding ability(if only one ability is required -- you don't need to add all of the abilities), you only need to use the corresponding bytecode instructions.







### ability



The four added abilities are 'copy', 'drop', 'store', and 'key'. Here are the details:



* `copy`

* Allows values of this type to be copied

* Entries: 'CopyLoc' and 'ReadRef'

* If a value can be copied, then all of its internal values can be copied

* `drop`

* Allow values of this type to be ejected or discarded

* Ownership cannot be transferred

* Entry: 'Pop', 'WriteRef', 'StLoc', 'Eq' and 'Neq'

* When the function returns' Ret ', the value retained in the local variable must be able to 'drop'

* If a value can be 'dropped', then all the values inside it can be 'dropped'

* `store`

* Allows values of this type to be stored in the structure of global storage

* but not necessarily the top-level value in the global store

* This is currently the only ability that cannot be checked directly, but can be checked indirectly by 'key'

* If a value can be 'stored', then all of its internal values can be 'stored'

* `key`

* Allows this type to operate as a key for global storage

* Make the value of this type at the top of the global store

* Inlets: 'moveTo', 'moveFrom', 'Borrowglobal', 'Borrowglobalmut', and 'Exists'

* If a value can be 'key', then all of its internal values can be 'store'







### primitive type



All primitive types except 'signer' have 'copy', 'drop', and 'store'.



* ` bool `, ` u8 `, ` u64 `, ` u128 `, and ` address ` have ` copy `, ` drop `, and ` store `.

* 'signer' has' drop '.

* Cannot copy and cannot be saved to global storage.

* The ability to 'copy', 'drop', and 'store' of 'vector' depends on 'T'.

* See more about Conditional Ability of Generic Types (# Conditional Ability of Generic Types)

* Immutable reference '&' and mutable reference' &mut 'both have' copy 'and' drop '.

* This means copying and deleting the references themselves, not what they refer to.

* References cannot be saved to global storage, so they do not have a 'store'.







### declares the ability of constructs



Add Ability to 'struct', after the structure name, but before the field, using 'has' declaration. Such as:



~~~move

struct Ignorable has drop { f: u64 }

struct Pair has copy, drop, store { x: u64, y: u64 }

~ ~ ~



Thus' Ignorable 'has the ability of' drop ', 'Pair' has' copy ', 'drop', and 'store'.



Declares the ability of a structure that requires fields. All fields must satisfy these constraints. These rules are necessary in order for the structure to meet the above abilities. If a construct declares Ability...



- 'copy', all fields must be able to 'copy'

- 'drop', all fields must be able to 'drop'

- 'store', all fields must be able to 'store'

- 'key', all fields must be able to 'store'

- 'key' is currently the only ability that does not require itself



For example:



~~~move

// A struct without any abilities

struct NoAbilities {}



struct WantsCopy has copy {

f: NoAbilities, // ERROR 'NoAbilities' does not have 'copy'

}

~ ~ ~



Similar to:



~~~move

// A struct without any abilities

struct NoAbilities {}



struct MyResource has key {

f: NoAbilities, // Error 'NoAbilities' does not have 'store'

}

~ ~ ~







### Basic example



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

~ ~ ~



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

~ ~ ~



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

~ ~ ~



Key



~~~move

struct NoAbilities {}

struct MyResource has key { f: u64 }



fun valid(account: &signer) acquires MyResource {

let addr = Signer::address_of(account);

let has_resource = exists(addr); // Valid, 'MyResource' has 'key'

if (! has_resource) {

move_to(account, MyResource { f: 0 }) // Valid, 'MyResource' has 'key'

};

let r = borrow_global_mut(addr) // Valid, 'MyResource' has 'key'

r.f = r.f + 1;

}



fun invalid(account: &signer) {

let has_it = exists(addr); // Invalid, 'NoAbilities' does not have 'key'

let NoAbilities {} = move_from(addr); // Invalid, does not have 'key'

move_to(account, NoAbilities {}); // Invalid, 'NoAbilities' does not have 'key'

borrow_global(addr); // Invalid, 'NoAbilities' does not have 'key'

}

~ ~ ~

### Generic constraints



Ability can also be used to constrains generics. Only the types that have the corresponding Ability can instantiate the generic parameters of the corresponding Ability. This can be used for function and structure type arguments:



~~~move

fun foo(x: T): (T, T) { (copy x, x) }

struct CopyCup has copy { item: T }

~ ~ ~



Type parameters can represent multiple constraints with '+'



~~~move

fun bar(x: T): T { copy x }

struct AllCup has copy, drop, store, key { item: T }

~ ~ ~







## Conditional ability of generic types



When Ability is declared on a generic type, not all instances of that type are guaranteed to have the ability. For example, this struct declares:



~~~move

struct Cup has copy, drop, store, key { item: T }

~ ~ ~



Assume that the type parameter 'T' is used inside the structure, so the structure has these abilities only if 'T' meets these requirements. This means that



- 'Cup' can 'copy' only when 'T' has' copy '

- Can 'drop' only if 'T' has a 'drop'

- Only 'store' when 'T' has' store '

- Only 'key' when 'T' has' store '



This can be a little confusing, but is useful for collections like this. For example 'vector' : we can think of it as having the following type declaration:



~~~move

vector has copy, drop, store;

~ ~ ~



In this way, the value of 'vector' can only be copied if the inner elements can be copied. The value of 'vector' can only be ignored if the inner elements can be ignored or discarded. And the 'vector' can be stored in global storage only if the internal elements can be stored in global storage.







### More examples



Copy



~~~move

struct NoAbilities {}

struct S has copy, drop { f: bool }

struct Cup has copy, drop, store { item: T }



fun example(c_x: Cup, c_s: Cup) {

// Valid, 'Cup' has 'copy' because 'u64' has 'copy'

let c_x2 = copy c_x;

// Valid, 'Cup' has 'drop' because 'S' has 'drop'

let c_s2 = copy c_s;

}



fun invalid(c_account: Cup, c_n: Cup) {

// Invalid, 'Cup' does not have 'copy'.

// Even though 'Cup' was declared with copy, the instance does not have 'copy'

// because 'signer' does not have 'copy'

let c_account2 = copy c_account;

// Invalid, 'Cup' does not have 'drop'

// because 'NoAbilities' does not have 'drop'

let c_n2 = copy c_n;

}

~ ~ ~



Drop



~~~move

struct NoAbilities {}

struct S has copy, drop { f: bool }

struct Cup has copy, drop, store { item: T }



fun unused() {

Cup { item: true }; // Valid, 'Cup' has 'drop'

Cup { item: S { f: false }}; // Valid, 'Cup' has 'drop'

}



fun left_in_local(c_account: Cup): u64 {

let c_b = Cup { item: true };

let c_s = Cup { item: S { f: false }};

// Valid return: 'c_account', 'c_b', and 'c_s' have values

// but 'Cup', 'Cup', and 'Cup' have 'drop'

0

}



fun invalid_unused() {

// Invalid, Cannot ignore 'Cup' because it does not have 'drop'.

// Even though 'Cup' was declared with 'drop', the instance does not have 'drop'

// because 'NoAbilities' does not have 'drop'

Cup { item: NoAbilities {}};

}



fun invalid_left_in_local(): u64 {

let n = Cup { item: NoAbilities {}};

// Invalid return: 'c_n' has a value

// and 'Cup' does not have 'drop'

0



}

~ ~ ~



Store



~~~move

struct Cup has copy, drop, store { item: T }



// 'MyInnerResource' is declared with 'store' so all fields need 'store'

struct MyInnerResource has store {

yes: Cup, // Valid, 'Cup' has 'store'

// no: Cup, Invalid, 'Cup' does not have 'store'

}



// 'MyResource' is declared with 'key' so all fields need 'store'

struct MyResource has key {

yes: Cup, // Valid, 'Cup' has 'store'

inner: Cup, // Valid, 'Cup' has 'store'

// no: Cup, Invalid, 'Cup' does not have 'store'

}

~ ~ ~



Key



~~~move

struct NoAbilities {}

struct MyResource has key { f: T }



fun valid(account: &signer) acquires MyResource {

let addr = Signer::address_of(account);

// Valid, 'MyResource' has 'key'

let has_resource = exists>(addr);

if (! has_resource) {

// Valid, 'MyResource' has 'key'

move_to(account, MyResource { f: 0 })

};

// Valid, 'MyResource' has 'key'

let r = borrow_global_mut>(addr)

r.f = r.f + 1;

}



fun invalid(account: &signer) {

// Invalid, 'MyResource' does not have 'key'

let has_it = exists>(addr);

// Invalid, 'MyResource' does not have 'key'

let NoAbilities {} = move_from(addr);

// Invalid, 'MyResource' does not have 'key'

move_to(account, NoAbilities {});

// Invalid, 'MyResource' does not have 'key'

borrow_global(addr);

}

~ ~ ~

### Backward compatibility



The new Ability system is compatible with almost all scenarios of the old classification system. At the bytecode level, modules and scripts from the old categories can be loaded just as they were written by Ability.



For any structure:



* If you declare a copyable, non-' resource 'structure, then the structure will be able to' copy ', 'drop', and 'store'

* If declared as' resource ', the structure will be able to 'store' and 'key'

* For type parameters:

* 'copyable' becomes' copy + drop '

* 'resource' becomes' key '

* 'store' does not, because the type parameter does not need to care about this restriction. Any convention will still be available.



For any function:



* For type parameters:

* 'copyable' becomes' copy + drop + store '

* 'resource' becomes' key + drop '

* 'store' is required because you need to determine whether the type parameter can operate on global storage



Summarize all of these rules, old code



~~~move

struct S {}

resource struct R {}



fun foo() {}

~ ~ ~



It will be loaded like this:



~~~move

struct S has copy, drop, store {}

struct R {}



fun foo() {}

~ ~ ~



This leads to a significant change that any function instantiated with 'signer' as a type parameter will now not be loaded because the type parameter will have a 'store' constraint -- all old function type parameters were given a 'store' constraint -- but 'signer' will have no 'store'. Given the limited use of 'signer', this may be an extreme case, and we don't think this is a problem.







## Other considerations



### extends the classification system



As an example of the primary motivation for this change, consider adding a "hot potato" category to the system. In the classification system are:



* 'Copyable' is equivalent to 'copy + drop + store'

* 'Resource' equals' key + store '

* 'All' sometimes corresponds to 'store', sometimes to no ability at All



It can be viewed as' Copyable <: All 'and' Resource <: All 'subclassification systems. Adding a 'HotPotato' classification is difficult. Possible hierarchies are 'Copyable <: All' and 'Resource <: HotPotato <: All'. However, this would be confusing:



* Added a 'allWithStore' classification that 'Copyable <: allWithStore <: All' and 'Resource <: allWithStore <: All' and 'Resource <: HotPotato <: All`

* Complexity can explode quickly if you add any other types



The complexity of this seed classification scheme leads to the more fine-grained scheme described above. We were very worried that another type would be needed in a year or two, and then the whole thing would collapse. With Ability, we can easily add new Ability whenever we need it.



### explicit condition Ability



The current rules around generics that are conditional on generic types can be confusing, especially considering the keyword 'has'. Such as:



~~~move

struct Cup has copy, drop, store { item: T }

~ ~ ~



Although explicitly saying 'can be copied', 'can be discarded' and 'can be stored', 'Cup This can be confusing. You might want to write generic types like this:



~~~move

struct Cup has ? copy, ? drop, ? store { item: T }

~ ~ ~



This will mean that we now have a clear definition of whether it has ability depends on 'T' and then use 'has' not to use'? ` tag



~~~move

struct Ex has copy {}

~ ~ ~



Will be equivalent to



~~~move

struct Ex has ? copy {}

~ ~ ~



So the underlying problem is that there are a lot of combinations that don't make sense. Therefore, in many cases, the compiler will prompt you that there is only one valid combination.



* 'struct Ex has copy' is redundant, as is' struct Ex has copy '

* For a non-generic type, 'struct Ex has? (struct Ex has copy) (struct Ex has copy) (struct Ex has copy



In short, use '? The 'tag causes a lot of confusion. Also, as the system does not add any more expressive power, programmers might declare the generic 'struct Cup has copy', which would force each instance to copy in a more explicit way. In short, a single option and a single rule can be a bit confusing in the way it is read, but reduces the complexity when declaring the structure.



### Other names



The Ability system considers different names in various respects:



* In addition to "ability", "traits", "type classes", and "interfaces" have all been considered. But these names, which are used in other programming languages, are often used to describe something that the programmer has customized. Programmers cannot customize Ability. Additionally, Ability does not provide anything like dynamic scheduling. So while these names may be more familiar, we are concerned that they could be misleading.

* I also considered 'copyable', 'dropable' and 'storable', but felt too verbose. A more concise name was more appropriate.

* Also considered 'mustuse' or 'mustmove' as alternatives to 'drop', even though they are more informative, more concise names feel better.

* Considered 'resource' instead of 'key'. In many cases' key 'is like' resource ', but in some cases it feels odd, such as' Coin ', which in the old system might be 'resource struct Coin', In the new system, it may be 'struct Coin has store' and not 'resource'. Therefore, we reserve the 'resource' so that we can use it when there is no 'copy' or 'drop'.

# Friend visibility



* Status: Move 1.2 is implemented



# # instructions



Friend visibility is a new feature in Move 1.2 for better control over function calls. The original function only has public and private visibility. Public functions can be called arbitrarily, but private functions can only be used in the module that is defined. The Friend visibility function can only be called by explicitly allowed modules.



# # motivation



Loose function visibility model



For a simple public/private visibility scenario, implementing a "restricted access" function requires public visibility, as follows:



* Functions have limited access through a known list of specific modules (for example, a list of permissions)

* Other modules outside the specified license list cannot be accessed



Take the 'initialize' function in the DIEM framework as an example. Theoretically, the 'initialize' function should only be used by the 'Genesis' module and should not be exposed to other modules or scripts. However, due to the limitations of the current visibility model, these 'initialize' functions must be 'public' (in order for 'Genesis' to be able to call them) and execution time checks and static validations are mandatory. These functions will be terminated if they are not called from the creation state.



### Future module update is not flexible



Public functions have very limited update rules: a Public function cannot be deleted or renamed, and its function signature cannot be changed. The rationale behind this restriction is that public functions are smart contracts for the entire world. Once the contract is established, the API cannot be easily changed, and changing the API may cause the code that calls the public function to break. The owner of a public function does not control who can call the function. In fact, knowing where all the calls are would require a global scan of all the code published in the store, which is impossible and difficult to scale for an open model blockchain network.



In contrast, the friend function is a contract that can only be called by a friend module, and furthermore, the owner of the module controls the list of relationships. That is, the module owner knows exactly which modules are likely to access the friend function. Therefore, updating the friend function is easier because only modules in the friend list need to care about its changes. This is especially true when the friend function and all of its friend modules are maintained by the same owner.



### Simplify specification and validation



Friend Visibility helps simplify the writing and validation of Move Prover specifications. For example, given a friend function and a list of its friend modules, we can simply and verbally find all the places to call it. With this information, as an option, we can skip the Friend specification entirely and inline the implementation to its callers. This may further simplify validation techniques and allow stronger attributes to be proved. In contrast, public functions are required to write complete and accurate specifications.



# # description



Friend Visibility extends the possible visibility:



* private (no modifier)

* public(friend)

* public(script)

* public



These visibility correspond to the 'Private', 'Friend', 'Script', and 'Public' of the Move bytecode file format, respectively. Script visibility solves one of the orthogonality problems of the DIEM framework. See this Script visibility update description for more details.



In comparison to the new 'public(friend)' modifier, any module is allowed to have a list of friends. You can declare a list of zero or more modules trusted by the host module via 'friend '. A module in the friend list is allowed to call the 'public(friend)' function defined in the host module, but non-friend modules call the 'public(friend)' function in base.



### New Visibility Modifier



'public(friend)' is a new visibility modifier that can be used with any function in a module. The 'public(friend)' function can be called by any other function in the same module (suppose module 'M'), or by any function of a module specified in the friend list of module 'M'.



In contrast to the visibility rules, 'public(friend)' functions follow the same rules as other module functions, meaning that they can call other functions in the same module (except for 'public(script)' functions), create new instances of structures, access global storage (the type of life in the module), and so on.



### Friend List Declarations



A module can declare other modules as friends through friend declarations in the following format



* 'Friend ' -- Friend declaration using the fully qualified module name

* 'friend ' -- Friend declaration using the module name alias, where the module alias is introduced through the use statement



A module may have more than one friend declaration, and all the friend modules make up a friend list, which is a new part of the bytecode file format. For readability, the friend declaration should usually precede the module definition. Note that the Move script cannot define friend modules because friend functions do not exist in the script.



Friend declarations should follow the following rules:



* A module cannot declare itself as a friend



* For example, '0x2::M' cannot declare '0x2::M' as a friend

* Friend modules must be in the same account address



* For example, '0x2::M' cannot declare '0x3::N' as a friend

* Note: This is not a technical requirement, but a regulation that may be relaxed in the future

Friends cannot be cyclically dependent



* A friend relationship can't circulation, for example, ` 0 x2: : A ` friend yuan ` 0 x2: : B `, ` 0 x2: : ` friend yuan ` 0 x2: B: C `, ` 0 x2: : C ` friend yuan ` 0 x2: : A ` is not allowed



Declares a friend module, and the current module adds a dependency to the friend module (in order to have the friend call a function in the current module). If a friend module is already used directly or indirectly, a circular dependency will occur. For example, if '0x2::A' is A friend of '0x2::B', and '0x2::A' calls' 0x2::B::foo(), it will form A circular dependency.

* Friends must be published

* For example, if '0x2::X' cannot be parsed by the loader, '0x2::M' cannot declare '0x2::X' as a friend.

* The friend list of a module cannot contain duplicates



Example # # Examples



A typical module with a 'public(friend)' function and a list of friends would look like this:



` ` `

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

` ` `



## Other considerations



### granularity of friend lists



* Module to module (adopted)

Module 'B' is A friend of module 'A' -- any function in module 'B' can access any friend function of module 'A'

* Modules have always been the trust boundary in the Move language, as demonstrated:

* Existing visibility model, which defines public and private visibility for functions of the host module;

* Struct/Resourc type, whose internals are accessible only to modules that define a Struct/Resourc

* Thus, the module naturally becomes the trust boundary for accessing the friend function

* Another reason is that it references the granularity of friend features in other languages (such as C++).

* Module to function

Module 'B' is a friend of the function 'foo()' -- any function in module 'B' can call 'foo()'

* This is a more granular version of the module-to-module relationship declaration, which can also be found in other languages (for example, C++ also supports module-to-function relationships). The main reasons for not choosing this approach are 1) it breaks the mode of module as Move boundary, and 2) it may lead to A module (for example, module 'A') being A friend of each friend function, and the need to specify friend 'A' repeatedly for each friend function.

* Function to module

* function 'foo()' is A friend of module 'A' -- function 'foo()' can call any friend function in module 'A'

* The reason we didn't choose this option is because it sounds strange. As a developer, we trust the function '0x3::B::foo()' but not '0x3::B::bar()', especially if they are in the same '0x3::B' module. We couldn't think of a reasonable use case for this scenario.

* Function to function

` ` * function foo () function is ` bar () ` ` friends - function foo () to transfer the friend function ` ` bar ` ()

* Apart from the odd feeling of trusting one Function over another in a Module (similar to function-to-module), we think this scenario is too fine-grained and leads to rigid development, especially when it comes to Function name updates. For example, suppose 'foo()' is A private function in module 'B' and 'bar()' is A friend function in module 'A'. This scenario requires that when the private function 'foo()' is renamed, something in module 'A' also needs to be updated! In this scheme, the function 'foo()' is no longer 'private' in module 'B'.





### Location of Friend Declarations



* Callee declaration (adopted)

* The module developer specifies the friends of the module when writing the source code. If late developers want to add/remove friends, they can update the friend list at any time and republish modules to the chain (through updatability and compatibility checks).

* This is the most natural way to define a friend list, because the friend list is embedded in the same source file as the module source code. Compared to the alternative - the caller declaration - it is easier for the developer to look at the same file to determine who might call a friend function and how it should be adjusted.

* Caller declaration

* Another idea is to have the caller of a friend function "request" the permission, rather than having the owner of the friend function "grant" the permission. For example, if module 'B' wants to access some friend functions in module 'A', then module 'A' is declared as A friend in the source code of module 'B' (and the called party is required to do so in the source code of module 'A').

* A major disadvantage of this alternative is that the code owner does not have a list of friends if the developer is not active in maintaining friendship relationships. For friends, the source code may be stored on the chain, either 1) updating the VM via on-chain module bytecode, or 2) new 'FriendList' in the user account. What's more, by looking at the module's source code, the developer has no idea who can call a friend function and how.

### Publishing Order



Cross-module references complicate the process of publishing these modules. This problem can be seen in the following instructions:



` ` `

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

` ` `



Suppose we define two modules' M 'and' N 'as above:



* Module 'N' depends on module 'M', because module 'N' has' use 0x2::M '

* However, at the same time, module 'M' refers to 'N' because module 'M' specifies' friend 0x2::N '



Now let's think about how do we upgrade them on the chain



* The current model of one module at a time is used:

* Obviously module 'M' must be released first. Publishing module 'N' first will cause 'N::bar()' to fail, while publishing module 'M' first should have no effect, because no one can call 'M::foo()'.

* However, when 'M' is published, the bytecode validator checks the visibility constraint and checks that it points to a nonexistent function 'N::bar()'. This function handle is not resolved by the bytecode validator, which must tolerate the visibility constraints of the forward declaration.

* The problem with the above process is that competition risks may arise when module 'N' is released. Suppose that both Alice and Eve can publish to '0x2'. When 'M' is published, Alice and Eve both see that 'M' declares' N 'as a friend. Eve might release the module 'N' before Alice does, and use the wrong 'bar()' function to take advantage of the trust the developer of the module 'M' had in Alice.

* Solving this problem requires a more secure and complex module publishing process, which still uses one module at a time. In the example above, there are three steps in total:

* Publish an empty placeholder module 'N'

* Publish module 'M'

* Release update module 'N' using friend module 'M'

* Future multi-tab multi-module release model:

* Another solution to avoid the complex module publishing process is to use the multi-check + multi-module publishing model, which allows a set of modules to be published/updated atomically, even if they reside in different user accounts. In the example above, if we could publish 'M' and 'N' atomically in a single transaction, there would be no risk of competition and no need for a three-step module publishing process.



### Other "shared" visibility schemes



* Address visibility

* Java uses the concept of "pacakge", which maps to a given location (namespace) and can simply be treated as an address (the address of the publishing module). An address in a Move can act as a pacakge in Java. With this approach, we can do something like 'public(address)' -- or just 'internal' -- which will allow visibility across modules, but only under the same address. The owner of the address has control over all code posted to that address. It is easy to enforce verifier requirements through address visibility. That is, the target function at the time of linking must be in the module that is published at the same address.

* The problem with this model is that we have no control over where we publish to, which may violate the design principle of MOVE, which is that all bindings are fixed and cannot be changed at the time of publication. If a publication at the same address allows others to access the internal state of other modules at that address, it may result in others being able to read or even change the private state of those modules.

* Package visibility

* This is "internal" visibility in the.NET CLR model, that is, they can access each other's internal state because they are compiled together. Compiled together in Move actually means that Compiled together is released, a release package will contain all the updates (and publish transactions by module), so you must use a list of modules instead of a single module. This enables the verifier to control invocations across modules. That is, if all modules are in the same publishing unit (package), then cross-module calls can be made through internal visibility.

* However, without some additional information to identify the modules in the package, this scenario results in an inability to verify visibility/accessibility after publication (such as loading). The VM can only assume that all internal accesses are correct because, after publication, there is no way to verify them.

* If a version, while retaining the visibility license, removes some modules, versioning or upgrading may be problematic. Is there something wrong that needs further analysis? The essence of the issue is whether validation at release time is sufficient to ensure correctness. It might be argued that the VM knows the upstream and downstream module packages, can build the corresponding dependency diagrams, and reports errors when it detects inconsistencies in permissions.

* Alternatively, these modules can collectively declare where the "package" belongs. The binary format has a way of publishing these modules together and defining the scope of inclusion when checking for internal visibility/accessibility. The entire package will still be released together, but then the bytecode validator knows exactly what modules to consider when validating internal access.

* The option chosen for module Friend visibility has finer granular access control than the Package visibility option. Also, since Move does not have the concept of multi-module packages, Friend visibility is the better choice.

# Script visibility



* Status: Move 1.2 is implemented



# # instructions



Script visibility is a new feature in Move 1.2 that allows module functions to be called directly and safely, just like scripts. The original function only has public and private visibility. Public functions can be called arbitrarily, but private functions can only be used in the module that is defined. A script visibility function can be called directly like a script, but only from within a script or other script visibility function.







# # motivation



### Manages hash based license lists



In the DIEM framework, there is a list of valid hash-based scripts that are allowed to be broadcast over the network. If the hash of the script is in the list, the script will be executed; otherwise, the transaction will be rejected.

This solution works, but it causes problems, especially when things like the new byte code version of MOVE cause all the hashes to change. In the upgrade scenario, the license list should be upgraded in the same write-set transaction. While this upgrade scheme works, it does not scale well. Where possible, DIEM will continue to support old transactions to simplify the client upgrade process and allow for pre-signed transactions that are rarely updated (for example, emergency key updates). The license list will include all previous releases of old hashes, which can grow quickly and be difficult to manage. Script visibility solves this problem by making allowed scripts part of the DIEM framework, instead of tracking their hashes.



### Diem Framework Update



At some point in the future, when DIEM allows transactions through random script functions, the public interface of the DIEM framework will be very difficult to update, but for now, it is still important to update the framework from older versions with key changes that are not compatible with the script. This conflicts with the idea of continuing to support older versions of the transaction. With script visibility, supported scripts can be updated with the framework because the scripts' Move bytecode is not included in the transaction, but is stored on the chain as part of the framework.



### Meaningless packaging



Many of the scripts that we simply wrap around actually call only one or two functions. These scripts do not contain any interesting AD hoc calculations (and cannot be done in a DIEM framework with a license list). It would be convenient if module writers could automatically generate scripts for certain functions, or simply mark which functions can be called directly as if they were scripts.



# # description



The visibility of 'script' solves these problems. In older versions of MOVE, functions in a module could only be declared as' Public 'or' Private '(in the binary format of MOVE). With these updates, the possible visibility is now: private (without modifiers), 'public(friend)', 'public(script)', and 'public'. They correspond to Private, Friend, Script and Public in the file format. (See this Friend visibility update description for more details.)



A 'public(script)' function can only call 1) other 'public(script)' functions, or 2) trading scripts. Also, if the function has a signature that satisfies the necessary constraints of the script function, it can be called directly by the Move VM just like the script.



### New visibility modifier



'public(script)' is a new visibility modifier that can be applied to any module function. A 'public(script)' function can be called by any other 'public(script)' function (whether in the same module or not) or another script function. In addition to this visibility rule, 'public(script)' functions have the same rules as any other module function, meaning that they can be called by private functions, create new instances of the structure, access global storage (through types declared in the module), and so on.



Unlike script functions, 'public(script)' functions have unrestricted signatures. Any signature that is valid for another module function is a valid 'public(script)' signature. However, for the Move VM to be called like a script, the 'public(script)' function must have the same restrictions as the script function. In other words, although each script function has a restricted signature, the restriction on the 'public(script)' function is dynamically checked at the entry point of execution.



A New VM Entry Point is created



VM added a new execute_script_function entry that allows public(script) functions to be called from published modules. The signature of the entry is as follows:



` ` `

fn execute_script_function(

&self,

module: &ModuleId,

function_name: &IdentStr,

ty_args: Vec,

args: Vec>,

senders: Vec,

data_store: &mut impl DataStore,

cost_strategy: &mut CostStrategy,

log_context: &impl LogContext,

) -> VMResult<()>

` ` `



The entry is designed to look like the existing 'execute_script', with the only difference:



* The parameter 'script: Vec' (for example, an original binary serialization script) is used by 'module: & moduleId' and 'function_name: &identstr pair instead uniquely identifies a 'public(script)' function in a published module (assuming the function already exists).



In the following cases, the VM will reject execution and return the correct status code:



* The 'module' or 'function_name' does not exist

* function is not a 'public(script)' function

* 'public(script)' function signature does not pass script signature check:

* All 'signer' arguments must precede non-' signer '

* The function does not return any value

* Any non-' signer 'type in a function type argument cannot be checked by the script signature:

* On the surface, types have the ability to 'copy' and are not a structure

* Each type in a function type variable is enclosed; for example, it cannot refer to a variable of another type

* 'senders',' args', or 'ty_args' do not satisfy the function signature definition



Example # #



This feature is useful when you need to wrap a function in a module with a script:



` ` `

script {

fun call_foo(account: signer, amount: u64) {

0x42::M::foo(account, amount)

}

}

` ` `



Change the module function from 'public' to 'public(script)' to remove simple-wrapped scripts:



` ` `

address 0x42 {

module M {

.

// Replace previous "public" visibility...

public(script) fun foo(account: signer, amount: u64) {

.

}

}

}

` ` `



However, keep in mind that this function can only be called from other 'public(script)' or script functions now.



` ` `

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

` ` `



## Other considerations



We did not find any other solution to the script versioning issues caused by the hash-based license list. The most straightforward solution is to transform the transaction script into a 'public(script)' function that is published and changed with the corresponding module.



To address the problem of meaningless wrapping, we consider using the compiler to generate scripts automatically. This would be simpler, but not necessary in the case of 'public(script)' functions.
