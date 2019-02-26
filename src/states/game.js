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
    this.is_alive = true;

    // Register keys
    this.leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    this.rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);

    // Stop the following keys from propagating up to the browser
    game.input.keyboard.addKeyCapture([ Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT, Phaser.Keyboard.SPACEBAR ]);

    // Jump on keypress
    this.leftKey.onDown.add(this.handleKey, this);
    this.rightKey.onDown.add(this.handleKey, this);

    // Jump on tap
    this.input.onTap.add(this.handleTap, this);

    // Enable physics
    game.physics.startSystem(Phaser.Physics.ARCADE);

    // Add background
    this.add.image(0,0,'background');

    // Particles
    this.dirt_emitter = game.add.emitter(0, 0, 100);
    this.dirt_emitter.makeParticles('dirt');
    this.dirt_emitter.gravity = 150;
    this.dirt_emitter.minSpeed = 20;
    this.dirt_emitter.maxSpeed = 20;
    this.dirt_emitter.minAngle = -45;
    this.dirt_emitter.maxAngle = -135;

    this.blood_emitter = game.add.emitter(0, 0, 100);
    this.blood_emitter.makeParticles('blood');
    this.blood_emitter.minParticleScale = 1;
    this.blood_emitter.maxParticleScale = 2;
    this.blood_emitter.minSpeed = 5;
    this.blood_emitter.maxSpeed = 10;
    this.blood_emitter.gravity = 500;

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

    // Add background rocks
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

    // Set up SFX
    this.splats_fx = [];
    for (var i = 0; i < 6; i++) {
        this.splats_fx.push(this.sound.add('splat0'+i));
    }
    this.dollar_sfx = this.add.audio('dollar_sfx');
    this.jump_sfx = this.add.audio('jump_sfx');
    this.landings_sfx = [this.add.audio('landing_sfx_a'), this.add.audio('landing_sfx_b')];
    this.deaths_sfx = [this.add.audio('death_sfx'), this.add.audio('death_hit')];

    // Initialise empty dollars
    this.dollars = [];

    // Display score
    this.score_text = this.add.bitmapText(config.spriteSize/2, 0, 'bmp_font', '0', 16);
    this.add.bitmapText(config.width - config.spriteSize*2, 0, 'bmp_font', this.score.hi, 16);

    // Display game instructions
    var hand_y = config.height - config.spriteSize * 2;
    var instructions_text = 'Tap to jump left & right';
    this.instructions = []

    // Set minimum score to display instructions
    if(this.score.hi <= -1){
      this.instructions = [
        this.add.image(config.spriteSize, hand_y, 'hand'),
        this.add.image(config.width - config.spriteSize, hand_y, 'hand'),
        this.add.bitmapText(config.width/2, hand_y + config.spriteSize + 2, 'bmp_font', instructions_text, 16)
      ];
    }

    this.instructions.forEach(function(i){ i.anchor.setTo(0.5, 0.5)});
  }

  createCat(){
    let cat = this.cats.create(config.width + config.spriteSize, config.height - (config.spriteSize*3-1), 'cat_walk');
    cat.body.velocity.x = config.catSpeed;
    cat.body.setSize(9, 6);
    cat.body.offset.x = 4;
    cat.body.offset.y = 8;
    cat.animations.add('walk', [0, 1, 2, 3, 4, 5], 8, true);
    cat.animations.add('run', [0, 1, 2, 3, 4, 5], 12, true);
    cat.animations.play('walk');
  }

  update() {
    if(this.is_alive){
      //  Collide the miner with the platform
      this.physics.arcade.collide(this.miner, this.platforms, this.collidesWithPlatform, null, this);

      // Collide miner with cat
      this.physics.arcade.overlap(this.miner, this.cats, this.collidesWithCat, null, this);
    }

    // Place a cat at other end of screen when it walks offscreen
    this.cats.forEach(function(cat){
      if (cat.body.velocity.x < 0 && cat.x < 0 - config.spriteSize ||
          cat.body.velocity.x > 0 && cat.x > config.width + config.spriteSize) {
        this.reset(cat);
      }
    }, this);

    this.dollars.forEach(function (dollar) {
      // Scale up dollar signs as they float up screen
      dollar.scale.x += (0.03);
      dollar.scale.y += (0.03);
      dollar.y -= 1.75;
      // Recycle dollar signs
      if (dollar.y < 0 - config.spriteSize * 3) { // Allow scaled dollars to travel all the way off screen
        dollar.destroy()
      }
    }, this);

    // Display updated score
    this.score_text.text = this.score.total;
  }

  reset(cat){
    var rand = _.random(1, 10, false);
    var catVelocityIncrease = config.catVelocityIncrease;
    if(rand > config.randomVelocityThreshold){
      catVelocityIncrease *= 3;
    }
    cat.body.velocity.x *= _.sample([-1, 1]);
    if(cat.body.velocity.x < 0){
      cat.x = config.width + config.spriteSize;
      cat.scale.x = 1;
      cat.body.velocity.x -= catVelocityIncrease;
    } else {
      cat.x = 0 - config.spriteSize;
      cat.scale.x = -1;
      cat.body.velocity.x += catVelocityIncrease;
    }
    // Change cat texture to running if over a certain speed
    if(Math.abs(cat.body.velocity.x) >= config.catRunningSpeed && !cat.running){
      cat.running = true;
      cat.loadTexture('cat_run');
      cat.animations.play('run');
    }
  }

  collidesWithPlatform(){
    if(!this.can_jump){
      // Miner kicks up some dirt when landing on platform
      this.landings_sfx.forEach(function(sfx){ sfx.play() });
      this.dirt_emitter.x = this.miner.x;
      this.dirt_emitter.y = this.miner.body.y + (config.spriteSize/2) - 4;
      this.dirt_emitter.start(true, 300, null, 5);
    }
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
      var splat_fx = _.sample(this.splats_fx);
      // spawn a dollar
      var dollar = this.add.image(cat.x, cat.y - config.spriteSize/2, 'tiles');
      dollar.anchor.setTo(0.5, 0.5);
      dollar.frame = 0;
      this.dollars.push(dollar);
      // play sfx
      splat_fx.play();
      this.dollar_sfx.play();
      // blood
      this.blood_emitter.x = cat.x;
      this.blood_emitter.y = cat.y + 4;
      this.blood_emitter.start(true, 500, null, 20);
      // reuse cat
      this.reset(cat);
    } else {
      // game over -- kill miner
      this.deaths_sfx.forEach(function(sfx){  sfx.play() });
      miner.body.collideWorldBounds = false;
      this.can_jump = false;
      this.is_alive = false;
      // bounce miner into the air
      miner.body.velocity.y = -300;
      miner.body.velocity.x = cat.body.velocity.x * 2;
      // display gameover text
      var gameover = this.add.image(config.width/2, config.height + config.spriteSize*2, 'game_over_text');
      gameover.anchor.setTo(0.5,0.5);
      var tween = game.add.tween(gameover);
      tween.to({ y: config.height/2 - config.spriteSize/2 }, 300, 'Bounce', true, 0);
      // return to menu
      this.time.events.add(1500, function(){ this.state.start('Menu') }, this);
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

  handleTap(tap){
    var direction;

    if(tap.x <= config.width/2) {
      direction = 'left';
    } else if(tap.x > config.width/2) {
      direction = 'right';
    }

    this.jump(direction);
  }

  handleKey(input){
    var direction;

    if(input.event.key == 'ArrowLeft') {
      direction = 'left';
    } else if(input.event.key == 'ArrowRight') {
      direction = 'right';
    }

    this.jump(direction);
  }

  jump(direction){
    // First hide any instructions
    this.instructions.forEach(function(i){
      this.add.tween(i).to({ y: config.height + config.spriteSize*2 }, 300, 'Linear', true, 0);
    }.bind(this));

    if(this.can_jump){
      this.switchDirection(direction);
      this.jump_sfx.play();
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
