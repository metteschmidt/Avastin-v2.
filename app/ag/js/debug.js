(function() {
  window.debug = {
    logEvents: function() {
      document.addEventListener('presentationInit', function() {
        console.log("**** Presentation initialized");
        console.log("Registered slideshows:  " + app.slideshowIds);
        return console.log("Registered collections: " + app.collectionIds);
      });
      document.addEventListener('slideshowLoad', function() {
        return console.log("**** Slideshow loaded: " + app.slideshow.id);
      });
      document.addEventListener('slideshowUnload', function() {
        return console.log("**** Slideshow unloaded: " + app.slideshow.id);
      });
      document.addEventListener('collectionLoad', function() {
        return console.log("**** Collection loaded: " + app.collection.id);
      });
      document.addEventListener('collectionUnload', function() {
        return console.log("**** Collection unloaded: " + app.collection.id);
      });
      document.addEventListener('slideEnter', function() {
        return console.log("---> Slide entered: " + app.slideshow.current);
      });
      document.addEventListener('slideExit', function() {
        return console.log("<--- Slide exited: " + app.slideshow.current);
      });
      document.addEventListener('sectionEnter', function() {
        return console.log(">>>> Section entered: " + app.slideshow.id);
      });
      return document.addEventListener('sectionExit', function() {
        return console.log("<<<< Section exited: " + app.slideshow.id);
      });
    }
  };
}).call(this);
