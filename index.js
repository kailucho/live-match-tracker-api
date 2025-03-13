const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const matches = require('./matches.json');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

const PORT = process.env.PORT || 4000;

io.on('connection', (socket) => {
    console.log('A user connected');

    // Send initial data
    socket.emit('matches', matches);

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// Simulate live match updates every 5 seconds
setInterval(() => {
    matches.forEach((match) => {
        match.scoreA += Math.round(Math.random());
        match.scoreB += Math.round(Math.random());
    });
    
    io.emit('matches', matches);
}, 5000);

// Reset scores every 30 seconds
setInterval(() => {
    matches.forEach((match) => {
        match.scoreA = 0;
        match.scoreB = 0;
    });
    
    io.emit('matches', matches);
}, 30000);

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});