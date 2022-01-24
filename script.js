// Assume the following functions exist:
// stores data (value) by key
async function cache_store(key, value) {
    mock_cache_store(key, value);
}
// retrieves data by key (if it exists)
async function cache_retrieve(key) {
    return await mock_cache_retrieve(key);
}
// fetches data from a slow data source
async function slow_function(input) {
    return await mock_slow_function(input);
}

let cache = {};
function memoize(slow_function) {
    return async (...args) => {
        // We define the input as the key for caching
        const myKey = args[0];
        // The result is established as a Promise for being able to return
        // the fastest result between a call to the slow function and
        // retrieving from cache
        const result = new Promise((resolve, reject) => {
            // Call to the slow function
            slow_function(args).then(res => {
                resolve(res);
                cache_store(myKey, res);
            }).catch(err => reject(err));
            // And examine cache as well
            cache_retrieve(myKey).then(cacheResult => {
                if (typeof cacheResult !== 'undefined') {
                    resolve(cacheResult);
                }
            }).catch(err => reject(err));
        });
        return result;
    };
};

// Some Mock functions to test this code
// Uncomment if needed (from the wrapper functions above)

// Mock function for cache storing
async function mock_cache_store(key, value) {
    setTimeout(() => cache[key] = value, 1000);
}

// Mock function for cache retrieval
async function mock_cache_retrieve(key) {
    const randomDelay = Math.floor(Math.random() * 1000);
    console.log("Cache retrieval delay: " + randomDelay);
    let result = new Promise(function (resolve, reject) {
        setTimeout(() => resolve(cache[key]), randomDelay);
    });
    return result;
}

// Mock function for slow_function
const mock_slow_function = function (input) {
    const randomDelay = Math.floor(Math.random() * 2000);
    console.log("Slow function delay: " + randomDelay);
    let result = new Promise(function (resolve, reject) {
        setTimeout(() => resolve(input * 5), randomDelay);
    });
    return result;
}

// Some data for testing
// Data can be preloaded in the cache and the memoized function
// can be run several times, with different values to test that it works as expected
cache = {1: 5, 2: 10, 4: 20, 8: 40};
const mf = memoize(slow_function);
const t0 = Date.now();
mf(1).then(res => {
    console.log('Result: ' + res);
    const t1 = Date.now();
    console.log('Call to memoized function took ' + (t1 - t0) + ' milliseconds.');
});

// Uncomment to check that cache is always updated in the end
//setTimeout(() => console.log(cache), 3000);