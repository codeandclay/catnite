import config from '../config';

export default class extends Phaser.State {
  init(){
    this.stage.backgroundColor = '#3f2832';
  }

  preload(){ }

  create(){
    var x = config.width/2;
    var nudge = config.spriteSize/2;
    var y = config.height/2 + nudge;

    // Display start text
    this.start_button = this.add.bitmapText(x, config.height/2 + config.spriteSize/4, 'bmp_font', 'Click to start', 16);
    this.start_button.anchor.setTo(0.5,1);
    this.start_button.inputEnabled = true;

    // Register startGame callback
    this.input.keyboard.onPressCallback = this.startMenu.bind(this);
    this.input.onTap.add(this.startMenu, this);

  }

  startMenu(){
    this.state.start('Menu');
  }
}
