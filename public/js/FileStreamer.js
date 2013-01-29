/*
 * Copyright (c) 2012, Rohan Singh (rohan@washington.edu)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

/*
 * See readme at: http://github.com/rohansingh/FileStreamer
 */

var FileStreamer = function (sliceSize, useFileReaderSync) {
  this.sliceSize = sliceSize;
  this.useFileReaderSync = useFileReaderSync;
}

FileStreamer.prototype.streamAsBinaryString = function (file, callback) {
  return this.streamFile(file, callback);
}

FileStreamer.prototype.streamAsText = function (file, encoding, callback) {
  return this.streamFile(file, callback, 'text', encoding);
}

FileStreamer.prototype.streamAsArrayBuffer = function (file, callback) {
  return this.streamFile(file, callback, 'buffer');
}

FileStreamer.prototype.streamAsDataURL = function (file, callback) {
  return this.streamFile(file, callback, 'url');
}

FileStreamer.prototype.streamFile = function (file, callback, readType, encoding) {
  var fileReader;
  if (this.useFileReaderSync) {
    fileReader = new FileReaderSync();
  }
  else {
    fileReader = new FileReader();
  }

  var position = 0;
  var eof = false;

  var sliceFunc = file.slice || file.webkitSlice || file.mozSlice;
  
  var readFunc;
  if (readType === 'text') {
    readFunc = function (blob) {
      return fileReader.readAsText.apply(this, [blob, encoding]);
    }
  }
  else if (readType === 'buffer') {
    readFunc = fileReader.readAsArrayBuffer;
  }
  else if (readType === 'url') {
    readFunc = fileReader.readAsDataURL;
  }
  else {
    readFunc = fileReader.readAsBinaryString;
  }

  var that = this;
  var doRead = function () {
    if (eof) {
      // We've read the entire file.
      return;
    }

    var end = position + that.sliceSize;
    if (end >= file.size) {
      end = file.size;
      eof = true;
    }

    var blob = sliceFunc.apply(file, [position, end]);
    position = end;

    var result =  readFunc.apply(fileReader, [blob]);

    // If we are using FileReaderSync, return the result of the read
    // to the user's callback, and then start reading the next slice.
    if (that.useFileReaderSync && callback.apply(file, [result, eof]) !== false) {
      doRead();
    }
  };

  if (!this.useFileReaderSync) {
    fileReader.onloadend = function (event) {
      if (callback.apply(file, [event, eof]) !== false) {
        doRead();
      }
    };
  }

  doRead();
}

