import config from '../config'

export default class extends Phaser.State {
  init() { }
  preload() { }

  create() {
    // Enable physics
    game.physics.startSystem(Phaser.Physics.ARCADE);

    // Add background
    this.add.image(0,0,'background');
    var yPos = config.height - config.spriteSize;
    for ( var xPos = 0; xPos < config.width; xPos+=config.spriteSize ) {
        let ground = this.add.image(xPos, yPos, 'tiles');
        ground.frame = 13;
    }

    // Set up platforms
    this.platforms = this.add.group();
    this.platforms.enableBody = true; // Enables physics for all bodies in group
    var yPos = config.height - config.spriteSize*2;
    for ( var xPos = 0; xPos < config.width; xPos+=config.spriteSize ) {
        let ground = this.platforms.create(xPos, yPos, 'tiles');
        ground.frame = 8;
        ground.body.immovable = true;
    }

    // Add miner
    this.miner = this.add.sprite(0, 0, 'miner');
    this.miner.animations.add('walk', [0, 1, 2, 3], 12, true);
    this.miner.animations.play('walk');

    this.physics.arcade.enable(this.miner);
    this.miner.body.gravity.y = config.gravity;
    this.miner.body.collideWorldBounds = true;
  }

  update() {
    //  Collide the miner with the platform
    game.physics.arcade.collide(this.miner, this.platforms);
  }

  render() { }
}
