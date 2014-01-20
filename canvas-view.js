var Vec2, fc;

if (typeof require !== 'undefined') {
  Vec2 = require('vec2');
  fc = require('vec2');
}


function CanvasView(ctx, canvas) {
  this.ctx = ctx;
  this.canvas = canvas;

  // TODO: migrate this into fc

  this.canvas.width = window.innerWidth;
  this.canvas.height = window.innerHeight;

  this._scale = Vec2(1, 1);
  this._translation = Vec2(0, 0);
  this._rotation = 0;
}

// set the scale
CanvasView.prototype.zoom = function(origin, x) {
  if (x) {
    this.nudge(this._translation.subtract(origin, true).divide(this._scale).multiply(x));
    this._scale.add(Vec2(x, x)).clamp(Vec2(.1, .1), Vec2(100, 100));
  }
};


// set the translation
CanvasView.prototype.translate = function(x, y) {
  return this._translation.set(x, y);
};

// move the translation by the specified x/y
CanvasView.prototype.nudge = function(x, y) {
  return this._translation.add(x, y);
};

CanvasView.prototype.center = function() {
  return new Vec2(this.canvas.width/2, this.canvas.height/2);
};

// Apply the actual transform before rendering
CanvasView.prototype._applyTransform = function() {
  this.ctx.translate(this._translation.x, this._translation.y);
  this.ctx.scale(this._scale.x, this._scale.y);
};


var canvasView = function(bgcolor, updateFn) {

  var ctx = fc(function(delta) {

    ctx.clear(bgcolor);

    v._applyTransform();

    if (updateFn) {
      updateFn(ctx, delta);
    }
  });

  var v = new CanvasView(ctx, ctx.canvas)


  return v;

};

canvasView.CanvasView = CanvasView;

if (typeof module === 'object' && typeof module.exports === 'object') {
  module.exports = view;
}

if (typeof window !== 'undefined') {
  window.canvasView = window.canvasView || canvasView;
}