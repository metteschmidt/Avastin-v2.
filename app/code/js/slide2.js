(function() {
  app.slide.IN_start = {
    onLoad: function(id) {
      console.log("Loading slide1");
    },
    onUnload: function() {
      console.log("Unloading slide1");
    },
    onEnter: function(ele) {
      console.log('Entering slide1.html');
    },
    onExit: function() {
      console.log('Exiting slide1.html');
    }
  };
  app.slide.IN_intro = {
    onLoad: function(id) {
      console.log("Loading slide2");
    },
    onUnload: function() {
      console.log("Unloading slide2");
    },
    onEnter: function(ele) {
      console.log('Entering slide2.html');
    },
    onExit: function() {
      console.log('Exiting slide2.html');
    }
  };
  app.slide.fast_track = {
    onLoad: function(id) {
      console.log("Loading slide3");
    },
    onUnload: function() {
      console.log("Unloading slide3");
    },
    onEnter: function(ele) {
      console.log('Entering slide3.html');
    },
    onExit: function() {
      console.log('Exiting slide3.html');
    }
  };
// */
})();
  
