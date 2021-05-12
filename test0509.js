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
    worker.slow = debounce(worker.slow, 1000);
    worker.slow(1, 2); // 不输出
    worker.slow(2, 5); // 20
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