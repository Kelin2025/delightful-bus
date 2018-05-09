"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Eventbus;
var send = exports.send = function send(events) {
  return function (to) {
    Object.keys(events).forEach(function (evt) {
      events[evt].forEach(function (cb) {
        return to.on(evt, cb);
      });
    });
    return to;
  };
};

function Eventbus(eventsList) {
  var _this = this;

  eventsList = eventsList && Object.assign({}, eventsList) || {};

  this.events = eventsList;

  /**
   * Adds event listener
   * @param {String} evt Event name
   * @param {function} cb Callback
   * @returns Emitter instance or instance with binded emitter
   */
  this.on = function (evt, cb) {
    if (evt in eventsList) {
      eventsList[evt] = eventsList[evt].concat(cb);
    } else {
      eventsList[evt] = [cb];
    }
    return this;
  };

  /**
   * Adds event listener that will be removed after emit
   * @param {String} evt Event name
   * @param {function} cb Callback
   * @returns Emitter instance or instance with binded emitter
   */
  this.once = function (evt, cb) {
    var self = _this;

    var selfDesctructable = function selfDesctructable() {
      cb.apply(cb, arguments);
      self.off(evt, selfDesctructable);
    };

    return _this.on(evt, selfDesctructable);
  };

  /**
   * Unbind event listener
   * @param {String} evt Event name
   * @param {function} cb Callback
   * @returns Emitter instance or instance with binded emitter
   */
  this.off = function (evt, cb) {
    if (!(evt in eventsList)) return this;
    var idx = eventsList[evt].indexOf(cb);
    if (idx !== -1) eventsList[evt].splice(idx, 1);
    return this;
  };

  /**
   * Unbind all event listeners
   * @returns Emitter instance or instance with binded emitter
   */
  this.offAll = function () {
    eventsList = {};
    return this;
  };

  /**
   * Emits event
   * @param {String} evt Event name
   * @param {...*} arguments Arguments list
   * @returns {void}
   */
  this.emit = function (evt) {
    var _arguments = arguments;

    if (!(evt in eventsList)) return;
    eventsList[evt].forEach(function (cb) {
      return cb.apply(cb, [].slice.call(_arguments, 1));
    });
  };

  /**
   * Adds list of event listeners
   * @param {Object} events Object with listeners lists (`eventName: [cb1, cb2]`)
   * @returns Instance
   */
  this.onMany = function (events) {
    return send(events)(this);
  };

  /**
   * Removes list of event listeners
   * @param {Object} events Object with listeners list (`eventName: [cb1, cb2]`)
   * @returns Instance
   */
  this.offMany = function (events) {
    var _this2 = this;

    Object.keys(events).forEach(function (evt) {
      events[evt].forEach(function (cb) {
        _this2.off(evt, cb);
      });
    });
  };

  /**
   * Shares own events with another bus and returns that bus
   * @param {Eventbus} bus Target event bus
   * @returns {Eventbus} Target event bus
   */
  this.sendTo = send(eventsList);

  /**
   * Creates a copy of Eventbus
   * @returns {Eventbus} Cloed event bus
   */
  this.fork = function () {
    return new Eventbus(eventsList);
  };

  /**
   * Merge two event buses into one
   * @param {Eventbus} bus Event bus to merge with
   * @returns {Eventbus} Event bus with both listeners
   */
  this.merge = function (bus) {
    return _this.fork().onMany(eventsList);
  };

  /**
   * Adds `.on`, `.once`, `.off`, `.onMany`, `.offMany`, `.offAll` and `.emit` methods to object
   * @param {Object} newInstance Target object
   * @returns {Object} Target object
   */
  this.injectTo = function (newInstance) {
    newInstance.on = _this.on;
    newInstance.off = _this.off;
    newInstance.once = _this.once;
    newInstance.emit = _this.emit;
    newInstance.onMany = _this.onMany;
    newInstance.offAll = _this.offAll;
    newInstance.offMany = _this.offMany;
    return newInstance;
  };

  /**
   * Adds `.on`, `.once` and `.off` methods to object
   * @param {Object} newInstance Target object
   * @returns {Object} Target object
   */
  this.injectObserverTo = function (newInstance) {
    newInstance.on = _this.on;
    newInstance.off = _this.off;
    newInstance.once = _this.once;
    return newInstance;
  };
}
