var KaraokeClass = {};

var karaokeEnabled =true;
var mix,
    mix2;

KaraokeClass.init = function() {

    var filedrag = document.getElementById('filedrag'),
        fileselect = document.getElementById('fileselect'),
        disableFilter = document.getElementById('disable-filter'),
        options = document.getElementById('options'),
        demoAudio = document.getElementById('demo-audio');

    // file select
    fileselect.addEventListener('change', fileSelectHandler, false);

    var xhr = new XMLHttpRequest();
    if (xhr.upload) {
        // file drop
        filedrag.addEventListener('dragover', fileDragHover, false);
        filedrag.addEventListener('dragleave', fileDragHover, false);
        filedrag.addEventListener('drop', fileSelectHandler, false);
        filedrag.style.display = 'block';
    } else {
        filedrag.style.display = 'none';
    }

    karaokeEnabled = true;
  /*
   demoAudio.addEventListener('click', function() {
   playSound('audio/sing_donguri.m4a')
   }, false);
   */
    // playSound('sound/sing_donguri.m4a');

    // file drag hover
    function fileDragHover(e) {
        e.stopPropagation();
        e.preventDefault();
        e.target.className = (e.type === 'dragover' ? 'hover' : '');
    }

    // file selection
    function fileSelectHandler(e) {
        // cancel event and hover styling
        fileDragHover(e);

        var droppedFiles = e.target.files || e.dataTransfer.files;

        var reader = new FileReader();

        reader.onload = function(fileEvent) {
            var data = fileEvent.target.result;
            audioFile = data;

            if(Mp4InfoClass) {
              Mp4InfoClass.info(data);              
            }

            document.getElementById('filedrag').innerHTML = 'OK';

            // var currentSong = document.getElementById('current-song');
            var dv = new jDataView(this.result);


            // "TAG" starts at byte -128 from EOF.
            // See http://en.wikipedia.org/wiki/ID3
             if (dv.getString(3, dv.byteLength - 128) == 'TAG') {
               document.getElementById('title').innerHTML = dv.getString(30, dv.tell());
             }
            //     var title = dv.getString(30, dv.tell());
            //     var artist = dv.getString(30, dv.tell());
            //     var album = dv.getString(30, dv.tell());
            //     var year = dv.getString(4, dv.tell());
            //     currentSong.innerHTML = 'Playing ' + title + ' by ' + artist;
            // } else {
            //     // no ID3v1 data found.
            //     currentSong.innerHTML = 'Playing';
            // }

            // options.style.display = 'block';
        };

        // http://ericbidelman.tumblr.com/post/8343485440/reading-mp3-id3-tags-in-javascript
        // https://github.com/jDataView/jDataView/blob/master/src/jDataView.js

        reader.readAsArrayBuffer(droppedFiles[0]);

    }

};

KaraokeClass.playSound = function(url) {
    var request = new XMLHttpRequest();
    var self = this;

    request.open('GET', url, true);
    request.responseType = 'arraybuffer';

    // Our asynchronous callback
    request.onload = function() {
        var data = request.response;
        console.log("test");
        self.initAudio(data);
    };

    request.send();
};

var context = new (window.AudioContext || window.webkitAudioContext)();
var source;
var processor,
    filterLowPass,
    filterHighPass,
    audioFile;
KaraokeClass.initAudio = function(data) {
    if (source) source.stop(0);

    source = context.createBufferSource();

    if (context.decodeAudioData) {
        context.decodeAudioData(data, function (buffer) {
            source.buffer = buffer;
            createAudio();
        }, function (e) {
            console.error(e);
        });
    } else {
        source.buffer = context.createBuffer(data, false);
        createAudio();
    }



  // call initialization file
  if (window.File && window.FileList && window.FileReader) {
   init();
  } else {
    alert('Your browser does not support File');
  }




  function createAudio() {
    // create low-pass filter
    filterLowPass = context.createBiquadFilter();
    source.connect(filterLowPass);

    filterLowPass.type = 'lowpass';
    filterLowPass.frequency.value = 120;

    // create high-pass filter
    filterHighPass = context.createBiquadFilter();
    source.connect(filterHighPass);
    filterHighPass.type = 'highpass';
    filterHighPass.frequency.value = 120;

    // create the gain node
    mix = context.createGain();

    mix2 = context.createGain();
    source.connect(mix2);
    mix2.connect(context.destination);

    mix.gain.value = 1;
    mix2.gain.value = 0;

    // create the processor
    processor = context.createScriptProcessor(2048 /*bufferSize*/ , 2 /*num inputs*/ , 1 /*num outputs*/);

    // connect everything
    filterHighPass.connect(processor);
    filterLowPass.connect(mix);
    processor.connect(mix);
    mix.connect(context.destination);

    // connect with the karaoke filter
    processor.onaudioprocess = karaoke;

    // playback the sound
    source.start(0);

    setTimeout(disconnect, source.buffer.duration * 1000 + 1000);
  }

  function disconnect() {
    source.stop(0);
    source.disconnect(0);
    processor.disconnect(0);
    mix.disconnect(0);
    mix2.disconnect(0);
    filterHighPass.disconnect(0);
    filterLowPass.disconnect(0);
  }

  // based on https://gist.github.com/kevincennis/3928503
  // flip phase of right channel
  // http://www.soundonsound.com/sos/sep04/articles/qa0904-7.htm
  function karaoke(evt) {
    var inputL = evt.inputBuffer.getChannelData(0),
      inputR = evt.inputBuffer.getChannelData(1),
      output = evt.outputBuffer.getChannelData(0),
      len = inputL.length,
      i = 0;
    for (; i < len; i++) {
      output[i] = inputL[i] - inputR[i];
    }
  }
};

KaraokeClass.disableKaraoke = function() {
  if(mix2 && mix){
    mix2.gain.value = 1;
    mix.gain.value = 0;
  }
};

KaraokeClass.enableKaraoke = function() {
  if(mix2 && mix){
    mix.gain.value = 1;
    mix2.gain.value = 0;
  }
};
