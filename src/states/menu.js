import config from '../config';

export default class extends Phaser.State {
  init(){ }

  preload(){ }

  create(){
    this.add.image(0,0,'menu_bg');

    // Add miner
    var miner = this.add.sprite(
      config.width/2 - config.spriteSize * 0.5,
      config.height/2 - config.spriteSize * 2, 'miner'
    );
    miner.animations.add('run', [0,1,2,3], 8, -1);
    miner.animations.play('run');

    // Add cat
    var cat = this.add.sprite(
      config.width/2 - config.spriteSize * 0.5,
      config.height/2 + config.spriteSize, 'cat_walk'
    )
    cat.animations.add('walk', [0,1,2,3,4,5], 8, -1);
    cat.animations.play('walk');

    // Add text
    var text = game.add.bitmapText(config.width/2, config.height/2 - 1, 'bm_font','Placeholder instruction',16);
    text.anchor.setTo(0.5);

    // Register keys
    this.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    // Stop the following keys from propagating up to the browser
    game.input.keyboard.addKeyCapture([ Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT, Phaser.Keyboard.SPACEBAR ]);

    // Register startGame callback
    this.spaceKey.onDown.add(this.startGame, this);
    this.input.onTap.add(this.startGame, this);
  }

  startGame(){
    this.state.start('Game');
  }
}
