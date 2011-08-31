/**
* AMP MODULE - Basic Thumbs
 * This is a very basic slide thumb menu that automatically
 * links to all your slides.
 * If using images, place them in content/img/thumbs
 * @author - Stefan Liden, stefan.liden@gmail.com
 */

(function() {

  window.BasicThumbs = function(id, slideshow, hasImages) {
    this.id = id;
    this.ele = document.getElementById(id);
    this.slideshow = window[slideshow];
    this.hasImages = hasImages || false;
    this.ssName = slideshow;
    this.initialized = false;
    this._init();
  };

  BasicThumbs.prototype = {
    _init: function() {
      var self = this;
      document.addEventListener('slideshowLoad', function() {
        if (app.slideshow.id === self.ssName) {
          if (self.initialized) {
            self._insert();
          }
          else {
            self.slideshow = app.slideshows[self.ssName];
            self._build();
            self._insert();
            self._connect();
            self.initialized = true;
          }
        }
      });

      document.addEventListener('slideshowUnload', function() {
        if (app.slideshow.id === self.ssName) {
          console.log('Unloading slideshow: ' + app.slideshow.id);
          self._remove();
          self.initialized = false;
        }
      }, false);
      // Listening to 'slideEnter' to set selected item
      // 'slideEnter is dispatched from slideshow._scroll
      document.addEventListener('slideEnter', function() {
        if (app.slideshow.id === self.ssName) {
          setTimeout(function() {
            self._setCurrent();
          },0);
        }
      }, false);
    },
    
    // Create the markup to be inserted for the thumbs
    _build: function() {
      var self = this,
          markup = '<ul class="basicthumbs">';
      this.slideshow.content.forEach(function(slide) {
        var name, thumb;
        if (self.hasImages) {
          thumb = '<img src="content/img/thumbs/'+slide+'.jpg" data-slide="' + slide + '" alt="'+slide+'" />'
        }
        else {
          thumb = '<div class="thumbindicator" data-slide="' + slide + '"></div>';
        }
        markup += '<li>'+thumb+'</li>';
      });
      markup += '</ul>';
      this.markup = markup;
    },
    
    _insert: function() {
      this.ele.innerHTML = this.markup;
    },

    _remove: function() {
      this.ele.innerHTML = '';
    },    

    // Connect the thumbs to the slideshow.scrollTo method
    _connect: function() {
      var self = this;
      this.ele.addEventListener('tap', function(event) {
        var ele = event.target;
        var slide = ele.getAttribute('data-slide');
        app.slideshow.scrollTo(slide);
      }, false);
      console.info('+ BasicThumbs connected');
    },

    // Called on 'slideEnter'
    _setCurrent: function() {
      var prev = this.ele.querySelector('.selected'),
          slide = this.slideshow.getIndex() + 1,
          link = this.ele.querySelector('li:nth-child('+slide+')');
      if (prev) { prev.setAttribute('class', ''); }
      link.setAttribute('class', 'selected');
    },

    _createTitle: function(slide) {
      // TODO: replace _-. with a space
      return slide[0].toUpperCase() + slide.slice(1);
    }
  };

})();
