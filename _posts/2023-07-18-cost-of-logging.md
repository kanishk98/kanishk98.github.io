---
title: "The Cost of Logging"
---

I was tempted to title this post the _Hidden_ Cost of Logging for extra drama credit, but that seems a bit too unfair to most software engineers. If you're a programmer, you understand that any operation costs _something_; how much it really costs your program is a question of profiling and perhaps, if you're lacking for things to do on a Sunday as I am, an excuse to burrow down a few rabbit holes. 

Okay, here's the problem. I've got a Node.js application that loops through a bunch of files and logs the name of each to the console. I felt it was taking forever for this program to run and I wondered what factor of speedup I could achieve if I just stopped writing logs to stdout. While it's fun to mess around with performance tools and `strace` as I did later, the salient and much more subjective question I'd like to answer is whether the slowdown I feel adds up with the slowdown we see on paper. 

If I abstract away the `fs` operations for simplicity, this is my code for a folder containing 10,000 files:

```js
for (let i = 0; i < 10000; ++i) {
    console.log('file_name.ext');
}
```

Let's add some basic time measurement to it. Our control case will be a loop that does nothing at all. 

```js
console.time('tick');
for (let i = 0; i < 10000; ++i) {
    console.log('file_name.ext');
}
console.timeEnd('tick');

console.time('tick');
for (let i = 0; i < 10000; ++i) {
    // i'm useless!
}
console.timeEnd('tick');
```

Running both of these in Chrome 114 on my local machine, I see 181.85 ms taken by our logs and 1 ms by our empty loop. 

That makes sense, of course. Doing nothing is cheaper than doing something, but that's not interesting at all. What happens if I use another runtime?

On a NodeJS program, the same 10,000 logs take 157.12 ms. That's a sizeable gap - nearly 25 ms! [Computers are fast](https://jvns.ca/blog/2014/05/12/computers-are-fast/), so this is a clear loss for Chrome. Let's average these out over 10,000 samples on the same machine to be sure this isn't an outlier. 

