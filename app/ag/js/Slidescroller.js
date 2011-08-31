(function() {
  var Slidescroller;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  window.Slidescroller = Slidescroller = (function() {
    function Slidescroller(id) {
      this.id = id;
      this._down = __bind(this._down, this);
      this._up = __bind(this._up, this);
      this._previous = __bind(this._previous, this);
      this._next = __bind(this._next, this);
      this.ele = document;
      this.type = 'slideshow';
      this.actions = {
        left: this._next,
        right: this._previous,
        up: this._up,
        down: this._down
      };
      this._connect();
    }
    Slidescroller.prototype._connect = function() {
      this.ele.addEventListener('slideshowLoad', __bind(function() {
        return this.type = 'slideshow';
      }, this));
      this.ele.addEventListener('collectionLoad', __bind(function() {
        return this.type = 'collection';
      }, this));
      this.enableAll();
    };
    Slidescroller.prototype._next = function(event) {
      if (this.type === 'slideshow') {
        this._nextSlide(event);
      } else {
        this._nextSection(event);
      }
    };
    Slidescroller.prototype._previous = function(event) {
      if (this.type === 'slideshow') {
        this._previousSlide(event);
      } else {
        this._previousSection(event);
      }
    };
    Slidescroller.prototype._up = function(event) {
      if (this.type === 'collection') {
        this._nextSlide(event);
      }
    };
    Slidescroller.prototype._down = function(event) {
      if (this.type === 'collection') {
        this._previousSlide(event);
      }
    };
    Slidescroller.prototype._addSwipeListener = function(eventName) {
      this.ele.addEventListener(eventName, this.events[eventName]);
    };
    Slidescroller.prototype._nextSection = function(e) {
      e.preventDefault();
      app.collection.next();
    };
    Slidescroller.prototype._nextSlide = function(e) {
      e.preventDefault();
      app.slideshow.next();
    };
    Slidescroller.prototype._previousSection = function(e) {
      e.preventDefault();
      app.collection.previous();
    };
    Slidescroller.prototype._previousSlide = function(e) {
      e.preventDefault();
      app.slideshow.previous();
    };
    Slidescroller.prototype.disable = function(dir) {
      this.ele.removeEventListener('swipe' + dir, this.actions[dir]);
    };
    Slidescroller.prototype.disableAll = function() {
      this.ele.removeEventListener('swipeleft', this._next);
      this.ele.removeEventListener('swiperight', this._previous);
      this.ele.removeEventListener('swipeup', this._up);
      this.ele.removeEventListener('swipedown', this._down);
    };
    Slidescroller.prototype.enable = function(dir) {
      this.ele.addEventListener('swipe' + dir, this.actions[dir]);
    };
    Slidescroller.prototype.enableAll = function() {
      this.ele.addEventListener('swipeleft', this._next);
      this.ele.addEventListener('swiperight', this._previous);
      this.ele.addEventListener('swipeup', this._up);
      this.ele.addEventListener('swipedown', this._down);
    };
    return Slidescroller;
  })();
}).call(this);
