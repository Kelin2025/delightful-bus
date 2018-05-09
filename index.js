export const send = events => to => {
  Object.keys(events).forEach(evt => {
    events[evt].forEach(cb => to.on(evt, cb))
  })
  return to
}

export default function Eventbus(eventsList) {
  eventsList = (eventsList && Object.assign({}, eventsList)) || {}

  this.events = eventsList

  /**
   * Adds event listener
   * @param {String} evt Event name
   * @param {function} cb Callback
   * @returns Emitter instance or instance with binded emitter
   */
  this.on = function(evt, cb) {
    if (evt in eventsList) {
      eventsList[evt] = eventsList[evt].concat(cb)
    } else {
      eventsList[evt] = [cb]
    }
    return this
  }

  /**
   * Adds event listener that will be removed after emit
   * @param {String} evt Event name
   * @param {function} cb Callback
   * @returns Emitter instance or instance with binded emitter
   */
  this.once = function(evt, cb) {
    const self = this

    const selfDesctructable = function() {
      cb.apply(cb, arguments)
      self.off(evt, selfDesctructable)
    }

    return this.on(evt, selfDesctructable)
  }

  /**
   * Unbind event listener
   * @param {String} evt Event name
   * @param {function} cb Callback
   * @returns Emitter instance or instance with binded emitter
   */
  this.off = function(evt, cb) {
    if (!(evt in eventsList)) return this
    const idx = eventsList[evt].indexOf(cb)
    if (idx !== -1) eventsList[evt].splice(idx, 1)
    return this
  }

  /**
   * Unbind all event listeners
   * @returns Emitter instance or instance with binded emitter
   */
  this.offAll = function() {
    eventsList = {}
    return this
  }

  /**
   * Emits event
   * @param {String} evt Event name
   * @param {...*} arguments Arguments list
   * @returns {void}
   */
  this.emit = function(evt) {
    if (!(evt in eventsList)) return
    eventsList[evt].forEach(cb => cb.apply(cb, [].slice.call(arguments, 1)))
  }

  /**
   * Adds list of event listeners
   * @param {Object} events Object with listeners lists (`eventName: [cb1, cb2]`)
   * @returns Instance
   */
  this.onMany = function(events) {
    return send(events)(this)
  }

  /**
   * Removes list of event listeners
   * @param {Object} events Object with listeners list (`eventName: [cb1, cb2]`)
   * @returns Instance
   */
  this.offMany = function(events) {
    Object.keys(events).forEach(evt => {
      events[evt].forEach(cb => {
        this.off(evt, cb)
      })
    })
  }

  /**
   * Shares own events with another bus and returns that bus
   * @param {Eventbus} bus Target event bus
   * @returns {Eventbus} Target event bus
   */
  this.sendTo = send(eventsList)

  /**
   * Creates a copy of Eventbus
   * @returns {Eventbus} Cloed event bus
   */
  this.fork = () => new Eventbus(eventsList)

  /**
   * Merge two event buses into one
   * @param {Eventbus} bus Event bus to merge with
   * @returns {Eventbus} Event bus with both listeners
   */
  this.merge = bus => this.fork().onMany(eventsList)

  /**
   * Adds `.on`, `.once`, `.off`, `.onMany`, `.offMany`, `.offAll` and `.emit` methods to object
   * @param {Object} newInstance Target object
   * @returns {Object} Target object
   */
  this.injectTo = newInstance => {
    newInstance.on = this.on
    newInstance.off = this.off
    newInstance.once = this.once
    newInstance.emit = this.emit
    newInstance.onMany = this.onMany
    newInstance.offAll = this.offAll
    newInstance.offMany = this.offMany
    return newInstance
  }

  /**
   * Adds `.on`, `.once` and `.off` methods to object
   * @param {Object} newInstance Target object
   * @returns {Object} Target object
   */
  this.injectObserverTo = newInstance => {
    newInstance.on = this.on
    newInstance.off = this.off
    newInstance.once = this.once
    return newInstance
  }
}
