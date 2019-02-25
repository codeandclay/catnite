/**
 * Import Phaser dependencies using `expose-loader`.
 * This makes then available globally and it's something required by Phaser.
 * The order matters since Phaser needs them available before it is imported.
 */

import PIXI from 'expose-loader?PIXI!phaser-ce/build/custom/pixi.js';
import p2 from 'expose-loader?p2!phaser-ce/build/custom/p2.js';
import Phaser from 'expose-loader?Phaser!phaser-ce/build/custom/phaser-split.js';

import BootState from './states/boot';
import SplashState from './states/splash';
import MenuState from './states/menu';
import ClickPromptState from './states/click_prompt';
import GameState from './states/game';

import config from './config';

/**
 * Create a new Phaser game instance.
 * And render a single sprite so we make sure it works.
 */

console.clear();

var colors = window.colors;

class Game extends Phaser.Game {
  constructor () {
    super(config);

    this.state.add('Boot', BootState, false);
    this.state.add('Splash', SplashState, false);
    this.state.add('ClickPrompt', ClickPromptState, false);
    this.state.add('Menu', MenuState, false);
    this.state.add('Game', GameState, false);
    this.state.start('Boot');
    // with Cordova with need to wait that the device is ready so we will call the Boot state in another file
    if (!window.cordova) {
      this.state.start('Boot')
    }
  }
}

window.game = new Game();

if (window.cordova) {
  var app = {
    initialize: function () {
      document.addEventListener(
        'deviceready',
        this.onDeviceReady.bind(this),
        false
      )
    },

    // deviceready Event Handler
    //
    onDeviceReady: function () {
      this.receivedEvent('deviceready');

      // When the device is ready, start Phaser Boot state.
      window.game.state.start('Boot');
    },

    receivedEvent: function (id) {
      console.log('Received Event: ' + id);
    }
  }

  app.initialize();
}
