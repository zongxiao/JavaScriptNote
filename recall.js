"use strict";

{
    let worker = {
        y: 2,
        slow(x, z) {
            console.log(x * z * this.y);
        },
    }

    worker.slow(3, 4); // 立马输出 24

    //创建一个函数包装之后延时输出
    function debounce(f, ms) {
        let timeid = null;
        return function () {
            clearTimeout(timeid);
            timeid = setTimeout(() => {
                // f.apply(worker, arguments);
                f.bind(this)(...Array.from(arguments))
            }, ms);
        }
    }
    // worker.slow = debounce(worker.slow, 1000);
    // worker.slow(1, 2); // 不输出
    // worker.slow(2, 5); // 20
}
{
    let objnew = {}
    let obj = {
        'red': 'hongse',
        'yellow': 'huansge',
        'id': '1212121212',
        'parentId': '222'
    };

    Object.keys(obj).filter(item => {
        if (item.toLocaleLowerCase().indexOf('id') === -1) return true;
    }).map(item => objnew[item] = obj[item]);

    console.log(objnew);
    // { red: 'hongse', yellow: 'huansge' }
}

{
    // 对象迭代器
    let range = {
        from: 1,
        to: 5
    }
    range[Symbol.iterator] = function () {
        return {
            currentValue: this.from,
            endValue: this.to,
            next() {
                if (this.currentValue <= this.endValue) {
                    return {
                        done: false,
                        value: this.currentValue++
                    }
                } else {
                    return {
                        done: true
                    }
                }
            }
        }
    }
    for (const iterator of range) {
        console.log(iterator);
    }
}

{
    // 数组去重
    function unique(arr) {
        let obj = {};
        let singleArr = arr.filter(item => {
            let key = typeof (item) + item;
            return obj.hasOwnProperty(key) ? false : (obj[key] = true);
        })
        return singleArr;
    }
    console.log(unique([1, 2, "1", "2", 1]));

    // Set特性去重
    let arr = [1, 2, "1", "2", 1]
    let newArr = [...new Set(arr)];
    console.log(newArr);
}

{
    // Map过滤字谜
    function aclean(arr) {
        let map = new Map();

        for (const value of arr) {
            let mapKey = value.toLowerCase().split("").sort().join("");
            map.set(mapKey, value);
        }

        return Array.from(map.values());
    }

    let arr = ["nap", "teachers", "cheaters", "PAN", "ear", "era"];

    console.log(aclean(arr));
}

{
    // 对象的拷贝
    let person = {
        name: 'John',
        hobby: ['eat', 'sleep'],
        child: {
            name: 'small John'
        }
    }

    Object.defineProperty(person, 'age', {
        value: 30,
        writable: true,
        enumerable: true,
        configurable: true
    });

    // 浅拷贝
    // let clone = Object.defineProperties({}, Object.getOwnPropertyDescriptors(person));
    let clone = Object.assign({}, person);
    console.log(clone.child === person.child); // true

    // 深拷贝 递归
    function deepCopy(sourceObj) {
        let cloneObj = Array.isArray(sourceObj) ? [] : {};

        for (const key in sourceObj) {
            if (sourceObj[key] instanceof Object) {
                cloneObj[key] = deepCopy(sourceObj[key]);
            } else {
                cloneObj[key] = sourceObj[key];
            }
        }
        return cloneObj;
    }

    let deepCloneObj = deepCopy(person);
    console.log(deepCloneObj);

    // 深拷贝 JSON.stringfy()字符串化，再用JSON.parse()对象化
    let deepCloneObj2 = JSON.parse(JSON.stringify(person, null, 2));
    console.log(deepCloneObj.child === person.child);
    console.log(deepCloneObj2);
}

{
    // Map()简例
    let visitCountMap = new Map();
    function addCount(user) {
        let currentCount = visitCountMap.get(user) || 0;
        visitCountMap.set(user, ++currentCount);
    }
    let userSilence37 = { name: 'lzx', age: 26 };
    // 此时userSilence37访问了我的站点2次
    addCount(userSilence37);
    addCount(userSilence37);
    console.log(visitCountMap.get(userSilence37)); // 2
    // userSilence37 注销了账号
    userSilence37 = null;
    console.log(visitCountMap);
    // Map { { name: 'lzx', age: 26 } => 2 }
    // 即使注销了账号 但是map里面的数据还在


    // WeakMap() 简例
    let visitCountWeakMap = new WeakMap();
    function addWeakCount(user) {
        let currentCount = visitCountWeakMap.get(user) || 0;
        visitCountWeakMap.set(user, ++currentCount);
    }
    let userBaby = { name: 'zxy', age: 20 };
    // 此时userBaby访问了1次
    addWeakCount(userBaby);
    console.log(visitCountWeakMap.get(userBaby)); // 1
    // userBaby 注销了账号
    userBaby = null;
    console.log(visitCountWeakMap);
    // WeakMap { <items unknown> }
    // 内存中已经彻底没有了userBaby
}

{
    // new Set()简例
    let visitSet = new Set();
    let Silence = { name: 'lzx' };
    let Baby = { name: 'zxy' };
    // 此时Silence访问了2次，Baby访问了一次
    visitSet.add(Silence);
    visitSet.add(Silence);
    visitSet.add(Baby);
    Silence = Baby = null; // 注销账号
    console.log(visitSet);
    // Set { { name: 'lzx' }, { name: 'zxy' } }
    // 注销的账号信息还存放在内存中

    // new WeakSet()
    let visitWeakSet = new WeakSet();
    let userLuo = { name: 'luo' };
    let userZhang = { name: 'zhang' };
    visitWeakSet.add(userLuo);
    visitWeakSet.add(userZhang);
    userLuo = userZhang = null;
    console.log(visitWeakSet);
    // WeakSet { <items unknown> }
}

{
    // 对象使用数组的方法对价格进行加倍

    // 水果的价格
    let fruitsPrice = {
        banana: 3,
        apple: 5,
        peach: 4
    };
    // 翻倍後水果的价格
    let doubleFruits = Object.fromEntries(
        Object.entries(fruitsPrice).map(([key, value]) => {
            return [key, value * 2];
        })
    );
    console.log(doubleFruits);
}

{
    // 对象属性值求和
    let slaries = {
        John: 3000,
        Mary: 4500,
        Bol: 6000
    };
    // 利用Object.entries()获取键值集合的集合
    let sum = Object.entries(slaries).reduce((prev, [key, value]) => {
        return prev + value;
    }, 0);
    console.log(sum);

    // 利用Object.values()获取对象的value的集合
    let sum2 = Object.values(slaries).reduce((prev, item) => {
        return prev + item
    }, 0);
    console.log(sum2);
}

{
    // Date简例 返回距离明天还有多久
    function getTomorrowSeconds() {
        let now = new Date();
        let end = new Date();
        end.setDate(now.getDate() + 1);
        end.setHours(0);
        end.setMinutes(0);
        end.setSeconds(0);
        let reduceSeconds = (end - now) / 1000;
        return reduceSeconds;
    }
    console.log(getTomorrowSeconds() + 's');

}

{
    // JSON简例
    let room = {
        number: 23
    };
    let meetup = {
        title: 'oc',
        false: [
            { name: 'jogn' },
            { name: 'hhh' }
        ],
        place: room
    };
    // 循环引用
    room.ocupy = meetup;
    meetup.self = meetup;
    console.log(JSON.stringify(meetup, function (key, value) {
        if (value === meetup && key != "") {
            return undefined;
        } else {
            return value;
        }
    }, 0));
}
{
    // 递归遍历对象
    let staffs = {
        sale: {
            salepart1 : [
                { name: 'zhangsan', salary: 5500 },
                { name: 'lisi', salary: 7500 }
            ],
            salepart2 : [
                { name: 'wangwu', salary: 12000 },
                { name: 'zhaoliu', salary: 4500 }
            ]
        },
        development: {
            javascript: [
                { name: 'youyuxi', salary: 25000 },
                { name: 'lzx', salary: 6200 }
            ],
            java: [
                { name: 'lihong', salary: 15000 }
            ]
        }
    }

    function salarySum(staffs) {
        if (Array.isArray(staffs)) {
            return staffs.reduce((prev, item) => {
                return prev + item.salary;
            }, 0);

        } else {
            let sum = 0;
            for (const depart of Object.values(staffs)) {
                sum += salarySum(depart);
            }
            return sum;
        }
    }

    console.log( salarySum(staffs) );
}

{
    // 斐波那契数列
    // 规律：1 2 3 5 8 13 21...  F(N) = F(N - 1) + F(N - 2);
    function fib(n) {
        if (n <= 2) return n;
        else {
            return fib(n - 1) + fib(n - 2);
        }
    }
    console.log(fib(7));

    function iterationFib(n) {
        let a = 1;
        let b = 2;
        if (n <= 2) return b;
        for (let i = 3; i <= n; i++) {
            let c = a + b;
            a = b;
            b = c;
        }
        return b;
    }
    console.log(iterationFib(7));
}
{
    // 展开符
    let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    let max = Math.max(...arr);
    console.log(max);

    let str = "abcd";
    let arrstr = [...str];
    console.log(arrstr);
}

{
    // 作用域闭包
    let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    function inBetween(start, end) {
        return item => {
            return item >= start && item <= end ? true : false;
        }
    }
    console.log(arr.filter(inBetween(3, 6)));
    function inArray(...arr) {
        return item => {
            return arr.includes(item) ? true : false;
        }
    }
    console.log(arr.filter(inArray(1, 3, 4, 10)));

}

{
    // 函数对象属性设置
    // counter()计数，在counter里面增加set()和decrease()
    function makeCounter() {
        let count = 0;
        let counter = function () {
            return ++count;
        }
        counter.set = function(value) {
            return count = value;
        }
        counter.decrease = function() {
            return --count;
        }
        return counter;
    }
    let counter = makeCounter();
    console.log(counter());
    console.log(counter());
    let counter2 = makeCounter();
    console.log(counter2());
    console.log(counter2.set(4));

}

{
    // 调度setTimeout
    let delay = 200000;
    let timeid = setTimeout(function req() {
        if (Math.round(Math.random())) {
            console.log('success...');
            delay = 200000;
        } else {
            console.log('fail...');
            delay += 200000;
        }
        timeid = setTimeout(req, delay);
    }, delay);
}

{
    // 缓存包装器
    let worker = {
        x: 2,
        slow (a) {
            for (let i = 0; i < 100000; i++) {
                a = a + this.x;
            }
            return a;
        }
    }
    // console.log( worker.slow(4) );
    // console.log( worker.slow(4) );

    function wrapper (func) {
        let cache = new Map();
        return function (x) {
            if (cache.has(x)) {
                return cache.get(x);
            }
            let result = func.call(this, x);
            cache.set(x, result);
            return result;
        }
    }
    worker.slow = wrapper(worker.slow);
    // console.log( worker.slow(5) );
    // console.log( worker.slow(5) );
    // console.log( worker.slow(3) );
}

{
    // 多参数缓存器
    let worker = {
        x: 2,
        slow (a, b) {
            for (let i = 0; i < 1000; i++) {
                a = a + b + this.x;
            }
            return a;
        }
    }
    function hash(args) {
        return Array.prototype.join.call(args, "&");
    }
    function wrapper(func, hash) {
        let cache = new Map();
        return function() {
            let key = hash(arguments);
            if (cache.has(key)) {
                return cache.get(key);
            }
            let result = func.apply(this, arguments);
            cache.set(key, result);
            return result;
        }
    }
    worker.slow = wrapper(worker.slow, hash);
    console.log(worker.slow(2, 3));
    // 已经缓存记录，无需重新调用耗时的函数
    console.log(worker.slow(2, 3));
    console.log(worker.slow(4, 2));
}

{
    // 防抖装饰器
    let people = {
        name: 'lzx',
        writing(value) {
            console.log(`${value} by ${this.name}`);
        }
    }
    function debounce(func, ms) {
        let timeid = null;
        function wrapper() {
            clearTimeout(timeid);
            timeid = setTimeout(() => {
                func.apply(this, arguments);
            }, ms);
        }
        return wrapper;
    }
    people.writing = debounce(people.writing, 200);
    setTimeout(() => people.writing(12), 0);
    setTimeout(() => people.writing(1234), 300);
    setTimeout(() => people.writing(12345), 400);
}

{
    // 绑定上下文
    let user = {
        name: 'lzx'
    };

    function sayName(x) {
        console.log(this.name + x);
    }

    let g = sayName.bind(user, "+");
    g(); // lzx+
    
}

{
    // aliyun阿里云
    // $(".y-item td:nth-child(2)").text()
}

{
    // F.prototype为构造函数设置原型
    function Rabbit(color) {
        this.color = color;
    }

    Rabbit.prototype = {
        constructor: Rabbit,
        jump: true
    };

    let redRabbit = new Rabbit('red');
    console.log(redRabbit.jump);

    let whiteRabbit = new redRabbit.constructor('white');
    console.log(whiteRabbit.jump);

    for (const key in whiteRabbit) {
        console.log(key,whiteRabbit[key]);
        if (Object.hasOwnProperty.call(whiteRabbit, key)) {
            console.log(key,whiteRabbit[key]);
        }
    }
}