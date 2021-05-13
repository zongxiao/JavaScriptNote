"use strict";

{
    let worker = {
        y: 2,
        slow (x, z) {
            console.log(x * z * this.y);
        },
    }

    worker.slow(3, 4); // 立马输出 24

    //创建一个函数包装之后延时输出
    function debounce(f, ms) {
        let timeid = null;
        return function() {
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
    range[Symbol.iterator] = function() {
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
            let key = typeof(item) + item;
            return obj.hasOwnProperty(key) ? false : (obj[key] = true);
        })
        return singleArr;
    }
    console.log( unique([1,2,"1","2",1]) );

    // Set特性去重
    let arr = [1,2,"1","2",1]
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

    console.log( aclean(arr) );
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
    // let clone = Object.assign({}, person);
    let clone = Object.defineProperties({}, Object.getOwnPropertyDescriptors(person));
    console.log(clone.child === person.child); // true
    
    // 深拷贝 递归法
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
    console.log(deepCloneObj.child === person.child); // false

    // 深拷贝 JSON.stringfy()字符串化，再用JSON.parse()对象化
    let deepCloneObj2 = JSON.parse(JSON.stringify(person, null, 2));
    console.log(deepCloneObj.child === person.child);
    console.log(deepCloneObj2);
}