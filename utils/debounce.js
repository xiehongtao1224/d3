function debounce(delay) {
    var timer = null;
    return function(fn) {
        if(timer !== null) clearTimeout(timer);
        timer = setTimeout(() => {
            if(typeof fn === 'function') fn();
        }, delay);
    }
}