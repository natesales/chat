let peer = new Peer( "tpmslmxdae000000", "127.0.0.1", 9000)

peer.on('open', function(id) {
    console.log('My peer ID is: ' + id);
  });