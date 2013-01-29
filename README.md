rtc-p2p
=======

This is a proof of concept and demo of using [WebRTC data channels](http://www.html5rocks.com/en/tutorials/webrtc/basics/#toc-rtcdatachannel)
to create a browser-based P2P file sharing network. The actual implementation
is just a proof-of-concept, and not actually optimized for any real world
usage.

Browser Compatibility
---------------------
So far, this has only been tested with Chrome 26. **In order to work, the
*Enable RTCDataChannel* flag must be enabled in Chrome** on the
[chrome://flags](chrome://flags) configuration page.

Limitations
-----------
Since this is a proof-of-concept, it has a number of limitations that mean
it cannot be used for real life file sharing:

* **Only the first 100 bytes of any file are shared.** There is a size
  limit on each message on a data channel. Unfortunately, Chrome 26 doesn't
  support reliable transport, so the data channel is UDP-like rather than
  TCP-like. This means that building a reliable transport for transferring
  an entire file in multiple blocks would require some work, and is beyond
  the scope of this proof-of-concept.

* **File requests are sent to all available peers.** If there are multiple
  peers with the same file available, they will all respond to the request.

* **Each peer automatically connects to all other peers.** This is clearly
  not scalable, but works for the purposes of this demonstration.

Usage
-----
Install with `npm install` and start with `npm start`. The server will
start at [http://localhost:8000](http://localhost:8000).

Browse to the address above in two or more tabs, and register some files in
each tab (preferrably text files).

Copy a file hash from one tab into another tab's Request File box and
request the file. The first 100 bytes of the request file should be
transferred.

Node? I thought this was P2P?
--------------------------------
Files are transferred directly between peers, but a server is needed for
two things:

1. WebRTC requires a server or some sort of intermediary to exchange
   signalling and session data. This must be done before a connection
   between two peers can be established.

   In this case, each peer communicates with the server using WebSockets to
   exchange signalling data with other peers.

2. rtc-p2p uses a [web worker](http://en.wikipedia.org/wiki/Web_worker) to
   compute the SHA1 hashes of registered files in the background. Web
   workers run on the client, but must be served from a server.
