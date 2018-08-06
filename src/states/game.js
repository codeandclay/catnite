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
    this.miner.body.bounce.y = config.bounceY;
    this.miner.body.bounce.x = 1;

    // Shrink physics body so that games appears to collide with body of
    // miner and not the empty pixels around him
    this.miner.body.setSize(6 , 8);
    this.miner.body.offset.y = 8;
    this.miner.body.offset.x = 6;
  }

  update() {
    //  Collide the miner with the platform
    this.physics.arcade.collide(this.miner, this.platforms, this.collidesWithPlatform, null, this);
  }

  collidesWithPlatform(){
    if(this.miner.body.velocity.x == 0) {
      this.miner.body.velocity.x = config.speed;
    }
  }

  render() { }
}
