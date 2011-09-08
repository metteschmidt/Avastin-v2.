(function() {
  var Presentation;
  var __bind    = function(fn, me) { 
                    return function() { 
                      return fn.apply(me, arguments); 
                    }; 
                  },
      __indexOf = Array.prototype.indexOf || 
                  function(item) {
                    for (var i = 0, l = this.length; i < l; i++) {
                      if (this[i] === item) return i;
                    }
                                                        
                    return -1;
                  };


  window.Presentation = Presentation = (function() {
    function Presentation(config) {
      var collection, slideshow, _i, _j, _len, _len2, _ref, _ref2;
      
      window.app         = this;
      this.type          = config.type        || 'dynamic';
      this.orientation   = config.orientation || 'landscape';
      this.country       = config.country     || 'en';
      this.version       = config.version     || '0.1';
      this.slides        = config.slideshows  || {};
      this.sections      = config.collections || {};
      this.slideshowIds  = Object.keys(this.slides);
      this.collectionIds = Object.keys(this.sections);
      this.loaded        = null;
      this.slideshows    = {};
      this.collections   = {};
      
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
          evt  = slideshowLoad;
          type = type || 'slideshow';
         
      if (this.loaded) {
        this.unLoad();
      }
      
      if (type === 'slideshow') {
        console.log(name);
        this.slideshow  = this.loaded = this.slideshows[name];
        this.collection = null;
        this.loaded.onLoad();
      } else {
        evt             = collectionLoad;
        this.collection = this.loaded = this.collections[name];
        this.slideshow  = null;
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
}).call(this);
