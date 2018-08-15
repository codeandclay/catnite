import config from '../config';
import Score from '../lib/score';

export default class extends Phaser.State {
  init(){
    this.stage.backgroundColor = '#3f2832';
  }

  preload(){ }

  create(){
    var x = config.width/2;
    var nudge = config.spriteSize/2;
    var y = config.height/2 + nudge;

    // Add miner
    var miner = this.add.sprite(x + 36, y, 'miner');
    miner.anchor.setTo(0.5, 1);
    miner.animations.add('run', [0,1,2,3], 8, -1);
    miner.animations.play('run');

    // Add cat
    var cat = this.add.sprite(x - 36, y, 'cat_walk');
    cat.anchor.setTo(0.5, 1);
    cat.animations.add('walk', [0,1,2,3,4,5], 8, -1);
    cat.animations.play('walk');

    // Add title
    var title = this.add.sprite(x, y, 'title');
    title.anchor.setTo(0.5, 1);

    // Display hiscore
    this.score = new Score;
    this.hiscore = this.add.bitmapText(x, config.spriteSize+nudge, 'bmp_font', 'HiScore '+this.score.hi, 16);
    this.hiscore.anchor.setTo(0.5,1);

    // Display start text
    this.start_button = this.add.bitmapText(x, y+config.spriteSize*1.5, 'bmp_font', 'Tap to start', 16);
    this.start_button.anchor.setTo(0.5,1);
    this.start_button.inputEnabled = true;

    // Register startGame callback
    this.input.keyboard.onPressCallback = this.startGame.bind(this);
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
