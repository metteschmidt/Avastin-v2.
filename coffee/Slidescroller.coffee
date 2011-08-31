window.Slidescroller = class Slidescroller
  constructor: (@id) ->
    @ele = document
    @type = 'slideshow'
    @actions = 
      left: @_next
      right: @_previous
      up: @_up
      down: @_down

    @_connect()

  _connect: ->
    @ele.addEventListener 'slideshowLoad', =>  @type = 'slideshow'
    @ele.addEventListener 'collectionLoad', => @type = 'collection'
    @enableAll()
    return

  _next: (event) =>
    if @type is 'slideshow'
      @_nextSlide event
    else
      @_nextSection event
    return

  _previous: (event) =>
    if @type is 'slideshow'
      @_previousSlide event
    else
      @_previousSection event
    return
      
  _up: (event) =>
    if @type is 'collection'
      @_nextSlide event
    return

  _down: (event) =>
    if @type is 'collection'
      @_previousSlide event
    return


  _addSwipeListener: (eventName) ->
    @ele.addEventListener eventName, @events[eventName]
    return

  _nextSection: (e) ->
    e.preventDefault()
    app.collection.next()
    return

  _nextSlide: (e) ->
    e.preventDefault()
    app.slideshow.next()
    return

  _previousSection: (e) ->
    e.preventDefault()
    app.collection.previous()
    return

  _previousSlide: (e) ->
    e.preventDefault()
    app.slideshow.previous()
    return

  disable: (dir) ->
    @ele.removeEventListener 'swipe' + dir, @actions[dir]
    return

  disableAll: ->
    @ele.removeEventListener 'swipeleft', @_next
    @ele.removeEventListener 'swiperight', @_previous
    @ele.removeEventListener 'swipeup', @_up
    @ele.removeEventListener 'swipedown', @_down
    return

  enable: (dir) ->
    @ele.addEventListener 'swipe' + dir, @actions[dir]
    return

  enableAll: ->
    @ele.addEventListener 'swipeleft', @_next
    @ele.addEventListener 'swiperight', @_previous
    @ele.addEventListener 'swipeup', @_up
    @ele.addEventListener 'swipedown', @_down
    return
