var express = require('express'),
	app = express(),
	server = require('http').Server(app),
	port = process.env.PORT || 5000,
	SerialPort = require('serialport').SerialPort,
	request = require('request'),
	_ = require('underscore'),
	/*serialPort = new SerialPort('/dev/tty.usbmodem1431', {
      baudrate: 57600
    }),*/
    serialMessage = '';

/*serialPort.on('open', function() {
  console.log('Serial port open');
});*/

app.get('/chooseMember/:event_id', function(req, resp) {
	request({
		url: 'https://api.meetup.com/2/rsvps?key=474cc9332345ea7d7e135f50653c&event_id='+req.params.event_id,
		json: true
	}, function(error, response, body) {
		var members = _.pluck(body.results, 'member'),
			randomMember = members[_.random(members.length - 1)];
		
		resp.json(randomMember);

		console.log(randomMember.name);

		//serialPort.write(randomMember.name + '\n');
	});
});

app.get('/', function(request, response) {
  response.sendFile(__dirname + '/public/index.html');
});

app.get(/^(.+)$/, function(req, res) {
  res.sendFile(__dirname + '/public/' + req.params[0]);
});

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

server.listen(port, function() {
  console.log('Listening on ' + port);
});