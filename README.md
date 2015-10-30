# TrapClap

TrapClap is the Tox Remote Asynchronous Procedure Call (with Loose Anonymity) Protocol.
It's a simple peer-to-peer RPC mechanism with a clever backronym, intended to make
chatter easy, even if it's nonsense.

## Basic use

### As a "server"
```javascript
var trapclap = require('trapclap');

var mynode = new trapclap.TrapClap();

mynode.on('receive', function(e) {
    if (e.type == 'hello') {
        mynode.respond(e, 'world');
    }
});
mynode.start();
```

### As a "client"
```javascript
var trapclap = require('trapclap');

var mynode = new trapclap.TrapClap();
var peer = "200ABA62D15DB0A16C5B35724391041DB3173ACA2EBA44291856A70610672431";
mynode.start();
mynode.query(peer, "hello", function(e) {
    console.log("Got response: ", e.payload);
});
```

### Useful functions

```javascript
mynode.start(); // Start
```

## Addresses

TrapClap uses Tox as its data transmission mechanism. As a result, all peers are
identified by Tox addresses. See [The Tox Technical FAQ](https://wiki.tox.chat/users/techfaq)
for details on how it works.

## Authors

 - Smári McCarthy <smari@occrp.org>
