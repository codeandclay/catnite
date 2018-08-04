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
  scaleMode: Phaser.ScaleManager.USER_SCALE,
  scaleH: 4,
  scaleV: 4,
  width: 192,
  height: 160,
  
  state: {

    preload: function() {
      this.load.baseURL = 'https://cdn.jsdelivr.net/gh/samme/phaser-examples-assets@v2.0.0/assets/';
      this.load.crossOrigin = 'anonymous';
      this.load.image('dude', 'sprites/phaser-dude.png');
      this.load.image('grid', 'tests/debug-grid-1920x1920.png');
    },

    create: function() {
      this.add.image(0, 0, 'grid');
      this.add.sprite(0, 0, 'dude');
    },

    render: function() {
      var debug = this.game.debug;
      // debug.scale(5, 50);
    }

  }
});
