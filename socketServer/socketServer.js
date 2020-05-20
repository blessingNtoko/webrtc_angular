const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const port = 4177;

io.on('connection', (socket) => {
    console.log('A user has connected');

    socket.on('message', (message) => {
        // console.log('A message has been emitted', message);
        io.emit('message', message);
    });

    socket.on('disconnect', () => {
        console.log('A user has disconnected');
    });
});


http.listen(port, () => {
    console.log('listening on port: ', port);
});