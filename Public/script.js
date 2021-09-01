'use strict'
const socket = io("/");
const videoGrid = document.getElementById("video-grid");
const myVideo = document.createElement("video");
myVideo.muted = true;
const chat = document.querySelector(".chat-form");
const Input = document.querySelector(".chat-input");
chat.addEventListener("submit", (event) => {
  event.preventDefault();
  socket.emit("chat", Input.value);
  Input.value = "";
  socket.on("chat", (message) => {
    console.log("From server: ", message);
  });
  const chatWindow = document.querySelector(".chat-window");
  const renderMessage = (message) => {
    const div = document.createElement("div");
    div.classList.add("render-message");
    div.innerText = message;
    chatWindow.appendChild(div);
  };
  socket.on("chat", (message) => {
    renderMessage(message);
  });
});
const videoFunction = () => {
  var peer = new Peer(undefined, {
    path: "/peerjs",
    host: "/",
    port: "3000",
  });
  let myVideoStream;
  navigator.mediaDevices
    .getUserMedia({
      video: true,
      audio: true,
    })
    .then((stream) => {
      myVideoStream = stream;
      addVideoStream(myVideo, stream);
      peer.on("call", (call) => {
        call.answer(stream);
        const video = document.createElement("video");
        call.on("stream", (userVideoStream) => {
          addVideoStream(video, userVideoStream);
        });
      });
      socket.on("user-connected", (userId) => {
        connectToNewUser(userId, stream);
      });
    });
  peer.on("call", function (call) {
    getUserMedia(
      { video: true, audio: true },
      function (stream) {
        call.answer(stream); // Answer the call with an A/V stream.
        const video = document.createElement("video");
        call.on("stream", function (remoteStream) {
          addVideoStream(video, remoteStream);
        });
      },
      function (err) {
        console.log("Failed to get local stream", err);
      }
    );
  });
  peer.on("open", (id) => {
    socket.emit("join-room", ROOM_ID, id);
  });
  const addVideoStream = (videoEl, stream) => {
    videoEl.srcObject = stream;
    videoEl.addEventListener("loadedmetadata", () => {
      videoEl.play();
    });
    videoGrid.append(videoEl);
    let totalUsers = document.getElementsByTagName("video").length;
    if (totalUsers > 1) {
      for (let index = 0; index < totalUsers; index++) {
        document.getElementsByTagName("video")[index].style.width =
          100 / totalUsers + "%";
      }
    }
  };
};