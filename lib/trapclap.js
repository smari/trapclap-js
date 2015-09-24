/*
 * TrapClap - Tox Remote Asynchronous Procedure Call (with Loose Anonymity) Protocol
 */
var toxcore = require('toxcore');
var events = require('events');

var _tox_bootstrap_nodes = [
    { maintainer: 'occrp',
      address: '5.9.138.186',
      port: 33445,
      key: '674153CF49616CD1C4ADF44B004686FC1F6C9DCDD048EF89B117B3F02AA0B778' },
    { maintainer: 'occrp',
      address: '178.63.15.21',
      port: 33445,
      key: '674153CF49616CD1C4ADF44B004686FC1F6C9DCDD048EF89B117B3F02AA0B778' },
];

TrapClap = function() {
    this.debug('Instantiated new TrapClap');
    this.init();
}

TrapClap.prototype.debug = function() {
    console.log(arguments);
}

TrapClap.prototype.load_tox = function(datafile) {
    var settings = {
      path: '/usr/local/lib/libtoxcore.so',
      crypto: '/usr/local/lib/libtoxencryptsave.so'
    };
    if (datafile) {
        settings["data"] = datafile;
    }
    this._tox = new toxcore.Tox(settings);
    this.debug('Tox instatiated');
};

TrapClap.prototype.bootstrap = function() {
    var t = this;
    _tox_bootstrap_nodes.forEach(function(node) {
        t._tox.bootstrapSync(node.address, node.port, node.key);
        t.ee.emit('bootstrapped', node);
    });
    this.debug('Bootstrapped to DHT');
}

TrapClap.prototype.on = function(event, callback) {
    this.ee.on(event, callback);
}

TrapClap.prototype.init = function() {
    this.ee = new events.EventEmitter();
    this.load_tox();
    this.bootstrap();
    this._tox.on('friendRequest', this.handle_auth);
    this._tox.on('friendMessage', this.handle_message);
}

TrapClap.prototype.set_name = function(name) {
    return this.tox.setNameSync(name);
}

TrapClap.prototype.set_status = function(status) {
    return this.tox.setStatusMessageSync(status);
}

TrapClap.prototype.start = function() {
    this._tox.start();
}

TrapClap.prototype.address = function() {
    return this._tox.getAddressSync();
}

TrapClap.prototype.save_credentials = function(filename) {
    this._tox.saveToFile(filename);
}

var _qid = 1;

TrapClap.prototype.queryid_new = function() {
    return _qid++;
}

TrapClap.prototype.query = function(to, cmd, payload, auth) {
    var msg = {
        "query": cmd,
        "params": payload,
        "qid": this.queryid_new(),
    }
    if (auth) {
        msg["auth"] = auth;
    }
    var message = JSON.stringify(msg);
    this._tox.sendFriendMessage(to, message, false);
}

TrapClap.prototype.respond = function(to, qid, seq, payload) {
    var msg = {
        "qid": qid,
        "seq": seq,
        "response": payload,
    }
    var message = JSON.stringify(msg);
    this._tox.sendFriendMessage(to, message, false, callback);
}

TrapClap.prototype.error = function(to, errid, payload) {
    var msg = {
        "error": errid,
        "details": payload,
    }
    var message = JSON.stringify(msg);
    this._tox.sendFriendMessage(to, message, false, callback);
}

TrapClap.prototype.handle_message = function(e) {
    var friendName = tox.getFriendNameSync(e.friend());
    msg = JSON.parse(e.message());
    if (!msg.type) {

    }
    if (!msg.params) {

    }
    this.ee.emit("query", msg);
}

TrapClap.prototype.handle_auth = function(e) {
    module.callbacks("authrequest", msg.type, msg.params, e.friend());
    return module.authenticate(e.publicKey());
}

TrapClap.prototype.authenticate = function(key) {
    return tox.addFriendNoRequestSync(key);
}


module.exports = {
    'TrapClap': TrapClap,
}
