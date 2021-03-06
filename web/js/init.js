// Keep track of all loaded buffers.
var BUFFERS = {};
// Page-wide audio context.
var context = null;

// An object to track the buffers to load {name: path}
var BUFFERS_TO_LOAD = {
  type1: 'sound/sing_dongri.m4a',
  type2: 'sound/hihat.wav',
  type3: 'sound/hihat.wav',
  type4: 'sound/donguri.m4a',
  kick: 'sound/kick.wav',
  snare: 'sound/snare.wav',
  hihat: 'sound/hihat.wav',
  jam: 'sound/br-jam-loop.wav',
  crowd: 'sound/clapping-crowd.wav',
  drums: 'sound/blueyellow.wav',
  organ: 'sound/organ-echo-chords.wav',
  hey: 'sound/hai.m4a',
  techno: 'sound/techno.wav'
};

// Loads all sound samples into the buffers object.
function loadBuffers() {
  // Array-ify
  var names = [];
  var paths = [];
  for (var name in BUFFERS_TO_LOAD) {
    var path = BUFFERS_TO_LOAD[name];
    names.push(name);
    paths.push(path);
  }
  bufferLoader = new BufferLoader(context, paths, function(bufferList) {
    for (var i = 0; i < bufferList.length; i++) {
      var buffer = bufferList[i];
      var name = names[i];
      BUFFERS[name] = buffer;
    }
  });
  bufferLoader.load();
}

document.addEventListener('DOMContentLoaded', function() {
  try {
    // Fix up prefixing
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    context = new AudioContext();
  }
  catch(e) {
    alert("Web Audio API is not supported in this browser");
  }
  loadBuffers();
});
