export default class extends Phaser.State {
  init() {
    this.stage.backgroundColor = '#3f2832';
  }

  preload() {
    this.load.image('loaderBg', './assets/images/loader-bg.png');
    this.load.image('loaderBar', './assets/images/loader-bar.png');
  }

  render() {
      this.state.start('Splash');
  }
}
