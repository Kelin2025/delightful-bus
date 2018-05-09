# Delightful bus

Event bus with more features

## Installation

```bash
$ yarn add delightful-bus
```

```javascript
import Eventbus from "delightful-bus"

const bus = new Eventbus()
```

## Classic methods

##### `.emit(evt, ...args)` - emit event

```javascript
bus.emit("foo", "bar", "baz")
```

##### `.on(evt, cb)` - add event listener

```javascript
bus.on("foo", console.log)
// => bar baz (According to previous example)
```

##### `.off(evt, cb)` - remove event listener

```javascript
bus.off("foo")

bus.emit("foo", "bar")
// => nothing because listener is removed
```

## More fun

##### `.onMany(events)` - add many events

```javascript
bus.onMany({
  foo: [cb1, cb2],
  bar: [cb3]
})
```

##### `.offAll()` - remove all listeners

```javascript
bus.offAll()
```

## Extending and inheritance

##### `.sendTo(bus)` - send events to another bus

```javascript
const bus1 = new Eventbus()

const bus2 = new Eventbus()

bus1.on("foo", console.log)

bus1.sendTo(bus2)

bus2.emit("foo", "bar baz")
// => bar baz (bus2 got events from bus1)
```

##### `.fork()` - fork bus

```javascript
const bus1 = new Eventbus()
bus1.on("aaa", console.log)

const bus2 = bus.fork()

bus2.emit("aaa", "bar")
// => bar (events are inherited from bus1)

bus.on("bbb", console.log)
bus2.emit("bbb", "bar")
// => nothing (because event was send to bus1 after fork)

bus2.on("ccc", console.log)
bus.emit("ccc", "bar")
// => nothing (because event was send to bus2 after fork)
```

##### `.merge(bus2)` - fork current bus with of events of both (bus and bus2) buses

```javascript
const bus = new Eventbus()
bus.on("aaa", console.log)

const bus2 = new Eventbus()
bus.on("bbb", console.log)

const bus3 = bus.merge(bus2)
bus3.emit("aaa", "bar")
// => bar (event from bus)
bus3.emit("bbb", "bar")
// => bar (event from bus2)

bus3.on("ccc", console.log)
bus.emit("ccc", "bar")
// => nothing (it's a fork)
bus2.emit("ccc", "bar")
// => nothing (it's a fork)
```

##### `.injectTo(instance)` - adds `.on`, `.off`, `.onMany`, `.offMany`, `.offAll` and `.emit` methods of forked bus to some instance

```javascript
const smth = {}

const bus = new Eventbus()
bus.on("test", console.log)

bus.injectTo(smth)
smth.on("foo", console.log)
smth.emit("foo", "bar")
// => bar

bus.emit("test", "bar")
// => bar (inherited from bus)

bus.on("test", console.log)
smth.emit("test", "bar")
// => nothing (it's a fork)

bus.emit("foo", "bar")
// => nothing (it's a fork)
```

##### `.injectObserverTo(newInstance)` - adds only `.on` and `.off` methods

```javascript
const smth = {}

const bus = new Eventbus()
bus.on("test", console.log)

bus.injectObserverTo(smth)
smth.on("foo", console.log)
smth.emit("foo", "bar")
// => bar

bus.emit("test", "bar")
// => bar (inherited from bus)

bus.on("test", console.log)
smth.emit("test", "bar")
// => nothing (it's a fork)

bus.emit("foo", "bar")
// => nothing (it's a fork)
```
