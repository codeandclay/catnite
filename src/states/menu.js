import config from '../config';
import Score from '../lib/score';

export default class extends Phaser.State {
  init(){
    this.stage.backgroundColor = '#3f2832';
  }

  preload(){ }

  create(){
    var x = config.width/2;
    var y = config.spriteSize+2;

    // Add miner
    var miner = this.add.sprite(x + 36, y+config.spriteSize*1.5, 'miner');
    miner.anchor.setTo(0.5, 1);
    miner.animations.add('run', [0,1,2,3], 8, -1);
    miner.animations.play('run');

    // Add cat
    var cat = this.add.sprite(x - 36, y+config.spriteSize*1.5, 'cat_walk');
    cat.anchor.setTo(0.5, 1);
    cat.animations.add('walk', [0,1,2,3,4,5], 8, -1);
    cat.animations.play('walk');

    // Add title
    var title = this.add.sprite(x, y+config.spriteSize*1.5+1, 'title');
    title.anchor.setTo(0.5, 1);

    // Display hiscore
    this.score = new Score;
    this.hiscore = this.add.bitmapText(x, y, 'bmp_font', 'HiScore '+this.score.hi, 16);
    this.hiscore.anchor.setTo(0.5,1);

    // Display buttons
    this.start_button = this.add.bitmapText(x, y+(config.spriteSize*2.75), 'bmp_font', 'Start', 16);
    this.start_button.anchor.setTo(0.5,1);
    this.start_button.inputEnabled = true;
    // console.log(this.start_button.events);
    this.start_button.events.onInputUp.add(this.startGame, this);

    this.add.bitmapText(x, y+(config.spriteSize*4), 'bmp_font', 'Go Ad Free', 16).anchor.setTo(0.5,1);

    // Register keys
    this.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    // Stop the following keys from propagating up to the browser
    game.input.keyboard.addKeyCapture([ Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT, Phaser.Keyboard.SPACEBAR ]);

    // Register startGame callback
    this.input.keyboard.onPressCallback = this.startGame.bind(this);

    // Play music
    this.music = this.add.audio('menu_music');
    this.music.play();
  }

  startGame(){
    this.music.stop();
    this.state.start('Game');
  }
}
