var PowerGuitar = {
};

var sources;
var base_vol = 1;

PowerGuitar.play = function() {
  function createSource(buffer) {
    var source = context.createBufferSource();
    var gainNode = context.createGain ? context.createGain() : context.createGainNode();
    source.buffer = buffer;
    source.loop = false;
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
    if (!sources.source.start)
      sources.source.start = sources.source.noteOn;

    sources.source.start(time);
    base_vol = 1;
    setInterval(function(){
      base_vol = base_vol * 0.99;
    },10);
  }



  var guitar = BUFFERS.guitar;
  var time = context.currentTime + 0.100;
  playSound(guitar, time);
};


PowerGuitar.setPower = function(num) {
  var x = num/10;
  //var x = parseInt(element.value) / parseInt(element.max);

  // Use an equal-power crossfading curve:
  var gain1 = x*base_vol; //Math.cos(x * 0.5*Math.PI);
  console.log("gain:"+gain1);
  if(sources) {
    sources.gainNode.gain.value = gain1;
  }
};
