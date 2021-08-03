
var canvas;
var ctx;


class gameCanvas {
    constructor(src) {
        this.image = new Image();
        this.image.src = src; 
        this.bwidth = 480;
        this.bheight = 640;
    }
    redraw() {
        ctx.drawImage(this.image, 0, 0, this.image.width, this.image.height, 0, 0, this.bwidth, this.bheight);
    }
}


class birdy {
    constructor(src) {
        this.image = new Image();
        // this.image.src = document.getElementById('bird');
        // this.image.onload = function() {
        //     document.getElementById('bird').setAttribute('src', this.src);
        // }
        this.image.src = '../imgs/bird.png';
        this.newheight = 64/2;
        this.newwidth = 92/2;
        this.x = 100;
        this.y = 0;
        this.vy = 0;
        this.ay = 0.40;
        this.jay = 0;  
        this.offset = [0, 92, 184];
        this.idx = 0;
        this.counter = 0;

        this.t = 0;
        this.vt = -Math.PI/360;
        this.at = 0.1;
    }
    redraw() {
        if (this.counter >= 5) {
            if (this.idx >= 2){
                this.idx = 0;
            } else {
                this.idx += 1;
            }
            this.counter = 0;
        } else {
            this.counter += 1;
        }
        this.vy += this.ay;
        this.vy += this.jay;
        if (this.jay < 0) {
            this.jay += 1.1;
        }
        this.y += this.vy;


        this.vt += this.at;
        this.t += this.vt;
        this.floortest();

        this.x = 0;
        this.y = 0;
        ctx.setTransform(1, 0, 0, 1, this.x+92/4, this.y+64/4); // sets scale and origin
        var angle = 0;//this.t;
        ctx.rotate(angle);
        
        // let x = this.x*Math.cos(-angle)-this.y*Math.sin(-angle);
        // let y = this.y*Math.cos(-angle)+this.x*Math.sin(-angle);

        ctx.drawImage(this.image, this.offset[this.idx], 0, this.image.width/3, this.image.height, 0, 0, this.newwidth, this.newheight);
        ctx.rotate(-angle);  //revert rotation 
        ctx.setTransform(1, 0, 0, 1, 0, 0); //revert transform
    }
    jump() {
        this.vy = 0;
        this.jay = -5.0;
        this.ay = 0.40;


    }
    floortest() {
        if (this.y + this.newheight >= canvas.height) {
            this.y = canvas.height - this.newheight;
        }
    }
}

Game = new gameCanvas("../imgs/background.png");
flappyBird = new birdy('../imgs/bird.png');
function startGame() {
    console.log("Starting...");
    canvas = document.getElementById("TC");
    canvas.width = 480;
    canvas.height = 640;
    ctx = canvas.getContext("2d");
    interval = setInterval(clearCanvas, 20);
}

clearCanvas = () => {
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    Game.redraw();
    flappyBird.redraw();
}

stop = () => {
    clearInterval(this.interval);
}


var pressFlag = 0;
window.addEventListener('keydown', keyHandler => {
    if (keyHandler.code === 'Space' && pressFlag == 0) {
        pressFlag = 1;
        flappyBird.jump();
        console.log('Space downpressed');
    }
});

window.addEventListener('keyup', keyHandler => {
    if (keyHandler.code === 'Space' && pressFlag == 1) {
        pressFlag = 0;
        console.log('Space uppressed');
    }
});