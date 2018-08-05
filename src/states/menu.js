import config from '../config';

export default class extends Phaser.State {
  init(){
    this.stage.backgroundColor = '#4FADED';
  }

  preload(){
    console.log('preload');
    this.load.image('menu_bg','./assets/images/menu_bg.png');
  }

  create(){
    console.log('create');
    this.add.image(0,0,'menu_bg');

    // Add miner
    var miner = game.add.sprite(
      config.width/2 - config.spriteSize * 0.5,
      config.height/2 - config.spriteSize * 2, 'miner'
    );
    miner.animations.add('run', [0,1,2,3], 8, -1);
    miner.animations.play('run');
  }
}
