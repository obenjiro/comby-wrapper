const curryAsync = function (fn) {
    const arity = fn.length;

    return function f1(...args) {
        if (args.length >= arity) {
            return fn(...args)
        } else {
            return async function f2(...moreArgs) {
                const newArgs = args.concat(moreArgs);
                return f1(...newArgs)
            }
        }
    }
}

module.exports = {
    curryAsync,
}