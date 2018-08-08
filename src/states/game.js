import config from '../config'
import _ from 'lodash'
import Score from '../lib/score'

export default class extends Phaser.State {
  init() { }
  preload() { }

  create() {
    this.score = new Score();

    // Flags
    this.can_jump = false;

    // Register keys
    this.leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    this.rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);

    // Stop the following keys from propagating up to the browser
    game.input.keyboard.addKeyCapture([ Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT, Phaser.Keyboard.SPACEBAR ]);

    // Jump on keypress
    this.leftKey.onDown.add(this.jump, this);
    this.rightKey.onDown.add(this.jump, this);

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
    this.miner = this.add.sprite(config.spriteSize*0.5, 0, 'miner');
    this.miner.animations.add('walk', [0, 1, 2, 3], 12, true);
    this.miner.animations.add('jump', [5, 6], 5, false);
    this.miner.animations.play('walk');

    this.physics.arcade.enable(this.miner);
    this.miner.body.gravity.y = config.gravity;
    this.miner.body.collideWorldBounds = true;
    this.miner.body.onWorldBounds = new Phaser.Signal();
    this.miner.body.onWorldBounds.add(this.flipMiner, this);
    this.miner.body.bounce.y = config.bounceY;
    this.miner.body.bounce.x = 1;

    // Shrink physics body so that games appears to collide with body of
    // miner and not the empty pixels around him
    this.miner.body.setSize(6 , 8);
    this.miner.anchor.x = 0.5;
    this.miner.body.offset.y = 8;
    this.miner.body.offset.x = 6;

    // Add cats
    this.cats = this.add.group();
    this.cats.enableBody = true;

    // Create two cats
    // Create one straight away
    this.createCat();
    // Then another n seconds later
    this.time.events.add(config.catInterval, this.createCat, this);
  }

  createCat(){
    let cat = this.cats.create(config.width + config.spriteSize, config.height - (config.spriteSize*3-1), 'cat_walk');
    cat.body.velocity.x = config.catSpeed;
    cat.body.setSize(9, 6);
    cat.body.offset.x = 4;
    cat.body.offset.y = 8;
    cat.animations.add('walk', [0, 1, 2, 3, 4, 5], 8, true);
    cat.animations.play('walk');
  }

  update() {
    //  Collide the miner with the platform
    this.physics.arcade.collide(this.miner, this.platforms, this.collidesWithPlatform, null, this);

    // Collide miner with cat
    this.physics.arcade.overlap(this.miner, this.cats, this.collidesWithCat, null, this);

    // Place a cat at other end of screen when it walks offscreen
    this.cats.forEach(function(cat){
      if (cat.body.velocity.x < 0 && cat.x < 0 - config.spriteSize ||
          cat.body.velocity.x > 0 && cat.x > config.width + config.spriteSize) {
        this.reset(cat);
      }
    }, this);
  }

  reset(cat){
    cat.body.velocity.x *= _.sample([-1, 1]);
    if(cat.body.velocity.x < 0){
      cat.x = config.width + config.spriteSize;
      cat.scale.x = 1;
      cat.body.velocity.x -= config.catVelocityIncrease;
    } else {
      cat.x = 0 - config.spriteSize;
      cat.scale.x = -1;
      cat.body.velocity.x += config.catVelocityIncrease;
    }
  }

  collidesWithPlatform(){
    this.can_jump = true;
    if(this.miner.body.velocity.x == 0) {
      this.miner.body.velocity.x = config.speed;
    }
  }

  collidesWithCat(miner, cat){
    if(!this.can_jump && miner.body.velocity.y > 0) {
      // increment score
      this.score.increment();
      // kill cat
      this.reset(cat);
    } else {
      // game over
      this.state.start('Menu');
    }
  }

  flipMiner(){
    this.miner.scale.x *= -1;
  }

  switchDirection(direction){
    if(direction == 'left' && this.miner.body.velocity.x > 0 ||
       direction == 'right' && this.miner.body.velocity.x < 0){
      this.miner.body.velocity.x *= -1;
      this.flipMiner();
    }
  }

  jump(input){
    let directions = {
      'ArrowLeft': 'left',
      'ArrowRight': 'right'
    }

    if(this.can_jump){
      this.switchDirection(directions[input.event.key]);
      this.miner.body.velocity.y = config.jumpStrength;
      this.miner.animations.play('jump').onComplete.add(function(){
        this.miner.animations.play('walk');
      }, this);
      this.can_jump = false;
    }
  }

  render() {
   // game.debug.body(this.miner);
  }
}
