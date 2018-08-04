/**
 * Import Phaser dependencies using `expose-loader`.
 * This makes then available globally and it's something required by Phaser.
 * The order matters since Phaser needs them available before it is imported.
 */

import PIXI from 'expose-loader?PIXI!phaser-ce/build/custom/pixi.js';
import p2 from 'expose-loader?p2!phaser-ce/build/custom/p2.js';
import Phaser from 'expose-loader?Phaser!phaser-ce/build/custom/phaser-split.js';

/**
 * Create a new Phaser game instance.
 * And render a single sprite so we make sure it works.
 */

console.clear();

var colors = window.colors;

var game = new Phaser.Game({
  
  antialias: false,
  crisp: true,
  // renderer: Phaser.AUTO,
  renderer: Phaser.CANVAS,
  scaleMode: Phaser.ScaleManager.SHOW_ALL,
  scaleH: 4,
  scaleV: 4,
  width: 16*10,
  height: (16*10)*9/16,
  
  state: {

    preload: function() {
      this.load.image('menu_bg', 'assets/images/menu_bg.png');
    },

    create: function() {
      this.add.image(0, 0, 'menu_bg');
    },

    render: function() {
      var debug = this.game.debug;
      // debug.scale(5, 50);
    }

  }
});
