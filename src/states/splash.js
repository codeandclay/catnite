import { centerGameObjects } from '../utils'
import config from '../config'

export default class extends Phaser.State {
  init () {}

  preload () {
    this.loaderBg = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBg');
    this.loaderBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBar');
    centerGameObjects([this.loaderBg, this.loaderBar]);

    this.load.setPreloadSprite(this.loaderBar);
    //
    // load your assets
    //

    // Menu
    this.load.image('menu_bg','./assets/images/menu_bg.png');

    // Load miner
    this.load.spritesheet('miner',
      'assets/images/sprites/miner.png',
      config.spriteSize,
      config.spriteSize
     );

    // Load cat
    this.load.spritesheet('cat_walk', 'assets/images/sprites/cat_walk.png', 18, 15);
    this.load.spritesheet('cat_run', 'assets/images/sprites/cat_run.png', 20, 17);

    // Load bitmap font
    this.load.bitmapFont('bm_font', 'assets/fonts/font.png', 'assets/fonts/font.fnt');
  }

  create () {
    this.state.start('Menu');
  }
}
