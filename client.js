var RTCPeerConnection = window.PeerConnection || window.webkitPeerConnection00 || window.webkitRTCPeerConnection;
var config = {
  iceServers: [{ 'url': 'stun:stun.l.google.com:19302' }]
};

var socket = io.connect('http://localhost:8000');
var pc = new PeerConnection(config);

var senders = {};
var receivers = {};

pc.onicecandidate = function (event) {
  if (event.candidate) {
    socket.emit('candidate', { 'candidate': event.candidate });
  }
};

socket.on('candidate', function (data) {
  var pcSend = receivers[data.from] = new RTCPeerConnection(config);
  pcSend.addIceCandidate(new RTCIceCandidate(data.candidate));

  pcSend.createOffer(function (desc) {
    pcSend.setLocalDescription(desc);
    socket.emit('offer', { 'to': data.from, 'desc': desc });
  });
});

socket.on('offer', function (data) {
  var pcReceive = receivers[data.from] = new RTCPeerConnection(config);

  pcReceive.setRemoteDescription(new RTCSessionDescription(offer.desc));
  pcReceive.createAnswer(pcReceive.remoteDescription, function (desc) {
    pcReceive.setLocalDescription(desc);
    socket.emit('answer', { 'to': data.from, 'desc': desc });
  });
});

socket.on('answer', function (data) {
  senders[data.from].setRemoteDescription(new RTCSessionDescription(data.desc));
});
