var PowerGuitar = {
};

var sources;

PowerGuitar.play = function() {
  function createSource(buffer) {
    var source = context.createBufferSource();
    var gainNode = context.createGain ? context.createGain() : context.createGainNode();
    source.buffer = buffer;
    // Turn on looping
    source.loop = true;
    // Connect source to gain.
    source.connect(gainNode);
    // Connect gain to destination.
    gainNode.connect(context.destination);

    return {
      source: source,
      gainNode: gainNode
    };
  }
  function playSound(buffer, time) {

    sources = createSource(buffer);
//    sources.connect(context.destination);
    if (!sources.start)
      sources.start = sources.noteOn;
    sources.start(time);
  }

  var guitar = BUFFERS.guitar;
  var time = context.currentTime + 0.100;
  playSound(guitar, time);
};


PowerGuitar.setPower = function(num) {
  var x = num/20;
  //var x = parseInt(element.value) / parseInt(element.max);

  // Use an equal-power crossfading curve:
  var gain1 = Math.cos(x * 0.5*Math.PI);
  console.log(gain1);
  if(sources) {
    sources.gainNode.gain.value = gain1;
  }
};