var assert = require('assert');
var tc = require('./lib/trapclap.js');

/*
describe('TrapClap', function() {
    describe('#start', function() {
        it('should start a TrapClap client instance which can communicate', function() {
            var s = new tc.TrapClap();
            console.log(s.start());
        });
    });

    describe('#query', function() {
        it('should cause a query to be sent', function() {
        });
    });
});
*/

function test_hello_world() {
    var server = new tc.TrapClap();
    var query = 'hello';
    var response = 'world'

    server.on('receive', function(e) {
        if (e.type == query) {
            server.respond(e, response);
        }
    });
    server.start();

    var client = new tc.TrapClap();
    client.start();
    client.query(server.address(), query, function(e) {
        assert.equal(e.payload, response);
    });
}

test_hello_world();
