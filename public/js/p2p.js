var getWorker = function () {
  var worker = new Worker('worker.js');

  if (worker.webkitPostMessage) {
    worker.postMessage = worker.webkitPostMessage;
  }

  return worker;
}

var getSha1Hash = function (file) {
  var worker = getWorker();

  worker.onmessage = function (event) {
    files[event.data.result] = file;
  };

  worker.postMessage({
    action: 'getSha1Hash',
    file: file,
  });

  return worker;
}
