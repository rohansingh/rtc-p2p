importScripts('FileStreamer.js', 'sha1.js', 'sha1_stream.js');

var worker = {
  getSha1Hash: function (file, callback) {
    var head = naked_sha1_head();

    var fs = new FileStreamer(4 * 1024 * 1024, true);
    fs.streamAsBinaryString(file, function (data, eof) {
      var buffer = str2binb(data);

      naked_sha1(buffer, data.length * 8, head);

      if (eof) {
        var hash = binb2hex(naked_sha1_tail(head));
        callback(hash);
      }
    });
  },
};

self.addEventListener('message', function (event) {
  var message = event.data;

  var respondFunc = function (result) {
    postMessage({
      action: message.action,
      result: result
    });
  }

  if (message.action === 'getSha1Hash') {
    worker.getSha1Hash(message.file, respondFunc);
  }
}, false);

