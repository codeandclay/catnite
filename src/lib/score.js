import config from '../config';

export default class {
    constructor(){
        this.total = 0;
        this.hi = localStorage.getItem(config.localStorageName) || 0;
    }

    increment(total = 10){
        this.total += total;
        this.updateHiScore();
    }

    updateHiScore(){
        if(this.total <= this.hi) {
            return;
        }
        localStorage.setItem(config.localStorageName, this.total);
    }
}
