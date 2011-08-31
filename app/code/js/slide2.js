(function() {
  app.slide.slide1 = {
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
  app.slide.slide2 = {
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
  app.slide.slide3 = {
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
})();
  
