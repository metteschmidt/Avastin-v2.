(function() {
  var Slideshow;
  var __indexOf = Array.prototype.indexOf || function(item) {
    for (var i = 0, l = this.length; i < l; i++) {
      if (this[i] === item) return i;
    }
    return -1;
  }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  window.Slideshow = Slideshow = (function() {
    function Slideshow(id, content) {
      this.id = id;
      this.content = content;
      this.direction = 'horizontal';
      this.current = this.content[0];
      this.currentIndex = 0;
      this.length = this.content.length;
      this.elements = {};
      this.markup = '';
    }
    Slideshow.prototype._createElement = function() {
      var section;
      section = document.createElement('section');
      section.setAttribute('id', this.id);
      section.setAttribute('class', 'slideshow');
      this.ele = section;
    };
    Slideshow.prototype._destroyElement = function() {
      this.ele = null;
    };
    Slideshow.prototype._isValid = function(name) {
      return __indexOf.call(this.content, name) >= 0;
    };
    Slideshow.prototype._reset = function() {
      this.direction = 'horizontal';
      this.current = this.content[0];
      this.currentIndex = 0;
      this.length = this.content.length;
      this.elements = {};
      this.markup = '';
    };
    Slideshow.prototype._scroll = function(nr) {
      var previous, slide, x, y;
      slide    = app.slideElements[this.content[nr]];
      previous = app.slideElements[this.current];
      x        = 0;
      y        = 0;
      
      if (this.direction === 'horizontal') {
        x = nr * -this.slideWidth;
      } else {
        y = nr * -this.slideHeight;
      }
      if (slide !== previous) {
        previous.dispatchEvent(slideExit);
        app.slide[this.current].onExit(previous);
      }
      this.ele.style.cssText += '-webkit-transform:translate3d(' + x + 'px, ' + y + 'px, 0px);';
      this._setCurrent(nr);

      //console.log(this.content[0]); // IN_start
      console.log(app.slideElements[0]); // IN_start
      
      slide.dispatchEvent(slideEnter);
      
      app.slide[this.current].onEnter(slide);
    };
    Slideshow.prototype._setCurrent = function(content) {
      var type;
      type = typeof content;
      if (type === 'string') {
        this.current = content;
        this.currentIndex = this.getIndex(content);
      } else if ('number') {
        this.current = this.content[content];
        this.currentIndex = content;
      }
    };
    Slideshow.prototype._setMeasurements = function() {
      this.width = 1024;
      this.slideWidth = 1024;
      this.slideHeight = 768;
      if (app.orientation === 'portrait') {
        this.slideWidth = 768;
        this.slideHeight = 1024;
      }
      if (this.direction === 'horizontal') {
        this.width = this.slideWidth * this.length;
      } else {
        this.width = this.slideWidth;
      }
    };
    Slideshow.prototype.get = function(name) {
      if (name && this._isValid(name)) {
        return this.elements[name];
      } else {
        return this.elements[this.current];
      }
    };
    Slideshow.prototype.getIndex = function(name) {
      if (name && this._isValid(name)) {
        return this.content.indexOf(name);
      } else {
        return this.content.indexOf(this.current);
      }
    };
    Slideshow.prototype.getSlide = function(name, path) {
      var xhr;
      if (path == null) {
        path = 'content/slides/';
      }
      path = path + name + '.html';
      xhr = new XMLHttpRequest();
      xhr.open('GET', path, false);
      xhr.onreadystatechange = __bind(function() {
        if (xhr.readyState !== 4) {
          return;
        }
        if (xhr.status !== 0 && xhr.status !== 200) {
          if (xhr.status === 400) {
            console.log("Could not locate " + path);
          } else {
            console.error("Slideshow.getSlide " + path + " HTTP error: " + xhr.status);
          }
          return;
        }
        return this.markup += xhr.responseText;
      }, this);
      return xhr.send();
    };
    Slideshow.prototype.onLoad = function() {
      var slide, _i, _len, _ref;
      this._setMeasurements();
      this._createElement();
      _ref = this.content;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        slide = _ref[_i];
        this.getSlide(slide);
      }
      this.ele.style.cssText = "width:" + this.width + "px;-webkit-transform:translate3d(0px, 0px, 0px);";
      return this.ele.innerHTML = this.markup;
    };
    Slideshow.prototype.onUnload = function() {
      var previous;
      previous = app.slideElements[this.current];
      previous.dispatchEvent(slideExit);
      app.slide[this.current].onExit(previous);
      this._reset();
    };
    Slideshow.prototype.next = function() {
      if (this.currentIndex < this.length - 1) {
        this._scroll(this.currentIndex + 1);
      }
    };
    Slideshow.prototype.previous = function() {
      if (this.currentIndex > 0) {
        this._scroll(this.currentIndex - 1);
      }
    };
    Slideshow.prototype.scrollTo = function(content) {
      var type;
      type = typeof content;
      if (type === 'string') {
        this._scroll(this.getIndex(content));
      } else if ('number') {
        this._scroll(Math.abs(content));
      }
    };
    Slideshow.prototype.scrollToEnd = function() {
      this._scroll(this.length - 1);
    };
    Slideshow.prototype.scrollToStart = function() {
      this._scroll(0);
    };
    return Slideshow;
  })();
}).call(this);
