rtc-p2p
=======

This is a proof of concept and demo of using WebRTC data channels to create
a browser-based P2P file sharing network. The actual implementation is just
a proof of concept, and not actually optimized for any real world usage.

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
