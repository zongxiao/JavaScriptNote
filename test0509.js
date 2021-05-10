"use strict";
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

  console.log(Object.getOwnPropertyDescriptor(user, 'age'));
  console.log(`${user.name} is ${user.age} years old`); // lzx is 26 years old
}

{

    // 我们有两只仓鼠：speedy 和 lazy 都继承自普通的 hamster 对象。
    // 当我们喂其中一只的时候，如何确保另一只不会共享同一个胃
    let hamster = {
        stomach: "",
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

{
    let animal = {
        eat: true
    };

    function People(name) {
        this.name = name;
    }
    People.prototype.age = 0;
    let xiaoming = new People('xiaoming');


    let xiaohong = new xiaoming.constructor('xiaohong');
    console.log(xiaohong);

    for (const key in xiaohong) {
        console.log(key);
    }

}

{
    // 我们要实现一个服务（server），每间隔 2 秒向服务器发送一个数据请求，
    // 但如果服务器过载了，那么就要降低请求频率，一旦请求成功，立马重新2秒一个请求
    // let delay = 1000;
    // let timeid = setTimeout(function request() {
    //     console.log('request...')
    //     if (Math.random() < 0.6) {
    //         console.log('请求成功');
    //         delay = 1000;
    //     } else {
    //         console.log('服务器过载，请降低请求频率');
    //         delay += 5000;
    //     }

    //     timeid = setTimeout(request, delay);
    // }, 1000)

    // printNumbers(from, to)

    function printNumbers(from, to) {
        let current = from;
        let timeId = setInterval(function func() {
            if (current === to) {
                clearInterval(timeId);
            }
            console.log( current++ );
        }, 1000);
    }


    function printNumbers2(from, to) {
        let current;
        let timeid = setTimeout(function func() {
            if (current === to) {
                clearTimeout(timeid);
            } else {
                timeid = setTimeout(func, 1000);
            }
        }, 1000)
    }
    
    let slow = function(x) {
        let start = new Date();
        for (let i = 0; i < 1000000000; i++) {
            i * 9;
        }
        let end = new Date();
        console.log(`${end - start}ms`);
        return x;
    }

    // console.log( slow(3) );
    // console.log( slow(3) );

    let cachingDecorator = function(func) {
        let cache = new Map();
        return function(x) {
            if (cache.has(x)) {
                return cache.get(x);
            }
            let result = func(x);
            cache.set(x, result);
            return result;
        }
    }

    slow = cachingDecorator(slow);

    console.log( slow(3) );
    console.log( slow(3) );
}