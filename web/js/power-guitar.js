var PowerGuitar = {
  source:null
};

PowerGuitar.play = function() {
  function playSound(buffer, time) {
    this.source = context.createBufferSource();
    this.source.buffer = buffer;
    this.source.connect(context.destination);
    if (!this.source.start)
      this.source.start = this.source.noteOn;
    this.source.start(time);
  }

  var guitar = BUFFERS.guitar;

  playSound(guitar, time);
};


PowerGuitar.setPower = function(num) {
  var x = num;
  //var x = parseInt(element.value) / parseInt(element.max);

  // Use an equal-power crossfading curve:
  var gain1 = Math.cos(x * 0.5*Math.PI);

  this.source.gainNode.gain.value = gain1;
};
