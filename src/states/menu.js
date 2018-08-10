import config from '../config';

export default class extends Phaser.State {
  init(){
    this.stage.backgroundColor = '#3f2832';
  }

  preload(){ }

  create(){
    var x = config.width/2;
    var y = config.height/2;

    // Add miner
    var miner = this.add.sprite(x + 36, y, 'miner');
    miner.anchor.setTo(0.5, 0.5);
    miner.animations.add('run', [0,1,2,3], 8, -1);
    miner.animations.play('run');

    // Add cat
    var cat = this.add.sprite(x - 36, y, 'cat_walk');
    cat.anchor.setTo(0.5, 0.5);
    cat.animations.add('walk', [0,1,2,3,4,5], 8, -1);
    cat.animations.play('walk');

    // Add title
    var title = this.add.sprite(x, y, 'title');
    title.anchor.setTo(0.5, 0.5);

    // Register keys
    this.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    // Stop the following keys from propagating up to the browser
    game.input.keyboard.addKeyCapture([ Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT, Phaser.Keyboard.SPACEBAR ]);

    // Register startGame callback
    this.spaceKey.onDown.add(this.startGame, this);
    this.input.onTap.add(this.startGame, this);

    // Play music
    this.music = this.add.audio('menu_music');
    this.music.play();
  }

  startGame(){
    this.music.stop();
    this.state.start('Game');
  }
}
