(function() {
  var Collection, Presentation, Slidescroller, Slideshow;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __indexOf = Array.prototype.indexOf || function(item) {
    for (var i = 0, l = this.length; i < l; i++) {
      if (this[i] === item) return i;
    }
    return -1;
  }, 
  __hasProp = Object.prototype.hasOwnProperty, 
  __extends = function(child, parent) {
    for (var key in parent) { 
      if (__hasProp.call(parent, key)) 
        child[key] = parent[key]; 
      }
    
      function ctor() { 
        this.constructor = child; 
      }
    
      ctor.prototype  = parent.prototype;
      child.prototype = new ctor;
      child.__super__ = parent.prototype;
      
      return child;
    };
    
  window.presentationInit = document.createEvent('UIEvents');
  window.slideshowLoad    = document.createEvent('UIEvents');
  window.slideshowUnload  = document.createEvent('UIEvents');
  window.collectionLoad   = document.createEvent('UIEvents');
  window.collectionUnload = document.createEvent('UIEvents');
  window.slideEnter       = document.createEvent('UIEvents');
  window.slideExit        = document.createEvent('UIEvents');
  window.sectionEnter     = document.createEvent('UIEvents');
  window.sectionExit      = document.createEvent('UIEvents');
  
  presentationInit.initEvent('presentationInit', false, false);
  slideshowLoad.initEvent('slideshowLoad', true, false);
  slideshowUnload.initEvent('slideshowUnload', true, false);
  collectionLoad.initEvent('collectionLoad', true, false);
  collectionUnload.initEvent('collectionUnload', true, false);
  slideEnter.initEvent('slideEnter', true, false);
  slideExit.initEvent('slideExit', true, false);
  sectionEnter.initEvent('sectionEnter', true, false);
  sectionExit.initEvent('sectionExit', true, false);
  
  window.Presentation = Presentation = (function() {
    function Presentation(config) {
      var collection, slideshow, _i, _j, _len, _len2, _ref, _ref2;
      window.app = this;
      this.type = config.type || 'dynamic';
      this.orientation = config.orientation || 'landscape';
      this.country = config.country || 'en';
      this.version = config.version || '0.1';
      this.slideshowIds = Object.keys(config.slideshows);
      this.slides = config.slideshows || {};
      this.collectionIds = Object.keys(config.collections);
      this.sections = config.collections || {};
      this.loaded = null;
      this.slideshows = {};
      this.collections = {};
      if (this.type === 'json') {
        this.getData();
      }
      this.getElements();
      this.getAllSlides();
      _ref = this.slideshowIds;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        slideshow = _ref[_i];
        this.register(slideshow, this.slides[slideshow]);
      }
      _ref2 = this.collectionIds;
      for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
        collection = _ref2[_j];
        this.register(collection, this.sections[collection], 'collection');
      }
      document.dispatchEvent(presentationInit);
    }
    Presentation.prototype.add = function(name, content, type) {
      type = type || 'slideshow';
      if (type === 'slideshow') {
        this.slideshowIds.push(name);
      } else {
        this.collectionIds.push(name);
      }
      return this.register(name, content, type);
    };
    Presentation.prototype.register = function(name, content, type) {
      type = type || 'slideshow';
      if (type === 'slideshow') {
        this.slideshows[name] = new Slideshow(name, content);
      } else {
        this.collections[name] = new Collection(name, content);
      }
    };
    Presentation.prototype.load = function(name, type) {
      var evt;
      evt = slideshowLoad;
      type = type || 'slideshow';
      if (this.loaded) {
        this.unLoad();
      }
      
      console.log(evt);
      
      if (type === 'slideshow') {
        this.slideshow = this.loaded = this.slideshows[name];
        this.collection = null;
        this.loaded.onLoad();
      } else {
        evt = collectionLoad;
        this.collection = this.loaded = this.collections[name];
        this.slideshow = null;
        this.loaded.onLoad();
        this.setCurrent(this.collection.content[0]);
        this.insertSections(this.collection.content, this.collection.ele);
      }
      this.elements.presentation.setAttribute('class', name);
      this.insert(this.loaded);
      this.getSlides();
      this.loaded.ele.dispatchEvent(evt);
      if (type === 'collection') {
        this.slideshow.ele.dispatchEvent(sectionEnter);
      }
      return this.slideshow.scrollTo(0);
    };
    Presentation.prototype.unLoad = function() {
      var evt, type;
      type = this.loaded.constructor.name;
      evt = type === 'Slideshow' ? slideshowUnload : collectionUnload;
      this.loaded.ele.dispatchEvent(evt);
      this.loaded.onUnload();
      return this.remove(this.loaded);
    };
    Presentation.prototype.insert = function(slideshow, container) {
      container = container || this.elements.slideshows;
      return container.appendChild(slideshow.ele);
    };
    Presentation.prototype.insertSections = function(sections, container) {
      var slideshow, ss, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = sections.length; _i < _len; _i++) {
        slideshow = sections[_i];
        ss = this.slideshows[slideshow];
        ss.direction = 'vertical';
        this.slideshows[slideshow].onLoad();
        _results.push(this.insert(this.slideshows[slideshow], this.loaded.ele));
      }
      return _results;
    };
    Presentation.prototype.remove = function(slideshow, container) {
      container = container || this.elements.slideshows;
      return container.removeChild(slideshow.ele);
    };
    Presentation.prototype.getData = function() {
      return console.log("Getting JSON data");
    };
    Presentation.prototype.getHtml = function(name, path, callback) {
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
        return callback(xhr.responseText);
      }, this);
      xhr.send();
      return console.log("Getting HTML string");
    };
    Presentation.prototype.getAllSlides = function() {
      var addEmptyFunctions, arr, name, slide, slideMethods, _ref, _results;
      this.allSlides = [];
      this.slide = {};
      slideMethods = ['onLoad', 'onUnload', 'onEnter', 'onExit'];
      addEmptyFunctions = function(slide) {
        var method, _i, _len, _results;
        app.slide[slide] = {};
        _results = [];
        for (_i = 0, _len = slideMethods.length; _i < _len; _i++) {
          method = slideMethods[_i];
          _results.push(app.slide[slide][method] = function() {});
        }
        return _results;
      };
      _ref = this.slides;
      _results = [];
      for (name in _ref) {
        arr = _ref[name];
        _results.push((function() {
          var _i, _len, _results2;
          _results2 = [];
          for (_i = 0, _len = arr.length; _i < _len; _i++) {
            slide = arr[_i];
            _results2.push(__indexOf.call(this.allSlides, slide) < 0 ? (this.allSlides.push(slide), addEmptyFunctions(slide)) : void 0);
          }
          return _results2;
        }).call(this));
      }
      return _results;
    };
    Presentation.prototype.getElements = function() {
      this.elements = this.elements || {};
      this.elements.presentation = document.getElementById('presentation');
      this.elements.slideshows = document.getElementById('slideshows');
      return this.elements.loader = document.getElementById('loader');
    };
    Presentation.prototype.getSlides = function() {
      var slide, slides, _i, _len, _results;
      this.slideElements = {};
      slides = this.loaded.ele.querySelectorAll('.slide');
      _results = [];
      for (_i = 0, _len = slides.length; _i < _len; _i++) {
        slide = slides[_i];
        _results.push(this.slideElements[slide.id] = slide);
      }
      return _results;
    };
    Presentation.prototype.goto = function(name, content, subcontent) {
      var type, _ref;
      type = __indexOf.call(this.slideshowIds, name) >= 0 ? 'slideshow' : 'collection';
      if (type === 'slideshow') {
        if (name !== this.slideshow.id) {
          this.load(name);
        }
        return this.slideshow.scrollTo(content);
      } else {
        if (name !== ((_ref = this.collection) != null ? _ref.id : void 0)) {
          this.load(name, 'collection');
        }
        if (content !== this.slideshow.id) {
          this.collection.scrollTo(content);
        }
        if (subcontent) {
          return this.slideshow.scrollTo(subcontent);
        }
      }
    };
    Presentation.prototype.setCurrent = function(name) {
      return this.slideshow = this.slideshows[name];
    };
    return Presentation;
  })();
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
      slide = app.slideElements[this.content[nr]];
      previous = app.slideElements[this.current];
      x = 0;
      y = 0;
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
