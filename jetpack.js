$(function(){
  "use strict";

  var key_state = {};

  var key_accel = 87;
  var key_break = 83;
  var key_left  = 65;
  var key_right = 68;
  var key_up    = 38;
  var key_dn    = 40;
  var key_lt    = 37;
  var key_rt    = 39;

  var controls = {
    key_accel: true,
    key_break: true,
    key_left:  true,
    key_right: true,
    key_up:    true,
    key_dn:    true,
    key_lt:    true,
    key_rt:    true,
  };

  $(document).keyup(function(e) {
    key_state[e.which] = false;

    // Prevent default behaviour for keys that
    // we care about
    controls[e.which] && e.preventDefault();
  });

  $(document).keydown(function(e) {
    key_state[e.which] = true;
    // Prevent default behaviour for keys that
    // we care about
    controls[e.which] && e.preventDefault();
  });

  var clamp = function(v, min, max) {
    return Math.min(max, Math.max(v, min));
  }

  var car_sprite = new Image();
  car_sprite.src = 'car.png';

  var Track = function(width, height) {
    this.width  = width;
    this.height = height;
  };

  var Car = function(){
    this.x = 0;
    this.y = 0;
    this.v = 0;
    this.d = 0;
    this.steer = 0.05;
    this.max_v = 7;
    this.brk = 0.05;
    this.accel = 0.05;
  };

  Car.prototype.update = function(dt) {

    if (key_state[key_accel] || key_state[key_up]){
      this.v += this.accel;
    }

    if (key_state[key_break] || key_state[key_dn]){
      this.v -= this.brk;
    }

    if (key_state[key_left] || key_state[key_lt]){
      this.d -= this.steer;
    }

    if (key_state[key_right] || key_state[key_rt]){
      this.d += this.steer;
    }

    this.v = clamp(this.v, 0, this.max_v);
    this.x = clamp(this.x, 32, track.width  - 32);
    this.y = clamp(this.y, 32, track.height - 32);
    this.d = this.d % (2 * Math.PI);

    var velocity = this.v * dt;
    this.x = this.x + (this.v * Math.cos(this.d));
    this.y = this.y + (this.v * Math.sin(this.d));

  };

  Car.prototype.draw = function(canvas, context) {
    context.save();
    
    
    context.translate(this.x, this.y);
    context.rotate(this.d);
    context.drawImage(car_sprite, -(car_sprite.width/2), -(car_sprite.height/2));
    context.restore();
  };

  var track, cars;

  var update = function(dt){
    _.each(cars, function(car) {
      car.update(dt);
    });
  };

  var draw = function(canvas, context) {
    canvas.width = canvas.width;
    // Set the style properties.
    context.fillStyle   = '#00f';
    context.strokeStyle = '#f00';
    context.lineWidth   = 4;

    _.each(cars, function(car){
      car.draw(canvas, context);
    });
  };

  var canvas  = $('#canvas')[0];
  var context = canvas.getContext('2d');
  var last_render = new Date().getTime();

  $(canvas).click(function() {
    //screenfull.enabled && screenfull.request(this);
  });

  track = new Track(canvas.width, canvas.height)
  cars = [new Car()];

  var tick = function(timestamp) {
    var dt = timestamp - last_render;
    last_render = timestamp;
    update(dt);
    draw(canvas, context);
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
});
