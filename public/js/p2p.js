var getWorker = function () {
  var worker = new Worker('js/worker.js');

  if (worker.webkitPostMessage) {
    worker.postMessage = worker.webkitPostMessage;
  }

  return worker;
}

var registerFile = function (file) {
  var worker = getWorker();

  worker.onmessage = function (event) {
    var hash = event.data.result;

    files[hash] = file;
    $('<tr><td>' +  hash + '</td></tr>').appendTo('#files');
  };

  worker.postMessage({
    action: 'getSha1Hash',
    file: file,
  });

  return worker;
}
