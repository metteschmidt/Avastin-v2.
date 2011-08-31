window.Data = class Data
  constructor: (@monitoringEnabled = true) ->
    window.monitoringEnabled = @monitoringEnabled
    @save 'Country', app.country
    @save 'Version', app.version
    @_logSlides() if @monitoringEnabled

  _logSlides: ->
    document.addEventListener 'slideEnter', =>
      @_submitSlide app.slideshow.current, app.slideshow.id

  _submit: (obj) ->
    # Submit the monitor object to the iPlanner

  _submitData: (category, label, value) ->
    # Create monitor object and send with _submit

  _submitSlide: (slideName, parent) ->
    # Create monitor object and send with _submit
    window.submitSlideEnter slideName, slideName, 1, parent
    sessionStorage.setItem slideName, parent
    return

  clear: ->
    sessionStorage.clear()
    return

  get: (label, category = 'Presentation') ->
    value = sessionStorage.getItem "#{category}: #{label}"
    return value

  remove: (label, category = 'Presentation') ->
    sessionStorage.removeItem "#{category}: #{label}"
    return

  save: (label, value, category = 'Presentation') ->
    # Save to sessionStorage, and _submitData
    sessionStorage.setItem "#{category}: #{label}", value
    return
