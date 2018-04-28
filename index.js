export default function Eventbus(eventsList) {
  this.events = (eventsList && Object.assign({}, eventsList)) || {}

  this.on = (evt, cb) => {
    if (evt in this.events) {
      this.events[evt] = this.events[evt].concat(cb)
    } else {
      this.events[evt] = [cb]
    }
  }

  this.emit = function(evt) {
    if (!(evt in this.events)) return
    this.events[evt].forEach(cb => cb([].slice.call(arguments, 1)))
  }

  this.fork = () => new Eventbus(this.events)

  this.injectTo = to => {
    Object.keys(this.events).forEach(evt => {
      this.events[evt].forEach(cb => to.on(evt, cb))
    })
  }
}
