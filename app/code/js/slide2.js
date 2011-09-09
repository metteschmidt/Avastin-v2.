(function() {
  app.slide['IN-intro'] = {
    onLoad: function(id) {
      console.log("Loading splash");
    },
    onUnload: function() {
      console.log("Unloading splash");
    },
    onEnter: function(ele) {
      console.log('Entering splash');
    },
    onExit: function() {
      console.log('Exiting splash');
    }
  };
  app.slide['IN-start'] = {
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
  app.slide['EF-firstline'] = {
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
  app.slide['EF-duration'] = {
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
  };/*
  app.slide.['fast-track'] = {
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
  
