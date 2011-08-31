
window.debug =
  logEvents: ->
    document.addEventListener 'presentationInit', ->
      console.log "**** Presentation initialized"
      console.log "Registered slideshows:  #{app.slideshowIds}"
      console.log "Registered collections: #{app.collectionIds}"
    document.addEventListener 'slideshowLoad', -> console.log "**** Slideshow loaded: #{app.slideshow.id}"
    document.addEventListener 'slideshowUnload', -> console.log "**** Slideshow unloaded: #{app.slideshow.id}"
    document.addEventListener 'collectionLoad', -> console.log "**** Collection loaded: #{app.collection.id}"
    document.addEventListener 'collectionUnload', -> console.log "**** Collection unloaded: #{app.collection.id}"
    document.addEventListener 'slideEnter', -> console.log "---> Slide entered: #{app.slideshow.current}"
    document.addEventListener 'slideExit', -> console.log "<--- Slide exited: #{app.slideshow.current}"
    document.addEventListener 'sectionEnter', -> console.log ">>>> Section entered: #{app.slideshow.id}"
    document.addEventListener 'sectionExit', -> console.log "<<<< Section exited: #{app.slideshow.id}"
