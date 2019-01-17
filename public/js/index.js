var socket = io('http://localhost:3000');
console.log("naruot");

const constraints = {
  video: true,
  audio: true
};

const video = document.querySelector('video');

navigator.mediaDevices.getUserMedia(constraints).
  then((stream) => {video.srcObject = stream;console.log(stream);});

