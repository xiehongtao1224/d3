function throttle(delay) {
    var timer = null;
    return function(fn) {
        if(!timer) {
            // if(typeof fn === 'function') fn();   //一开始执行fn
            timer = setTimeout(() => {
                if(typeof fn === 'function') fn();   //delay后执行fn
                timer = null;
            }, delay);
        }
    }
}