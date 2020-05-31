'use strict';

/**
 * Generate the sequence
 */
var ITERATIONS = 66;
var sequence = [0];
var curr = void 0;

for (var i = 2; i < ITERATIONS; i++) {
    curr = sequence[i - 2];
    if (sequence.indexOf(curr - i) === -1 && curr - i > 0) {
        sequence.push(curr - i);
    } else {
        sequence.push(curr + i);
    }
}

/**
 * Options
 */
var SCALING = 8;
var ANIMATE = true;
var ANIMSPEED = 0.1;
var COLORSPEED = 5;

/**
 * Canvas setup
 */
var c = document.createElement('canvas');
var ctx = c.getContext('2d');
// Find the appropriate width of the canvas, i.e. the largest difference in the number line
c.width = (Math.max.apply(Math, sequence) - Math.min.apply(Math, sequence)) * SCALING + Math.min.apply(Math, sequence) + 4;
// Find the appropriate height of the canvas, i.e. the largest diameter
for (var _i = 0, diff, max = 0; _i < sequence.length - 1; _i++) {
    diff = Math.abs(sequence[_i + 1] - sequence[_i]);
    if (diff > max) max = diff;
    c.height = max * SCALING + 4;
}
// Adding some internal padding for antializing
ctx.translate(2, 2);
document.getElementById('wrapper').appendChild(c);

/**
 * Animated drawing
 */
var getPos = function getPos(i) {
    return (sequence[i] + sequence[i + 1]) / 2;
};
var getRadius = function getRadius(i) {
    return Math.abs(sequence[i] - sequence[i + 1]) / 2;
};
var isNextLarger = function isNextLarger(i) {
    return sequence[i + 1] > sequence[i];
};
var isUp = function isUp(i) {
    return Boolean(i % 2);
};
var nextframe = void 0,
    progress = 0;

var drawAnim = function drawAnim() {
    // Clear the canvas
    ctx.clearRect(0, 0, c.width, c.height);

    // Previous circles
    var index = Math.floor(progress);

    for (var _i2 = 0, _pos, _radius, _spin = true; _i2 < index; _i2++) {
        _pos = (sequence[_i2] + sequence[_i2 + 1]) / 2;
        _radius = Math.abs(sequence[_i2 + 1] - sequence[_i2]) / 2;
        ctx.strokeStyle = 'hsl(' + (180 + _i2 * COLORSPEED) + ', 50%, 50%)';
        ctx.beginPath();
        ctx.arc(_pos * SCALING, c.height / 2, _radius * SCALING, 0, Math.PI, _spin);
        ctx.stroke();
        _spin = !_spin;
    }

    // Animated part
    var pos = getPos(index);
    var radius = getRadius(index);
    var arc = Math.PI * (progress - Math.floor(progress));
    var start = isNextLarger(index) ? Math.PI : 0;
    var end = isUp(index) && !isNextLarger(index) || !isUp(index) && isNextLarger(index) ? start + arc : start - arc;
    var spin = isUp(index) && !isNextLarger(index) || !isUp(index) && isNextLarger(index) ? false : true;

    ctx.strokeStyle = 'hsl(' + (180 + index * COLORSPEED) + ', 50%, 50%)';
    ctx.beginPath();
    ctx.arc(pos * SCALING, c.height / 2, radius * SCALING, start, end, spin);
    ctx.stroke();

    // Next frames
    if (progress < sequence.length - 1) nextframe = requestAnimationFrame(drawAnim);
    progress += ANIMSPEED;
};

/**
 * Static drawing
 */
var drawStatic = function drawStatic() {
    // Axes
    ctx.beginPath();
    ctx.moveTo(0, c.height / 2);
    ctx.lineTo(c.width, c.height / 2);
    ctx.stroke();

    // Curve
    var spin = true;
    var pos = void 0,
        radius = void 0;
    for (var _i3 = 0; _i3 < sequence.length - 1; _i3++) {
        pos = (sequence[_i3] + sequence[_i3 + 1]) / 2;
        radius = Math.abs(sequence[_i3 + 1] - sequence[_i3]) / 2;
        ctx.strokeStyle = 'hsl(' + (180 + _i3 * COLORSPEED) + ', 50%, 50%)';
        ctx.beginPath();
        ctx.arc(pos * SCALING, c.height / 2, radius * SCALING, 0, Math.PI, spin);
        ctx.stroke();
        spin = !spin;
    }
};

/**
 * Startup
 */
if (ANIMATE) {
    drawAnim();
} else {
    drawStatic();
}

/**
 * Run again
 */
document.getElementById('run').onclick = function (ev) {
    try {
        cancelAnimationFrame(nextframe);
    } catch (err) {} finally {
        progress = 0;
        drawAnim();
    }
};
