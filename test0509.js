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