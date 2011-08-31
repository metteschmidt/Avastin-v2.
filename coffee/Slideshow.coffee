
window.Slideshow = class Slideshow
  constructor: (@id, @content) ->
    @direction = 'horizontal'
    @current = @content[0]
    @currentIndex = 0
    @length = @content.length
    @elements = {}
    @markup = ''

  _createElement: ->
    section = document.createElement 'section'
    section.setAttribute 'id', @id
    section.setAttribute 'class', 'slideshow' 
    @ele = section
    return

  _destroyElement: ->
    @ele = null
    return

  _isValid: (name) ->
    name in @content

  _reset: ->
    @direction = 'horizontal'
    @current = @content[0]
    @currentIndex = 0
    @length = @content.length
    @elements = {}
    @markup = ''
    return

  _scroll: (nr) ->
    slide = app.slideElements[@content[nr]]
    previous = app.slideElements[@current]
    x = 0
    y = 0
          
    if @direction is 'horizontal' then x = nr * -@slideWidth else y = nr * -@slideHeight
    if slide isnt previous
      previous.dispatchEvent slideExit
      app.slide[@current].onExit previous
    @ele.style.cssText += '-webkit-transform:translate3d(' + x + 'px, ' + y + 'px, 0px);'
    @_setCurrent nr
    slide.dispatchEvent slideEnter
    app.slide[@current].onEnter slide
    return

  _setCurrent: (content) ->
    type = typeof content
    if type is 'string'
      @current = content
      @currentIndex = @getIndex content
    else if 'number'
      @current = @content[content]
      @currentIndex = content
    return

  _setMeasurements: ->
    @width = 1024
    @slideWidth = 1024
    @slideHeight = 768
    if app.orientation is 'portrait'
      @slideWidth = 768
      @slideHeight = 1024
    if @direction is 'horizontal'
      @width = @slideWidth * @length
    else
      @width = @slideWidth
    return

  get: (name) ->
    if name and @_isValid name then @elements[name] else @elements[@current]

  getIndex: (name) ->
    if name and @_isValid name
      @content.indexOf name
    else
      @content.indexOf @current

  getSlide: (name, path = 'content/slides/') ->
    path = path + name + '.html'
    xhr = new XMLHttpRequest()
    xhr.open 'GET', path, false
    xhr.onreadystatechange = =>
      return if xhr.readyState isnt 4
      if xhr.status isnt 0 and xhr.status isnt 200
        if xhr.status is 400 
          console.log "Could not locate #{path}" 
        else
          console.error "Slideshow.getSlide #{path} HTTP error: #{xhr.status}"
        return
      @markup += xhr.responseText
    xhr.send()

  onLoad: ->
    @_setMeasurements()
    @_createElement()
    for slide in @content
      @getSlide slide
    @ele.style.cssText = "width:#{@width}px;-webkit-transform:translate3d(0px, 0px, 0px);"
    @ele.innerHTML = @markup

  onUnload: ->
    previous = app.slideElements[@current]
    previous.dispatchEvent slideExit
    app.slide[@current].onExit previous
    # @_destroyElement()
    @_reset()
    return

  next: ->
    if @currentIndex < @length - 1 then @_scroll @currentIndex + 1
    return

  previous: ->
    if @currentIndex > 0 then @_scroll @currentIndex - 1
    return

  scrollTo: (content) ->
    type = typeof content
    if type is 'string'
      @_scroll(@getIndex content)
    else if 'number'
      @_scroll Math.abs content
    return

   scrollToEnd: ->
     @_scroll @length - 1
     return

   scrollToStart: ->
     @_scroll 0
     return
