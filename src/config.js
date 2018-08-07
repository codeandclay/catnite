export default {
  antialias: false,
  crisp: true,
  renderer: Phaser.CANVAS,
  scaleMode: Phaser.ScaleManager.SHOW_ALL,
  width: 16*10,
  height: (16*10)*9/16,
  spriteSize: 16,
  gravity: 800,
  speed: 48,
  bounceY: 0.4,
  jumpStrength: -180,
  catSpeed: -32,
  catInterval: 2500 // Number of ms between cat creation
}
