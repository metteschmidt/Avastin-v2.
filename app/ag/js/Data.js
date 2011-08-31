(function() {
  var Data;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  window.Data = Data = (function() {
    function Data(monitoringEnabled) {
      this.monitoringEnabled = monitoringEnabled != null ? monitoringEnabled : true;
      window.monitoringEnabled = this.monitoringEnabled;
      this.save('Country', app.country);
      this.save('Version', app.version);
      if (this.monitoringEnabled) {
        this._logSlides();
      }
    }
    Data.prototype._logSlides = function() {
      return document.addEventListener('slideEnter', __bind(function() {
        return this._submitSlide(app.slideshow.current, app.slideshow.id);
      }, this));
    };
    Data.prototype._submit = function(obj) {};
    Data.prototype._submitData = function(category, label, value) {};
    Data.prototype._submitSlide = function(slideName, parent) {
      window.submitSlideEnter(slideName, slideName, 1, parent);
      sessionStorage.setItem(slideName, parent);
    };
    Data.prototype.clear = function() {
      sessionStorage.clear();
    };
    Data.prototype.get = function(label, category) {
      var value;
      if (category == null) {
        category = 'Presentation';
      }
      value = sessionStorage.getItem("" + category + ": " + label);
      return value;
    };
    Data.prototype.remove = function(label, category) {
      if (category == null) {
        category = 'Presentation';
      }
      sessionStorage.removeItem("" + category + ": " + label);
    };
    Data.prototype.save = function(label, value, category) {
      if (category == null) {
        category = 'Presentation';
      }
      sessionStorage.setItem("" + category + ": " + label, value);
    };
    return Data;
  })();
}).call(this);
