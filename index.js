export const send = events => to => {
  Object.keys(events).forEach(evt => {
    events[evt].forEach(cb => to.on(evt, cb))
  })
  return to
}

export default function Eventbus(eventsList, instance) {
  this.events = (eventsList && Object.assign({}, eventsList)) || {}

  instance = instance || this

  /**
   * Adds event listener
   * @param {String} evt Event name
   * @param {function} cb Callback
   * @returns Emitter instance or instance with binded emitter
   */
  this.on = (evt, cb) => {
    if (evt in this.events) {
      this.events[evt] = this.events[evt].concat(cb)
    } else {
      this.events[evt] = [cb]
    }
    return instance
  }

  /**
   * Unbind event listener
   * @param {String} evt Event name
   * @param {function} cb Callback
   * @returns Emitter instance or instance with binded emitter
   */
  this.off = (evt, cb) => {
    if (!(evt in this.events)) return instance
    const idx = this.events[evt].indexOf(cb)
    if (idx !== -1) this.events[evt].splice(idx, 1)
    return instance
  }

  /**
   * Unbind all event listeners
   * @returns Emitter instance or instance with binded emitter
   */
  this.offAll = () => {
    this.events = {}
    return instance
  }

  /**
   * Emits event
   * @param {String} evt Event name
   * @param {...*} arguments Arguments list
   * @returns {void}
   */
  this.emit = function(evt) {
    if (!(evt in this.events)) return
    this.events[evt].forEach(cb => cb([].slice.call(arguments, 1)))
  }

  /**
   * Adds list of event listeners
   * @param {Object} events Object with listeners lists (`eventName: [cb1, cb2]`)
   * @returns Instance
   */
  this.onMany = events => send(events)(this)

  /**
   * Shares own events with another bus and returns that bus
   * @param {Eventbus} bus Target event bus
   * @returns {Eventbus} Target event bus
   */
  this.sendTo = send(this.events)

  /**
   * Creates a copy of Eventbus
   * @param {Object} instance (Optional) Instance that will be returned after `.on()`
   * @returns {Eventbus} Cloed event bus
   */
  this.fork = instance => new Eventbus(this.events, instance)

  /**
   * Merge two event buses into one
   * @param {Eventbus} bus Event bus to merge with
   * @returns {Eventbus} Event bus with both listeners
   */
  this.merge = bus => this.fork().onMany(bus.events)

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
