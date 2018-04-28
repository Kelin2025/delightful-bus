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
   * Adds `.on` and `.emit` methods and events list to object
   * @param {Object} newInstance Target object
   * @returns {Object} Target object
   */
  this.injectTo = newInstance => {
    newInstance.on = this.on
    newInstance.emit = this.emit
    return newInstance
  }
}
