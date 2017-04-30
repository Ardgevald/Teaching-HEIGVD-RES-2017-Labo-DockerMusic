const PROTOCOL = {
    PORT: 2205,
    MULTICAST_ADDRESS: "239.255.22.5"
}

const UUID = require('uuid');

var mapInstruments = new Map();

mapInstruments.set("piano", "ti-ta-ti");
mapInstruments.set("trumpet", "pouet");
mapInstruments.set("flute", "trulu");
mapInstruments.set("violin", "gzi-gzi");
mapInstruments.set("drum", "boum-boum");

function Instrument(name) {
    this.dateCreation = Date.now();
    this.uuid = UUID();
    this.name = name;
    this.sound = mapInstruments.get(name);
}

process.on('SIGINT', function () {
    process.exit();
});

if (process.argv.length !== 3) {
    console.log("Missing argument");
    process.exit();
}

if (!mapInstruments.has(process.argv[2])) {
    console.log("Bad argument");
    process.exit();
}

// using Node.js module
var dgram = require('dgram');

// udp socket
var udp = dgram.createSocket('udp4');

// create object and serialize it
var instrument = new Instrument(process.argv[2]);

function sendJson() {

    var json = JSON.stringify(instrument);

    var message = new Buffer(json);

    udp.send(message, 0, message.length, PROTOCOL.PORT, PROTOCOL.MULTICAST_ADDRESS,
        function (err, bytes) {
            console.log("Sending json info: " + json + " via port " + udp.address().port);
        }
    );
}

setInterval(sendJson, 1000);