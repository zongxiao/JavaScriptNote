"use strict;"
{
    console.log("// 属性标志和属性描述符");
    // 属性标志
    // 除 value 外,还有三个特殊的特性（attributes）
    // writable — 如果为 true，则值可以被修改，否则它是只可读的。
    // enumerable — 如果为 true，则会被在循环中列出，否则不会被列出
    // configurable — 如果为 true，则此特性可以被删除，这些属性也可以被修改，否则不可以。
    // 当我们用“常用的方式”创建一个属性时，它们都为 true。

    // Object.getOwnPropertyDescriptor 方法允许查询有关属性的 完整 信息。
    // 语法是：
    {
        let obj = {
            name: 'lzx',
            age: 25
        }
        let descriptor = Object.getOwnPropertyDescriptor(obj, "age");
        console.log(descriptor); // { value: 25, writable: true, enumerable: true, configurable: true }
        console.log(JSON.stringify(descriptor, null, 2));
    }

    // 为了修改标志，我们可以使用 Object.defineProperty。
    // 语法是：Object.defineProperty(obj, propertyName, descriptor)
    {
        // obj，propertyName: 要应用描述符的对象及其属性。
        // descriptor: 要应用的属性描述符对象。
        // 如果该属性存在，defineProperty 会更新其标志。
        // 否则，它会使用给定的值和标志创建属性；在这种情况下，如果没有提供标志，则会假定它是 false。
        let user = {};
        Object.defineProperty(user, "sex", {
            value: 'male',
            // writable: true,
            // enumerable: true
        })
        user.sex = 'female';
        console.log(user); // {}    因为没有设置可枚举(enumerable)，所以无法枚举
        console.log(user.sex) // male  没有设置可写(writable)，所以上面对sex进行修改不生效

        let descriptor = Object.getOwnPropertyDescriptor(user, 'sex');
        console.log(JSON.stringify(descriptor, null, 2)); // 所有的标志除了value都是false
        // {
        //     "value": "male",
        //     "writable": false,
        //     "enumerable": false,
        //     "configurable": false
        // }
    }
    // 现在让我们通过示例来看看标志的影响。

    {
        let user = {
            name: 'lzx'
        }
        Object.defineProperty(user, 'name', {
            writable: false //不允许改写这个属性的值
        })
        user.name = 'zxl';
        console.log(user); // { name: 'lzx' }  严格模式下会报错
    }
    // 除非它们应用自己的 defineProperty 来覆盖我们的 user 的 name。

    // 对于新属性，我们需要明确地列出哪些是 true，否则就当做设置为false

    // 不可枚举
    // 通常，对象的内置 toString 是不可枚举的，它不会显示在 for..in 中。
    // 但是如果我们添加我们自己的 toString，那么默认情况下它将显示在 for..in 中，如下所示：
    {
        let user = {
            name: 'John',
            toString() {
                return this.name;
            }
        }

        for (const key in user) {
            if (Object.hasOwnProperty.call(user, key)) {
                console.log(key); // name toString  
            }
        }
        // 如果我们不喜欢它，那么我们可以设置 enumerable:false。
        // 之后它就不会出现在 for..in 循环中了，就像内建的 toString 一样：
        Object.defineProperty(user, 'toString', {
            enumerable: false // 设置为不可枚举
        })
        for (const key in user) {
            if (Object.hasOwnProperty.call(user, key)) {
                console.log(key); // name  没有枚举出toString属性
            }
        }
        // 不可枚举的属性也会被 Object.keys 排除：
        console.log(Object.keys(user)); // [ 'name' ]
    }
    // 不可配置 configurable 有时会预设在内建对象和属性中。
    // 不可配置的属性不能被删除。
    {
        // 例如，Math.PI 是只读的、不可枚举和不可配置的：
        console.log(Math.PI); // 3.141592653589793
        let descriptor = Object.getOwnPropertyDescriptor(Math, 'PI');
        console.log(descriptor);
        // {
        //     value: 3.141592653589793,
        //     writable: false,
        //     enumerable: false,
        //     configurable: false
        // }

        // 因此，开发人员无法修改 Math.PI 的值或覆盖它。
        Math.PI = 3;
        console.log(Math.PI); // 3.141592653589793

        // 注意 使属性变成不可配置是一条单行道。我们无法使用 defineProperty 把它改回去。
        // 确切地说，不可配置性对 defineProperty 施加了一些限制：

        // 不能修改 configurable 标志。
        // 不能修改 enumerable 标志。
        // 不能将 writable: false 修改为 true（反过来则可以）。
        // 不能修改访问者属性的 get/set（但是如果没有可以分配它们）。

        // "configurable: false" 的用途是防止更改和删除属性标志，但是允许更改对象的值。
        {
            let user = {
                name: 'John'
            };
            Object.defineProperty(user, 'name', {
                configurable: false, // 防止更改和删除属性标志。
            })

            delete user.name;
            console.log(user); // { name: 'John' }  不允许删除属性
            user.name = 'lzx';
            console.log(user); // { name: 'lzx' }   允许更改属性值
        }
        // 现在，我们将 user.name 设置为一个“永不可改”的常量：
        {
            let user = {
                name: "John"
            };

            Object.defineProperty(user, "name", {
                writable: false,
                configurable: false
            });

            // 不能修改 user.name 或它的标志
            // 下面的所有操作都不起作用：
            // user.name = "Pete";
            // delete user.name;
            // Object.defineProperty(user, "name", { value: "Pete" });
        }
    }

    // Object.defineProperties
    // 有一个方法 Object.defineProperties(obj, descriptors)，允许一次定义多个属性。
    // 语法如下
    {
        // Object.defineProperties(obj, {
        //     prop1: descriptor1,
        //     prop2: descriptor2
        //     // ...
        // });
    }
    // Object.getOwnPropertyDescriptors
    let user = {};
    Object.defineProperties(user, {
        name: { value: 'lzx', writable: false, enumerable: true },
        age: { value: 25, writable: true, enumerable: true }
    }); // 设置了user的name属性是不可以重写的，而age属性可以重写，并且都可枚举

    // 紧接着，克隆所有user的属性和标志
    let clone = Object.defineProperties({}, Object.getOwnPropertyDescriptors(user));

    console.log(clone); // { name: 'lzx', age: 25 }

    clone.name = 'zxl';
    clone.age = 30;

    console.log(clone); // { name: 'lzx', age: 30 }

    // 通常，当我们克隆一个对象时，我们使用赋值的方式来复制属性，像这样：
    {
        let clone2 = {};
        for (let key in user) {
            clone2[key] = user[key]
        }
        console.log(clone2); // { name: 'lzx', age: 25 }
    }

    // 所以如果我们想要一个“更好”的克隆，那么 Object.defineProperties 是首选。
    let clone3 = Object.defineProperties({}, Object.getOwnPropertyDescriptors(user));

    // 另一个区别是 for..in 会忽略 symbol 类型的属性，
    // 但是 Object.getOwnPropertyDescriptors 返回包含 symbol 类型的属性在内的 所有 属性描述符。
}

{
    console.log("");
    console.log("--------------------------------------- 属性的 getter 和 setter");
    console.log("");
    // 有两种类型的对象属性。
    // 第一种是 数据属性。第二种类型的属性是新东西。它是 访问器属性（accessor properties）
    // 本质上是用于获取和设置值的函数，但从外部代码来看就像常规属性。

    // Getter 和 setter
    // 访问器属性由 “getter” 和 “setter” 方法表示。在对象字面量中，它们用 get 和 set 表示：
    {
        let obj = {
            get name() {
                // 当读取name属性的时候，getter起作用
                return '属性name被读取';
            },
            set name(value) {
                // 当属性name被重新赋值，setter起作用
                return value;
            }
        }
        console.log(obj.name); // 属性name被读取
        obj.name = 'lzx'; // lzx
    }

    // 现在我们想添加一个 fullName 属性，该属性值应该为 "John Smith"。
    // 当然，我们不想复制粘贴已有的信息，因此我们可以使用访问器来实现：
    {
        let user = {
            name: "John",
            surname: "Smith",
            get fullName() {
                return `${this.name} ${this.surname}`;
            },
            set fullName(value) {
                [this.name, this.surname] = value.split(' ');
            }
        };
        console.log(user.fullName); // John Smith
        // 我们不以函数的方式 调用 user.fullName，我们正常 读取 它：getter 在幕后运行。
        user.fullName = "Yohan Simith";
        console.log(user.fullName); // Yohan Simith
    }

    // 访问器描述符
    // 对于访问器属性，没有 value 和 writable，但是有 get 和 set 函数。
    // get —— 一个没有参数的函数，在读取属性时工作，
    // set —— 带有一个参数的函数，当属性被设置时调用，
    // enumerable —— 与数据属性的相同，
    // configurable —— 与数据属性的相同。

    // 使用 defineProperty 创建一个 fullName 访问器，我们可以使用 get 和 set 来传递描述符
    {
        let user = {
            name: "John",
            surname: "Smish"
        };
        Object.defineProperty(user, 'fullName', {
            get() {
                return `${this.name} ${this.surname}`;
            },
            set(value) {
                [this.name, this.surname] = value.split(" ");
            },
            enumerable: true, // 设置多一个可枚举
            // value: "abc"  不可以同时设置数据属性value，因为已经有访问器属性了
        })

        user.fullName = "xiao ming"; // setter访问器生效，触发set
        console.log(user.fullName); // xiao ming
        for (const key in user) {
            if (Object.hasOwnProperty.call(user, key)) {
                console.log(key); // name, surname, fullName
            }
        }
    }
    // 更聪明的 getter/setter
    // Getter/setter 可以用作“真实”属性值的包装器，以便对它们进行更多的控制。
    {
        let user = {
            get name() {
                return this._name;
            },
            set name(value) {
                if (value.length < 4) {
                    console.log('输入的字符太短了');
                    return;
                }
                this._name = value;
            }
        }

        user.name = "1234" // 设置属性的时候，会执行判断
        console.log(user._name); // 1234
    }
    // 从技术上讲，外部代码可以使用 user._name 直接访问 name。
    // 但是，这儿有一个众所周知的约定，即以下划线 "_" 开头的属性是内部属性，不应该从对象外部进行访问。

    // 兼容性
    // 访问器的一大用途是，它们允许随时通过使用 getter 和 setter 替换“正常的”数据属性，来控制和调整这些属性的行为。
    // 想象一下，我们开始使用数据属性 name 和 age 来实现 user 对象：
    {
        function User(name, age) {
            // 隐式生成this
            this.name = name;
            this.age = age;
            // 隐式return this
        }

        let user = new User("lzx", 26);
        console.log(user); // User { name: 'lzx', age: 26 }
    }
    // ……但迟早，情况可能会发生变化。我们可能会决定存储 birthday，而不是 age，因为它更精确，更方便：
    {
        function User(name, birthday) {
            this.name = name;
            this.birthday = birthday;
        }

        let user = new User('lzx', new Date(1995, 8, 16));
        console.log(user); // User { name: 'lzx', birthday: 1995-09-15T16:00:00.000Z }
    }
    // 现在应该如何处理仍使用 age 属性的旧代码呢？
    // 为 age 添加一个 getter 来解决这个问题：
    {
        function User(name, birthday) {
            // this = {} 隐式生成this
            this.name = name;
            this.birthday = birthday;
            Object.defineProperty(this, 'age', {
                get() {
                    return new Date().getFullYear() - this.birthday.getFullYear();
                }
            })
        }
        let user = new User('lzx', new Date(1995, 8, 16));
        console.log(`${user.name} is ${user.age} years old`); // lzx is 26 years old
    }
}

{
    console.log("--------------------------------------原型继承");
    // 我们有一个 user 对象及其属性和方法，并希望将 admin 和 guest 作为基于 user 稍加修改的变体。
    // 我们想重用 user 中的内容，而不是复制/重新实现它的方法，而只是在其之上构建一个新的对象。

    // [[Prototype]]
    // 在 JavaScript 中，对象有一个特殊的隐藏属性 [[Prototype]]（如规范中所命名的
    // 它要么为 null，要么就是对另一个对象的引用。该对象被称为“原型”：

    // 当我们从 object 中读取一个缺失的属性时，JavaScript 会自动从原型中获取该属性。
    // 属性 [[Prototype]] 是内部的而且是隐藏的，但是这儿有很多设置它的方式。
    // 其中之一就是使用特殊的名字 __proto__
    {
        let animals = {
            eats: true
        };
        let rabbits = {
            jumps: true
        };
        rabbits.__proto__ = animals;
        console.log(rabbits.eats); // true
    }
    // 在这儿我们可以说 "animal 是 rabbit 的原型"，或者说 "rabbit 的原型是从 animal 继承而来的"。
    // 如果 animal 有许多有用的属性和方法，那么它们将自动地变为在 rabbit 中可用。这种属性被称为“继承”。
    {
        let animals = {
            eats: true,
            walk() {
                console.log('Animals walk');
            }
        };
        let rabbits = {
            jumps: true,
            __proto__: animals
        };
        rabbits.walk(); // Animals walk
    }

    // 原型链可以很长：
    {
        let animals = {
            eats: true,
            walk() {
                console.log('Animals walk');
            }
        };
        let rabbits = {
            jumps: true,
            __proto__: animals
        };
        let longEar = {
            earLength: '20cm',
            __proto__: rabbits
        }

        console.log(longEar.jumps); // true  通过原型获得（继承）
        longEar.walk(); // Animals walk  通过原型链获得（继承）
    }
    // 现在，如果我们从 longEar 中读取一些它不存在的内容，JavaScript 会先在 rabbit 中查找，然后在 animal 中查找。

    // 注意
    // 引用不能形成闭环。如果我们试图在一个闭环中分配 __proto__，JavaScript 会抛出错误。
    // __proto__ 的值可以是对象，也可以是 null。而其他的类型都会被忽略。
    // 只能有一个 [[Prototype]]。一个对象不能从其他两个对象获得继承。
    {
        // __proto__ 是 [[Prototype]] 的 getter/setter。
        // 由于 __proto__ 标记在观感上更加明显，所以我们在后面的示例中将使用它。
    }

    // 写入不使用原型
    // 原型仅用于读取属性。对于写入/删除操作可以直接在对象上进行。
    {
        let animals = {
            eats: true,
            walk() {
                console.log('animals walk');
            }
        };
        let rabbit = {
            jumps: true,
            __proto__: animals
        };
        rabbit.walk = function () {
            console.log('rabbit walk');
        }

        rabbit.walk(); // rabbit walk   无需使用原型
    }
    // 访问器（accessor）属性是一个例外，因为分配（assignment）操作是由 setter 函数处理的。
    // 因此，写入此类属性实际上与调用函数相同。
    // 下面这段代码中的 admin.fullName 能够正常运行：
    {
        let user = {
            name: "John",
            surname: "Smith",
            get fullName() {
                return `${this.name} ${this.surname}`;
            },
            set fullName(value) {
                [this.name, this.surname] = value.split(" ");
            }
        };
        let admin = {
            isadmin: true,
            __proto__: user
        };

        console.log(admin.fullName); // John Smith
        admin.fullName = "abc de";
        console.log(admin.fullName); // abc de
        console.log(user.fullName); // John Smith
    }

    // “this” 的值 
    // this 根本不受原型的影响。
    {
        // 无论在哪里找到方法：在一个对象还是在原型中。在一个方法调用中，this 始终是点符号 . 前面的对象。
        // animal 有一些方法
        let animal = {
            walk() {
                if (!this.isSleeping) {
                    console.log(`I walk`);
                }
            },
            sleep() {
                this.isSleeping = true;
            }
        };

        let rabbit = {
            jumps: true,
            __proto__: animal
        };

        rabbit.sleep();
        console.log(rabbit.isSleeping); // true
        console.log(animal.isSleeping); // undefined  （原型中没有此属性）
    }

    // for..in 循环也会迭代继承的属性。
    {
        let animals = {
            eats: true,
            walk() {
                console.log('walk');
            }
        };
        let rabbit = {
            __proto__: animals,
            jumps: true
        }
        // for..in 会遍历自己以及继承的键
        for (const key in rabbit) {
            console.log(key); // jump eats walk    原型中的属性也会被迭代
        }

        // Object.keys 只返回自己的 key
        console.log(Object.keys(rabbit)); // ['jump']

        // 有一个内建方法 obj.hasOwnProperty(key)：如果 obj 具有自己的（非继承的）名为 key 的属性，则返回 true。
        for (const key in rabbit) {
            if (rabbit.hasOwnProperty(key)) {
                console.log(key);
            }
            // 等价于下面的，因为rabbit的hasOwnProperty继承于Object.prototype，
            // 再利用call把上下文设置为rabbit，传入key参数
            if (Object.prototype.hasOwnProperty.call(rabbit, key)) {
                console.log(key); // jumps
            }
        }

        // 这里我们有以下继承链：rabbit 从 animal 中继承，
        // animal 从 Object.prototype 中继承（因为 animal 是对象字面量 {...}，所以这是默认的继承）
        // 然后再向上是 null：

        // 有一件很有趣的事儿。方法 rabbit.hasOwnProperty 来自哪儿？我们并没有定义它。
        // 从上图中的原型链我们可以看到，该方法是 Object.prototype.hasOwnProperty 提供的。换句话说，它是继承的。

        // 几乎所有其他键/值获取方法都忽略继承的属性
        // 例如 Object.keys 和 Object.values 等，都会忽略继承的属性。
        // 它们只会对对象自身进行操作。不考虑 继承自原型的属性。
    }

    {

        // 我们有两只仓鼠：speedy 和 lazy 都继承自普通的 hamster 对象。
        // 当我们喂其中一只的时候，如何确保另一只不会共享同一个胃
        let hamster = {
            stomach: [],
            eat(food) {
                this.stomach += food + " "; // 写入不会继承原型hamster的stomach属性
            }
        };

        let speedy = {
            __proto__: hamster
        };

        let lazy = {
            __proto__: hamster
        };

        speedy.eat("apple");
        lazy.eat("pear");

        // 这只speedy仓鼠找到了食物
        console.log(speedy.stomach); // apple
        // 这只lazy仓鼠也找到了食物
        console.log(lazy.stomach); // pear

    }
}

{
    console.log(`---------------------------F.prototype---------------------`);
    // new F() 这样的构造函数可以创建一个新对象。
    // 如果 F.prototype 是一个对象，那么 new 操作符会使用它为新对象设置 [[Prototype]]。

    {
        let animal = {
            eat() {
                console.log('eat');
            }
        };

        function Rabbit(color) {
            this.color = color;
        }

        let redRabbit = new Rabbit('red');
        console.log(redRabbit); // Rabbit { color: 'red' }
        console.log(redRabbit.__proto__); // {}

        Rabbit.prototype = animal; // 设置构造函数的原型对象
        let blackRabbit = new Rabbit('black');
        console.log(blackRabbit.__proto__); // { eat: [Function: eat] }
        blackRabbit.eat(); // eat

        // Rabbit.prototype = animal “当创建了一个 new Rabbit 时，把它的 [[Prototype]] 赋值为 animal”。

        // F.prototype 仅用在 new F 时
    }

    // 默认的 F.prototype，构造器属性
    // 默认的 "prototype" 是一个只有属性 constructor 的对象，属性 constructor 指向函数自身。
    {
        function Rabbit(name) {
            this.name = name;
        }

        /* default prototype
        Rabbit.prototype = { constructor: Rabbit };
        */

        console.log(Rabbit.prototype.constructor === Rabbit); // true

        let redRabbit = new Rabbit('red');
        console.log(redRabbit.constructor); // [Function: Rabbit]
        // 自己没有constructor这个属性 自动往原型找 找到默认prototype也就是{ constructor: Rabbit }

        // 我们可以使用 constructor 属性来创建一个新对象，该对象使用与现有对象相同的构造器。
        let blackRabbit = new redRabbit.constructor('black');
        console.log(blackRabbit); // Rabbit { name: 'black' }

        // 当我们有一个对象，但不知道它使用了哪个构造器（例如它来自第三方库），
        // 并且我们需要创建另一个类似的对象时，用这种方法就很方便。
    }

    // ……JavaScript 自身并不能确保正确的 "constructor" 函数值。
    {
        // 如果我们将整个默认 prototype 替换掉，那么其中就不会有 "constructor" 了。
        function Rabbit(name) {
            this.name = name;
        }
        Rabbit.prototype = {
            jump: true
        }; // 设置构造函数的原型对象
        let redRabbit = new Rabbit('red');
        for (const key in redRabbit) {
            console.log(key); // name  jump
            // for in可以迭代继承来的属性jump
        }
        console.log(redRabbit.constructor === Rabbit); // false

        // 因此，为了确保正确的 "constructor"，我们可以选择添加/删除属性
        // 到默认 "prototype"，而不是将其整个覆盖：
        {
            function Rabbit(name) {
                this.name = name;
            }
            Rabbit.prototype.jump = true; // 保留默认的原型，并添加jump属性{ constructor: Rabbit ,jump: true}
            let redRabbit = new Rabbit('red');
            for (const key in redRabbit) {
                console.log(key); // name  jump
                // for in可以迭代继承来的属性jump
            }
            console.log(redRabbit.constructor === Rabbit); // true
        }
    }
    // 在常规对象上，prototype 没什么特别的：
    {
        let user = {
            name: "John",
            prototype: "Bla-bla" // 这里只是普通的属性
        };
    }
}

{
    // 如果 F.prototype 是一个对象，那么 new 操作符会使用它为新对象设置 [[Prototype]]
    // F.prototype如果没有设置为一个新对象，那么默认为F.prototype === { constructor: F }
    // 因此，为了确保正确的 "constructor"，我们可以选择添加/删除属性
    // 到默认 "prototype"，而不是将其整个覆盖：
    {
        function Rabbit(name) {
            this.name = name;
        }
        Rabbit.prototype.jump = true; // 保留默认的原型，并添加jump属性{ constructor: Rabbit ,jump: true}
        let redRabbit = new Rabbit('red');
        for (const key in redRabbit) {
            console.log(key); // name  jump
            // for...in 可以迭代继承来的属性jump
        }
        console.log(redRabbit.constructor === Rabbit); // true

        // 当我们有一个对象，但不知道它使用了哪个构造器，也可以这样做
        let blackRabbit = new redRabbit.constructor('black');
        console.log(blackRabbit); // Rabbit { name: 'black' }
    }
}

// -------------------------------以上复习于2021年5月10日---------------------------------------------------
{
    function Group(name) {
        this.groupname = name;
        this.objective = name;
    }
    Group.prototype.objective = 'chat';
    let readBookGroup = new Group('readBook');
    // after a periods of time
    readBookGroup.objective = Group.prototype.objective;
    console.log(readBookGroup); // Group { groupname: 'readBook', objective: 'chat' }
}

{
    // 原生的原型
    console.log("------------原生的原型------------------------")
    {
        // Object 就是一个内建的对象构造函数，其自身的 prototype 指向一个带有 toString 和其他方法的一个巨大的对象。
        let obj = new Object();
        console.log(obj.__proto__ === Object.prototype); // true
        console.log(obj.toString === obj.__proto__.toString); // true
        console.log(obj.toString === Object.prototype.toString); // true

        // 请注意在 Object.prototype 上方的链中没有更多的 [[Prototype]]
        console.log(Object.prototype.__proto__); // null
    }
    // 其他内建原型
    // 其他内建对象，像 Array、Date、Function 及其他，都在 prototype 上挂载了方法。
    // 例如，当我们创建一个数组 [1, 2, 3]，在内部会默认使用 new Array() 构造器。因此 Array.prototype 变成了这个数组的 prototype，并为这个数组提供数组的操作方法。这样内存的存储效率是很高的。
    // 所有的内建原型顶端都是 Object.prototype。这就是为什么有人说“一切都从对象继承而来”。
    {
        let arr = [1, 2, 3];
        // 它继承自 Array.prototype？
        console.log(arr.__proto__ === Array.prototype); // true

        // 接下来继承自 Object.prototype？
        console.log(arr.__proto__.__proto__ === Object.prototype); // true

        // 原型链的顶端为 null。
        console.log(arr.__proto__.__proto__.__proto__); // null
    }

    // 一些方法在原型上可能会发生重叠，例如，Array.prototype 有自己的 toString 方法来列举出来数组的所有元素并用逗号分隔每一个元素。
    {

        let arr = [1, 2, 3];
        console.log(arr.toString()); // 1,2,3
        Array.prototype.toString = Object.prototype.toString; // 将对象原型上的toString方法 赋值给 数组原型上的toString
        console.log(arr.toString()); // [object Array]
        let obj = {
            '1': 1,
            'name': 'lzx'
        };
        console.log(obj.toString()); // [object Object]
    }

    // 其他内建对象也以同样的方式运行。即使是函数 —— 它们是内建构造器 Function 的对象，并且它们的方法（call/apply 及其他）都取自 Function.prototype。函数也有自己的 toString 方法。
    {
        function f() { }
        console.log(f.__proto__ === Function.prototype); // true
        console.log(f.__proto__.__proto__ === Object.prototype); // true
        console.log(f.toString()); // function f() {}
        Function.prototype.toString = Object.prototype.toString;
        console.log(f.toString()); // [object Function]
    }


    // 基本数据类型 最复杂的事情发生在字符串、数字和布尔值上。
    // 正如我们记忆中的那样，它们并不是对象。但是如果我们试图访问它们的属性，那么临时包装器对象将会通过内建的构造器 String、Number 和 Boolean 被创建。它们提供给我们操作字符串、数字和布尔值的方法然后消失。
    {
        let str = "123";
        console.log(str.toString());
        String.prototype.toString = function (value) {
            return value + 1;
        };
        console.log(str.toString(str)); // 1231
    }

    // 值 null 和 undefined 没有对象包装器
    // 特殊值 null 和 undefined 比较特殊。它们没有对象包装器，所以它们没有方法和属性。并且它们也没有相应的原型。\

    // 更改原生原型
    {
        // 我们向 String.prototype 中添加一个方法，这个方法将对所有的字符串都是可用的：
        String.prototype.show = function () {
            console.log(this);
        }
        "123".show(); // [String: '123']
    }

    // 原型是全局的，所以很容易造成冲突。如果有两个库都添加了 String.prototype.show 方法，那么其中的一个方法将被另一个覆盖。
    // 通常来说，修改原生原型被认为是一个很不好的想法。

    // 在现代编程中，只有一种情况下允许修改原生原型。那就是 polyfilling。
    // Polyfilling 是一个术语，表示某个方法在 JavaScript 规范中已存在，但是特定的 JavaScript 引擎尚不支持该方法，那么我们可以通过手动实现它，并用以填充内建原型。
    {
        if (!String.prototype.repeat) {
            String.prototype.repeat = function (n) {
                return new Array(n + 1).join(this);
            }
        }
        console.log("la".repeat(3)); // lalala
    }

    // 从原型中借用: 指我们从一个对象获取一个方法，并将其复制到另一个对象。
    {
        let obj = {
            0: 'hello',
            1: 'world',
            length: 2
        };
        obj.join = Array.prototype.join;
        console.log(obj.join('-')); // hello-world
        // 内建的方法 join 的内部算法只关心正确的索引和 length 属性。它不会检查这个对象是否是真正的数组。许多内建方法就是这样。
    }
    // 另一种方式是通过将 obj.__proto__ 设置为 Array.prototype，这样 Array 中的所有方法都自动地可以在 obj 中使用了。
    {
        let obj2 = {
            0: 'hello',
            1: 'world',
            length: 2
        };
        obj2.__proto__ = Array.prototype;
        console.log(obj2.reverse()); // Array { '0': 'world', '1': 'hello', length: 2 }
    }
    // 请记住，我们一次只能继承一个对象。

    // 案例

    // 给函数添加一个 "f.defer(ms)" 方法
    {
        function f() {
            console.log('hello!');
        }
        if (!Function.prototype.defer) {
            Function.prototype.defer = function (ms) {
                setTimeout(() => {
                    this();
                }, ms);
            }
        }
        //f.defer(1000); // 1 秒后显示 "Hello!"
    }

    // 将装饰器 "defer()" 添加到函数
    // 在所有函数的原型中添加 defer(ms) 方法，该方法返回一个包装器，将函数调用延迟 ms 毫秒。
    {
        let obj = {
            x: 1,
            f(a, b, c) {
                return a + b + c + this.x;
            }
        }
        Function.prototype.defer = function (ms) {
            return (...args) => {
                setTimeout(() => {
                    // console.log(this.apply(obj, args));
                    console.log(this(...args));
                }, ms);
            }
        }
        //obj.f.bind(obj).defer(1000)(1,3,5); // after 1000ms output 10

        function fib(n) {
            if (n <= 2) {
                return n;
            } else {
                return fib(n - 1) + fib(n - 2);
            }
        }
        //fib.defer(1000)(5); // after 1000ms output 8
    }
}

{
    console.log('-------------原型方法，没有 __proto__ 的对象------------------');
    // __proto__ 被认为是过时且不推荐使用的（deprecated），这里的不推荐使用是指 JavaScript 规范中规定，proto 必须仅在浏览器环境下才能得到支持。

    // Object.create(proto, [descriptors])   利用给定的proto 作为[[prototype]] 和可选的属性描述来创建一个空对象。

    // Object.getPrototypeOf(obj)  返回对象 obj 的 [[Prototype]]
    // Object.setPrototypeOf(obj, proto)  将对象 obj 的 [[Prototype]] 设置为 proto。
    {
        let animal = {
            eats: true
        };

        // 创建对象，并将animal设置为新创建对象的[[prototype]]，并且给新对象添加name属性
        let rabbit = Object.create(animal, {
            'name': {
                value: 'rabbit',
                enumerable: true,
                writable: true,
            },
        });

        console.log(rabbit.eats); // true
        for (const key in rabbit) {
            console.log(key, rabbit[key]);
            // name rabbit
            // eats true
        }

        // 返回对象 rabbit 的 [[Prototype]]
        console.log(Object.getPrototypeOf(rabbit) === animal); // true

        let pig = {};
        Object.setPrototypeOf(pig, animal);
        console.log(pig.eats); // true
    }

    // 我们可以使用 Object.create 来实现比复制 for..in 循环中的属性更强大的对象克隆方式：
    {
        let animal = {
            eat: true,
            sleep: true,
            running() {
                console.log('animals is running');
            }
        };

        let rabbit = Object.create(animal, {
            'name': {
                value: 'rabbit',
                writable: true,
                enumerable: true,
                configurable: true
            },
            'color': {
                value: 'white',
                enumerable: true,
                writable: true
            }
        });
        let cloneRabbit = Object.create(Object.getPrototypeOf(rabbit), Object.getOwnPropertyDescriptors(rabbit));

        for (const key in cloneRabbit) {
            console.log(key, cloneRabbit[key]);
        }
        // name rabbit
        // color white
        // eat true
        // sleep true
        // running [Function: running]

        // 此调用可以对 obj 进行真正准确地拷贝，包括所有的属性：可枚举和不可枚举的，
        // 数据属性和 setters/getters —— 包括所有内容，并带有正确的 [[Prototype]]。
    }

    {
        // 创建一个没有原型（[[Prototype]] 是 null）：
        let obj = Object.create(null);
        // console.log(obj.toString()); // obj.toString is not a function

        let obj2 = Object.create(Object);
        console.log(obj2.toString()); // [object Object]
    }

    // 其他方法：

    // Object.keys(obj) / Object.values(obj) / Object.entries(obj) —— 返回一个可枚举的由自身的字符串属性名/值/键值对组成的数组。
    // Object.getOwnPropertySymbols(obj) —— 返回一个由自身所有的 symbol 类型的键组成的数组。
    // Object.getOwnPropertyNames(obj) —— 返回一个由自身所有的字符串键组成的数组。
    // Reflect.ownKeys(obj) —— 返回一个由自身所有键组成的数组。
    // obj.hasOwnProperty(key)：如果 obj 拥有名为 key 的自身的属性（非继承而来的），则返回 true。

    {
        // 为 dictionary 添加 toString 方法
        console.log('-------------------------------')
        // 创建一个没有原型的对象
        let dictionary = Object.create(null);

        // 你的添加 dictionary.toString 方法的代码
        Object.defineProperty(dictionary, 'toString', {
            writable: true
        })
        dictionary.toString = function () {
            return Object.keys(this).join(",");
        }
        // 添加一些数据
        dictionary.apple = "Apple";
        dictionary.__proto__ = "test"; // 这里 __proto__ 是一个常规的属性键

        // 在循环中只有 apple 和 __proto__
        for (let key in dictionary) {
            console.log(key); // "apple", then "__proto__"
        }

        // 你的 toString 方法在发挥作用
        console.log(dictionary.toString()); // "apple,__proto__"
    }
}


// Class 基本语法
{
    console.log('-----------Class 基本语法------------');
    // 在面向对象的编程中，class 是用于创建对象的可扩展的程序代码模版，它为对象提供了状态（成员变量）的初始值和行为（成员函数或方法）的实现。

    // “class” 语法
    {
        class MyClass {
            constructor(name) {
                this.name = name;
            }
            method1() { return 'method 1'; }
            method2() { }
            method3() { }
        }
        // 然后使用 new MyClass() 来创建具有上述列出的所有方法的新对象。
        // new 会自动调用 constructor() 方法，因此我们可以在 constructor() 中初始化对象。
        let user = new MyClass('lzx');
        console.log(user); // MyClass { name: 'lzx' }
        console.log(user.method1()); // method 1
    }
    // 例子
    {
        class User {
            constructor(name) {
                this.name = name;
            }

            sayHi() {
                console.log(this.name);
            }
        }

        let userLzx = new User('lzx');
        userLzx.sayHi(); // lzx
    }
    // 类的方法之间没有逗号

    // 什么是 class？
    // 在 JavaScript 中，类是一种函数。
    {
        class User {
            constructor(name) {
                this.name = name;
            }
            sayHi() {
                console.log(this.name);
            }
        }
        let userZxy = new User('Zxy');
        console.log(typeof User); // function
        console.log(User === User.prototype.constructor) // true
        console.log(Object.getOwnPropertyNames(User.prototype)); // [ 'constructor', 'sayHi' ]
    }

    // class User {...} 构造实际上做了如下的事儿：
    {
        // 1.创建一个名为 User 的函数，该函数成为类声明的结果。该函数的代码来自于 constructor 方法（如果我们不编写这种方法，那么它就被假定为空）。
        // 2.存储类中的方法，例如 User.prototype 中的 sayHi。
    }

    // 当 new User 对象被创建后，当我们调用其方法时，它会从原型中获取对应的方法，正如我们在 F.prototype 一章中所讲的那样。因此，对象 new User 可以访问类中的方法。

    // 不仅仅是语法糖
    // 用纯函数重写 class User
    {
        function User(name) {
            this.name = name;
        }

        User.prototype.sayHi = function () {
            console.log(this.name);
        }

        let user = new User('lzx');
        user.sayHi(); // lzx
        console.log(Object.getPrototypeOf(user)); // { sayHi: [Function (anonymous)] }
    }
    // 这个定义的结果与使用类得到的结果基本相同。因此，这确实是将 class 视为一种定义构造器及其原型方法的语法糖的理由。

    // class与普通函数不同，必须使用 new 来调用它 但是typeof 类名 返回的是function
    {
        class Animals {
            constructor() {
                this.name = 1;
            }
        }
        console.log(typeof Animals); // function
        console.log(Animals); // [class Animals]
        let pig = new Animals();
        console.log(pig); // Animals { name: 1 }
    }

    // 类方法不可枚举。 类定义将 "prototype" 中的所有方法的 enumerable 标志设置为 false。
    // 这很好，因为如果我们对一个对象调用 for..in 方法，我们通常不希望 class 方法出现。
    {
        class Car {
            constructor(name) {
                this.name = name
            }
            running(speed) {
                console.log(`${this.name} is driving at ${speed} km / h`);
            }
            stop() {
                console.log('the car has stoped');
            }
        }
        let bmw = new Car('bmw');
        console.log(typeof bmw); // object
        bmw.color = "red";
        console.log(bmw); // Car { name: 'bmw', color: 'red' }

        // class 方法不会被枚举
        for (const key in bmw) {
            console.log(key); // 先输出name、然后输出color
        }

        bmw.running(120); // bmw is driving at 120 km / h

        // console.log( Object.getOwnPropertyDescriptors(bmw.__proto__) );
        console.log(Object.getOwnPropertyDescriptors(Car.prototype)); // enumerable都是被设置成false，所以不可枚举！

        // 重新给类的原型定义running方法，定义为可枚举
        Object.defineProperty(Car.prototype, 'running', {
            value: function (speed) {
                console.log(`${this.name} is driving at ${speed - 20} km / h`);
            },
            enumerable: true,
            writable: true,
            configurable: true
        });

        for (const key in bmw) {
            console.log(key); // 依次输出name color running
        }

        bmw.running(120); // bmw is driving at 100 km / h
        bmw.stop();

        // 类总是使用 use strict。 在类构造中的所有代码都将自动进入严格模式。
    }

    // 类表达式
    // 就像函数一样，类可以在另外一个表达式中被定义，被传递，被返回，被赋值等。
    {
        let User = class {
            sayHi() {
                console.log('hello');
            }
        }
        new User().sayHi(); // hello
    }

    // 如果类表达式有名字，那么该名字仅在类内部可见：
    {
        let User = class Myclass {
            sayHi() {
                console.log('hello');
            }
        }
        new User().sayHi(); // hello
        // new Myclass().sayHi(); 会报错 所以注释了，类表达式有名字，外部不可见
    }

    // 我们甚至可以动态地“按需”创建类，就像这样：
    {
        function makeClass(phrase) {
            return class {
                sayHi() {
                    console.log(phrase);
                }
            }
        }

        let User = makeClass('hi');
        new User().sayHi(); // hi
    }

    // Getters/setters
    // 就像对象字面量，类可能包括 getters/setters，计算属性（computed properties）等。
    {
        // 类限制new的时候，设置name属性输入的字符串长度>4

        class User {
            constructor(name) {
                this.name = name;
            }
            get name() {
                return this._name;
            }
            set name(value) {
                if (value.length < 4) {
                    console.log('name is too short');
                    return;
                }
                this._name = value;
            }
        }

        let John = new User('John');
        console.log(John.name); // John

        let May = new User('May'); // name is too short
        console.log(May.name); // undefined
    }

    // 计算属性名称 […]
    // 这里有一个使用中括号 [...] 的计算方法名称示例：
    {
        class User {
            ['say' + 'Hi']() {
                console.log('hi');
            }
        }
        new User().sayHi(); // hi
    }

    // Class 字段（旧的浏览器可能需要 polyfill）
    // 之前，我们的类仅具有方法。 “类字段”是一种允许添加任何属性的语法。

    // 例如，让我们在 class User 中添加一个 name 属性：我们就只需在表达式中写 " = "，就这样。
    {
        class User {
            name = 'John';

            sayName() {
                console.log(this.name);
            }
        }
        let user1 = new User();
        user1.sayName(); // John

        for (const key in user1) {
            console.log(key); // name  并不是设置在类的 prototype 上了
        }
    }
    // 类字段重要的不同之处在于，它们会在每个独立对象中被设好，而不是设在 User.prototype：

    // 使用类字段制作绑定方法
    // 正如 函数绑定 一章中所讲的，JavaScript 中的函数具有动态的 this。它取决于调用上下文。
    // 如果一个对象方法被传递到某处，或者在另一个上下文中被调用，则 this 将不再是对其对象的引用。
    {
        class Button {
            constructor(value) {
                this.value = value;
            }

            click() {
                console.log(this.value);
            }
        }

        let button = new Button("hello");
        console.log(button);
        // setTimeout(button.click, 1000) // undefined this丢失
    }
    // 解决this丢失，可以传递一个包装函数，例如 setTimeout(() => button.click(), 1000)。
    // 也可以将方法绑定到对象，例如在 constructor 中。

    // 类字段提供了另一种非常优雅的语法：
    {
        class Button {
            constructor(value) {
                this.value = value;
            }
            // 定义类字段 设置为箭头函数
            click = () => {
                console.log(this.value);
            }
        }
        let button = new Button('hi');
        let f = button.click;
        f(); // hi
    }

    // 总结
    {
        class MyClass {
            prop = value; // 属性

            constructor() { // 构造器
                // ...
            }

            method() { } // method

            get something() { } // getter 方法
            set something(value) { } // setter 方法

            [Symbol.iterator]() { } // 有计算名称（computed name）的方法（此处为 symbol）
            // ...
        }
    }
}