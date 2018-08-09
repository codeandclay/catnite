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

    // Load bitmap font
    this.load.bitmapFont('bm_font', 'assets/fonts/font.png', 'assets/fonts/font.fnt');

    // Load miner
    this.load.spritesheet('miner',
      'assets/images/sprites/miner.png',
      config.spriteSize,
      config.spriteSize
     );

    // Load cat
    this.load.spritesheet('cat_walk', 'assets/images/sprites/cat_walk.png', 18, 15);
    this.load.spritesheet('cat_run', 'assets/images/sprites/cat_run.png', 20, 17);

    // Load background
    this.load.image('background', 'assets/images/background.png');

    // Load tiles
    this.load.spritesheet('tiles', 'assets/images/sprites/tiles.png', 16, 16);

    // Load particles
    this.load.image('dirt', 'assets/images/particles/dirt.png');
    this.load.image('blood', 'assets/images/particles/blood.png');

    // Music
    this.load.audio('menu_music', 'assets/audio/menu_music.wav');

    // SFX
    for (var i = 0; i < 6; i ++ ){
      this.load.audio('splat0'+i, 'assets/audio/splats/Splat_0'+i+'.mp3');
    }

    this.load.audio('dollar_sfx', 'assets/audio/Collect_Point_01.wav');
    this.load.audio('jump_sfx', 'assets/audio/Jump_03.wav');
    this.load.audio('landing_sfx_a', 'assets/audio/SFX_Jump_09.wav');
    this.load.audio('landing_sfx_b', 'assets/audio/Open_00.wav');
    this.load.audio('death_sfx', 'assets/audio/Hero_Death_00.wav');
    this.load.audio('death_hit', 'assets/audio/Explosion_04.wav');
  }

  create () {
    this.state.start('Menu');
  }
}
