const express = require("express");
const app = express();
const server = require("http").Server(app);
const { v4: uuidv4 } = require("uuid");
const io = require("socket.io")(server, {
  cors: { origin: "*" },
});
const path = require("path");
const cors = require("cors");
app.use(express.static(path.join(__dirname + "/Public")));
app.use(cors());
// Peer
const { ExpressPeerServer } = require("peer");
const peerServer = ExpressPeerServer(server, {
  debug: true,
});
app.set("view engine", "ejs");
app.use(express.static("Public"));
app.use("/peerjs", peerServer);
app.get("/", (req, rsp) => {
  rsp.redirect(`/${uuidv4()}`);
});
app.get("/:room", (req, res) => {
  res.render("room", { roomId: req.params.room });
});
io.on("connection", (socket) => {
  console.log("Some client connected");
  socket.on("chat", (message) => {
    console.log("From client: ", message);
    io.emit("chat", message);
  });
  // socket.on("join-room", (roomId, userId) => {
  //   socket.join(roomId);
  //   socket.to(roomId).broadcast.emit("user-connected", userId);
  // });
});
server.listen(process.env.PORT || 3000);