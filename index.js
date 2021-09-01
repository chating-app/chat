const express=require('express');
const app=express();

const server = require('http').createServer(app)
const port = process.env.PORT || 3001

const io = require('socket.io')(server)
const nameSpace=io.of('/server')
const path = require('path')

app.use(express())


nameSpace.on('connection',socket=>{
    console.log('connect client');
})

// just to test the server
app.get('/', (req, res) => {
  res.status(200).send('Working')
})

server.listen(port, () => {
  console.log(`Server running on port: ${port}`)
})