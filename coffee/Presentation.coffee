
window.Presentation = class Presentation
  constructor: (config) ->
    window.app = this
    @type = config.type || 'dynamic'
    @orientation = config.orientation || 'landscape'
    @country = config.country || 'en'
    @version = config.version || '0.1'
    @slides = config.slideshows || {}
    @sections = config.collections || {}
    @slideshowIds = Object.keys @slides #config.slideshows
    @collectionIds = Object.keys @sections #config.collections || {}
    @loaded = null
    @slideshows = {}
    @collections = {}

    @getData() if @type is 'json'
    @getElements()
    @getAllSlides()

    for slideshow in @slideshowIds
      @register slideshow, @slides[slideshow]

    for collection in @collectionIds
      @register collection, @sections[collection], 'collection'

    document.dispatchEvent presentationInit

  add: (name, content, type) ->
    type  = type || 'slideshow'
    if type is 'slideshow'
      @slideshowIds.push name
    else
      @collectionIds.push name
    @register name, content, type
    

  register: (name, content, type) ->
    type  = type || 'slideshow'
    if type is 'slideshow'
      @slideshows[name] = new Slideshow name, content
    else
      @collections[name] = new Collection name, content
    return

  load: (name, type) ->
    evt = slideshowLoad
    type  = type || 'slideshow'
    if @loaded
      @unLoad() 
    if type is 'slideshow'
      @slideshow = @loaded = @slideshows[name]
      @collection = null
      @loaded.onLoad()
    else
      evt = collectionLoad
      @collection = @loaded = @collections[name]
      @slideshow = null
      @loaded.onLoad()
      @setCurrent @collection.content[0]
      @insertSections @collection.content, @collection.ele
    @elements.presentation.setAttribute 'class', name
    @insert @loaded
    @getSlides()
    @loaded.ele.dispatchEvent evt
    @slideshow.ele.dispatchEvent sectionEnter if type is 'collection'
    @slideshow.scrollTo 0

  unLoad: () ->
    type = @loaded.constructor.name
    evt = if type is 'Slideshow' then slideshowUnload else collectionUnload
    @loaded.ele.dispatchEvent evt
    @loaded.onUnload()
    @remove @loaded

  insert: (slideshow, container) ->
    container = container || @elements.slideshows
    container.appendChild slideshow.ele

  insertSections: (sections, container) ->
    for slideshow in sections
      ss = @slideshows[slideshow]
      ss.direction = 'vertical'
      @slideshows[slideshow].onLoad()
      @insert @slideshows[slideshow], @loaded.ele

  remove: (slideshow, container) ->
    container = container || @elements.slideshows
    container.removeChild slideshow.ele

  getData: ->
    console.log "Getting JSON data"

  getHtml: (name, path = 'content/slides/', callback) ->
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
      callback xhr.responseText
    xhr.send()
    console.log "Getting HTML string"

  getAllSlides: ->
    @allSlides = []
    @slide = {}
    slideMethods = ['onLoad', 'onUnload', 'onEnter', 'onExit']
    addEmptyFunctions = (slide) ->
      app.slide[slide] = {}
      for method in slideMethods
        app.slide[slide][method] = ->
    for name, arr of @slides
      for slide in arr
        if slide not in @allSlides
          @allSlides.push slide
          addEmptyFunctions slide

  getElements: ->
    @elements = @elements || {}
    @elements.presentation = document.getElementById 'presentation'
    @elements.slideshows = document.getElementById 'slideshows'
    @elements.loader = document.getElementById 'loader'

  getSlides: ->
    @slideElements = {}
    slides = @loaded.ele.querySelectorAll '.slide'
    for slide in slides
      @slideElements[slide.id] = slide
      # app.slide[slide.id].onLoad slide

  goto: (name, content, subcontent) ->
    type = if name in @slideshowIds then 'slideshow' else 'collection'
    if type is 'slideshow'
      if name isnt @slideshow.id then @load name
      @slideshow.scrollTo content
    else
      if name isnt @collection?.id then @load name, 'collection'
      if content isnt @slideshow.id then @collection.scrollTo content
      @slideshow.scrollTo subcontent if subcontent

  setCurrent: (name) ->
    @slideshow = @slideshows[name]
