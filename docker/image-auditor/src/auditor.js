var PROTOCOL = {
    PORT: 2205,
    MULTICAST_ADDRESS: "239.255.22.5",
    ADDRESS: "0.0.0.0"
}

// using Node.js module dgram
var dgram = require('dgram');

// udp socket to receive messages
var udp = dgram.createSocket('udp4');

// map of instruments
var mapInstruments = new Map();

// joining multicast for udp receivings
udp.bind(PROTOCOL.PORT, function () {
    console.log("Joining multicast group");
    udp.addMembership(PROTOCOL.MULTICAST_ADDRESS);
});

// This call back is invoked when a new datagram has arrived.
udp.on('message', function (msg, source) {
    //console.log("Data has arrived: " + msg + ". Source IP: " + source.address + ". Source.port: " + source.port);

    var instrument = JSON.parse(msg);

    instrument.lastAlive = Date.now();

    mapInstruments.set(instrument.uuid, instrument);
});

// using Node.js module tcp to use connect
var net = require('net');

var server = net.createServer(function (socket) {
    console.log("connected");

    var array = [];
    var map = new Map();

    mapInstruments.forEach(function (val, key, map) {

        if ((Date.now() - val.lastAlive) < 5000) {
            map.set(key, val);

            var object = new Object();
            object.uuid = key;
            object.instrument = val.name;

            var date = new Date();
            date.setTime(val.dateCreation);
            object.activeSince = date.toISOString();

            array.push(object);
        }
    });

    mapInstruments = map;

    socket.write(JSON.stringify(array) + "\r\n");
    socket.end();
});

server.listen(PROTOCOL.PORT, PROTOCOL.ADDRESS);

console.log("tcp server running");