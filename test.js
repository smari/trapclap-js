var tc = require('./trapclap.js');

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
        assertEqual(e.payload, response);
    });
}

test_hello_world();
