(function() {
  var Collection;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  window.Collection = Collection = (function() {
    __extends(Collection, Slideshow);
    function Collection() {
      Collection.__super__.constructor.apply(this, arguments);
    }
    Collection.prototype._resetSection = function() {
      var ss;
      ss = app.slideshow;
      return setTimeout(function() {
        ss.ele.style.cssText += '-webkit-transform:translate3d(0px, 0px, 0px);';
        return ss._setCurrent(0);
      }, 600);
    };
    Collection.prototype._scroll = function(nr) {
      var collection, currentSlide, nextSlide, previous, x, y;
      collection = app.slideshows[this.content[nr]];
      previous = app.slideshows[this.current];
      nextSlide = app.slideElements[collection.content[0]];
      currentSlide = app.slideElements[previous.content[0]];
      x = 0;
      y = 0;
      if (this.direction === 'horizontal') {
        x = nr * -this.slideWidth;
      } else {
        y = nr * -this.slideHeight;
      }
      previous.ele.dispatchEvent(sectionExit);
      currentSlide.dispatchEvent(slideExit);
      
      console.log(app);
      console.log(app.slideElements);
      console.log("First slide in collection: " + collection.content[0]);
      console.log("Current slide: " + currentSlide + " | Next slide: " + nextSlide + " | Previous slideshow: " + previous);
      
      app.slide[currentSlide.id].onExit(currentSlide);
      this.ele.style.cssText += '-webkit-transform:translate3d(' + x + 'px, ' + y + 'px, 0px);';
      this._resetSection();
      this._setCurrent(nr);
      app.setCurrent(this.current);
      collection.ele.dispatchEvent(sectionEnter);
      nextSlide.dispatchEvent(slideEnter);
      return app.slide[nextSlide.id].onEnter(nextSlide);
    };
    Collection.prototype.onLoad = function() {
      this._setMeasurements();
      this._createElement();
      this.ele.style.cssText = "width:" + this.width + "px;-webkit-transform:translate3d(0px, 0px, 0px);";
      return this.ele.setAttribute('class', 'collection');
    };
    Collection.prototype.onUnload = function() {
      var collection, currentSlide, section, _i, _len, _ref, _results;
      collection = app.slideshows[this.current];
      currentSlide = app.slideElements[collection.content[0]];
      currentSlide.dispatchEvent(slideExit);
      app.slide[currentSlide.id].onExit(currentSlide);
      collection.ele.dispatchEvent(sectionExit);
      this._reset();
      _ref = this.content;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        section = _ref[_i];
        _results.push(app.slideshows[section]._reset());
      }
      return _results;
    };
    return Collection;
  })();
}).call(this);
