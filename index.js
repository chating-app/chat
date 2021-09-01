const express = require('express')
const app = express()
const server = require('http').createServer(app)
const port = process.env.PORT || 3000
const io = require('socket.io')(server,{
  cors: {
    origin: '*',
  },
})
const path = require('path');
const cors= require('cors');
app.use(express.static(path.join(__dirname + '/Public')));
app.use(cors())


io.on('connection', socket => {
  console.log('Some client connected');
  socket.on('chat', message => {
    console.log('From client: ', message);
    io.emit('chat', message)
  });
})
// just to test the server
app.get('/', (req, res) => {
  res.status(200).send('Working')
})
server.listen(port, () => {
  console.log(`Server running on port: ${port}`)
})
