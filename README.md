# memoization
Implementation of a memoization function for improving the response time of some API.

This is a Javascript implementation with some mocking functions to emulate the behavior
of a slow function which provides data upon request and some caching functions.

Some test code is also provided in the end to verify that the memoization functions
works as expected:
<ul>
    <li>It returns the fastest result, whether it's the cached result or the fresh result 
        (from the slow function).</li>
    <li>The cache is updated in either scenario.</li>
</ul>
