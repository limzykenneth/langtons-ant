# langtons-ant

##### Langton's ant is a two-dimensional Turing machine with a very simple set of rules but complex emergent behavior. It was invented by Chris Langton in 1986 and runs on a square lattice of black and white cells.

I recommend [this video](https://www.youtube.com/watch?v=NWBToaXK5T0) by Numberphile to explain it better.

---

Rules are simple: 

1. At a white square, turn 90&#176; right, flip the color of the square, move forward one unit.
2. At a black square, turn 90&#176; left, flip the color of the square, move forward one unit.

Written with [p5.js](http://p5js.org).
