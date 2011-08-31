
window.Collection = class Collection extends Slideshow
  _resetSection: ->
    ss = app.slideshow
    setTimeout ->
      ss.ele.style.cssText += '-webkit-transform:translate3d(0px, 0px, 0px);'
      ss._setCurrent 0
      # ss.scrollToStart()
    , 600

  _scroll: (nr) ->
    collection = app.slideshows[@content[nr]]
    previous = app.slideshows[@current]
    nextSlide = app.slideElements[collection.content[0]]
    currentSlide = app.slideElements[previous.content[0]]
    x = 0
    y = 0

    if @direction is 'horizontal' then x = nr * -@slideWidth else y = nr * -@slideHeight
    previous.ele.dispatchEvent sectionExit
    currentSlide.dispatchEvent slideExit
    app.slide[currentSlide.id].onExit currentSlide
    @ele.style.cssText += '-webkit-transform:translate3d(' + x + 'px, ' + y + 'px, 0px);'
    @_resetSection()
    @_setCurrent nr
    app.setCurrent @current
    collection.ele.dispatchEvent sectionEnter
    nextSlide.dispatchEvent slideEnter
    app.slide[nextSlide.id].onEnter nextSlide

  onLoad: ->
    @_setMeasurements()
    @_createElement()
    @ele.style.cssText = "width:#{@width}px;-webkit-transform:translate3d(0px, 0px, 0px);"
    @ele.setAttribute 'class', 'collection'

  onUnload: ->
    collection = app.slideshows[@current]
    currentSlide = app.slideElements[collection.content[0]]
    currentSlide.dispatchEvent slideExit
    app.slide[currentSlide.id].onExit currentSlide
    collection.ele.dispatchEvent sectionExit
    # super
    @_reset()
    for section in @content
      app.slideshows[section]._reset()
