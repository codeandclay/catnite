/**
 * Import Phaser dependencies using `expose-loader`.
 * This makes then available globally and it's something required by Phaser.
 * The order matters since Phaser needs them available before it is imported.
 */

import PIXI from 'expose-loader?PIXI!phaser-ce/build/custom/pixi.js';
import p2 from 'expose-loader?p2!phaser-ce/build/custom/p2.js';
import Phaser from 'expose-loader?Phaser!phaser-ce/build/custom/phaser-split.js';

import MenuState from './states/menu';
import BootState from './states/boot';

/**
 * Create a new Phaser game instance.
 * And render a single sprite so we make sure it works.
 */

console.clear();

var colors = window.colors;

class Game extends Phaser.Game {
  constructor () {
    var config = {
      antialias: false,
      crisp: true,
      // renderer: Phaser.AUTO,
      renderer: Phaser.CANVAS,
      scaleMode: Phaser.ScaleManager.SHOW_ALL,
      width: 16*10,
      height: (16*10)*9/16
    }

    super(config);

    // this.state.add('Splash', SplashState, false);
    this.state.add('Boot', BootState, false);
    this.state.add('Menu', MenuState, false);
    // this.state.add('Game', GameState, false);
    this.state.start('Boot')
  }
}

window.game = new Game();
