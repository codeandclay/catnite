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
  }
}
