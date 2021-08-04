
var canvas;
var ctx;
let bestScore = 0;

class gameCanvas {
    halfdis = 100;
    constructor(src1, src2, src3, src4) {
        //game score
        this.score = 0;

        //background
        this.image = new Image();
        this.image.src = src1; 
        this.bwidth = 480;
        this.bheight = 640-128/2;

        //ground need 13 for 1 across
        this.gndimage = new Image();
        this.gndimage.src = src2;
        this.slideoff = 0;

        //load pipes
        this.tpipeimage = new Image();
        this.tpipeimage.src = src4; //top
        this.bpipeimage = new Image();
        this.bpipeimage.src = src3; //bottom
        this.passpoints = [[480, this.rdm()],[780, this.rdm()],[1080, this.rdm()],[1380, this.rdm()]];

        //random flags/counters
        this.bugflag = 0;
        this.startflag = 0;
        this.startcounter = 0;
        this.hitflag = false;
        this.alphaflag = 0;
        this.alpha = 0;
        this.bestscore = 0;

        //load the logo
        this.logoim = new Image();
        this.logoim.src = "./imgs/logo.png";

        //load the score & ETC
        this.scoreboardim = new Image();
        this.scoreboardim.src = './imgs/score.png';
        this.replayim = new Image();
        this.replayim.src = './imgs/start_end.png';
    }
    redraw() {
        //check collion and set hitflag
        this.hitflag = this.hitflag || this.collider(flappyBird.x, flappyBird.y, 0);

        //draws background
        ctx.drawImage(this.image, 0, 0, this.image.width, this.image.height, 0, 0, this.bwidth, this.bheight);

        //draw the pipes
        if (this.startflag == 1){
            if (this.startcounter >= 50){
                for(let i = 0; i < 4; i++){
                    //bottom
                    ctx.drawImage(this.bpipeimage, 0, 0, this.bpipeimage.width, this.bpipeimage.height, this.passpoints[i][0], this.passpoints[i][1]+0+this.halfdis, this.bpipeimage.width/2, this.bpipeimage.height/2);
                    // ctx.beginPath();
                    // ctx.strokeStyle = "red";
                    // ctx.lineWidth = 2;
                    // ctx.rect(this.passpoints[i][0], this.passpoints[i][1]+0+this.halfdis, this.bpipeimage.width/2, this.bpipeimage.height/2);
                    // ctx.stroke();
                    //top
                    ctx.drawImage(this.tpipeimage, 0, 0, this.tpipeimage.width, this.tpipeimage.height, this.passpoints[i][0], this.passpoints[i][1]-390-this.halfdis, this.tpipeimage.width/2, this.tpipeimage.height/2);
                    if (this.hitflag == false){
                        if (this.passpoints[i][0] == this.bwidth*0.8){
                            this.bugflag == 0 ? this.bugflag = 1 : this.score += 1;
                        }
                        if (this.passpoints[i][0] <= -120){
                            this.passpoints[i][0] = 1080;
                            this.passpoints[i][1] = this.rdm(); 
                        } else {
                            this.passpoints[i][0] -= 3;
                        }
                    }
                }
            } else {
                // wait
                this.startcounter += 1;
            }
        }

        //draws ground 
        if (this.hitflag == false){
            if (this.slideoff <= -37){
                this.slideoff = 0;
            } else {
                this.slideoff -= 3;
            }
        }
            for(let i = -1; i < 15; i++){
                ctx.drawImage(this.gndimage, 0, 0, this.gndimage.width, this.gndimage.height, i*37+this.slideoff, 640-70, this.gndimage.width, 2.5*this.gndimage.height/4);
            }


        //draws score 
        ctx.font = "60px Kimberley";
        ctx.textAlign = "center"; 
        ctx.fillStyle = 'white';
        ctx.fillText(this.score, this.bwidth/2, this.bheight*1/5);

        //draws logo at start
        if (this.startflag == 0){
            ctx.drawImage(this.logoim, 0, 0, this.logoim.width, this.logoim.height, canvas.width/2-this.logoim.width, this.bheight*1/5+50, this.logoim.width*2, this.logoim.height*2);
        }


        //death white animation
        if (this.hitflag == true){
            if (this.alphaflag == 0){
                if (this.alpha < 1){
                    this.alpha += 0.2;
                } else {
                    this.alphaflag = 1;
                }
            } else if (this.alphaflag == 1){
                if (this.alpha > 0){
                    if (this.alpha - 0.1 >= 0){
                        this.alpha -= 0.2;
                    } else {
                        this.alpha = 0;
                    }
                } else {
                    this.alphaflag = 2;
                    // this.alpha = 0;
                }
            }
        }
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.stroke();
        ctx.globalAlpha = 1;


        //end screen
        if (this.alphaflag == 2){
            ctx.drawImage(this.scoreboardim, 0, 0, this.scoreboardim.width, this.scoreboardim.height, canvas.width/2-this.scoreboardim.width/2, this.bheight*1/5-50, this.scoreboardim.width, this.scoreboardim.height);
            ctx.drawImage(this.replayim, 0, 0, this.replayim.width, this.replayim.height, canvas.width/2-this.replayim.width, 3*canvas.height/5, this.replayim.width*2, this.replayim.height*2);
            ctx.font = "50px Kimberley";
            ctx.textAlign = "center"; 
            ctx.fillStyle = 'black';
            ctx.fillText(this.score, canvas.width/2, 1*canvas.height/5+45, this.bheight*1/5);
            if (this.score > bestScore){
                bestScore = this.score;
            }
            ctx.fillText(bestScore, canvas.width/2, 2*canvas.height/5-5, this.bheight*1/5);
        }
    }
    collider(x,y,r=0) {
        "returns boolean True if collision detected else False"
        //check for ground collision.
        if (y+r+20 > 640-70){
            return true;
        }
        // check for pipe collision.
        for(let i = 0; i < 4; i++){
            if (x+r > this.passpoints[i][0] && x-r < this.passpoints[i][0] + this.tpipeimage.width/2){ //if within width of pipe
                if (y+r > this.passpoints[i][1]+0+this.halfdis || y-r < this.passpoints[i][1]+0-this.halfdis){
                    return true;
                }
            }
        }
        return false;
    }
    rdm() {
        "create the randomness for the pipes"
        return Math.random()*(420-140)+140;
    }

}


class birdy {
    constructor(src) {
        this.image = new Image();
        this.image.src = './imgs/bird.png';
        this.newheight = 64/2;
        this.newwidth = 92/2;
        this.x = 220;
        this.y = 0;
        this.vy = 0;
        this.ay = 0.40;
        this.jay = 0;  
        this.offset = [0, 92, 184];
        this.idx = 0;
        this.counter = 0;

        this.t = 0;
        this.vt = 0;
        this.at = Math.PI/360;
        this.jat = 0.;

        this.prestartCount = 0;
    }
    redraw() {

        if (Game.startflag == 1){
            //jumping
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

            //angle
            this.vt += this.at;
            this.vt += this.jat;
            if (this.jat < 0) {
                this.jat += 0.032;
            }
            this.t += this.vt;
            if (this.t >= Math.PI/2){
                this.t = Math.PI/2;
            } 
            if (this.t <= -Math.PI/4) {
                this.t = -Math.PI/4;
            }

            this.floortest();

            ctx.setTransform(1, 0, 0, 1, this.x, this.y); // sets scale and origin
            var angle = this.t; //this.t;
            ctx.rotate(angle);
            
            // let x = this.x*Math.cos(-angle)-this.y*Math.sin(-angle);
            // let y = this.y*Math.cos(-angle)+this.x*Math.sin(-angle);

            ctx.drawImage(this.image, this.offset[this.idx], 0, this.image.width/3, this.image.height, -92/4, -64/4, this.newwidth, this.newheight);
            ctx.rotate(-angle);  //revert rotation 
            ctx.setTransform(1, 0, 0, 1, 0, 0); //revert transform

            ctx.beginPath();
            ctx.strokeStyle = "red";
            ctx.lineWidth = 2;
            ctx.rect(flappyBird.x, flappyBird.y, 1, 1);
            ctx.stroke();

            // ctx.beginPath();
            // ctx.strokeStyle = "red";
            // ctx.lineWidth = 2;
            // ctx.rect(this.x-15, this.y-10, 25, 25);
            // ctx.stroke();
        } else {
            if (this.prestartCount == 2*Math.PI) {
                this.prestartCount = 0;
            } else {
                this.prestartCount += 2*Math.PI/360*7;
            }
            ctx.drawImage(this.image, this.offset[this.idx], 0, this.image.width/3, this.image.height, this.x, Game.bheight/2+15*Math.cos(this.prestartCount), this.newwidth, this.newheight);
            this.y = Game.bheight/2+15*Math.cos(this.prestartCount);
        }
    }
    jump() {
        if (Game.hitflag == false){
            this.vy = 0;
            this.jay = -5.0;
            this.ay = 0.40;

            this.vt = 0;
            this.jat = -20 *Math.PI/360;
            this.at = Math.PI/360;
        }

    }
    floortest() {
        if (this.y + this.newheight + 55>= canvas.height) {
            this.y = canvas.height - this.newheight - 55;
        }
    }
}


function startGame() {
    Game = new gameCanvas('./imgs/background.png', './imgs/ground.png', './imgs/pipebottom.png', './imgs/pipetop.png');
    flappyBird = new birdy('./imgs/bird.png');
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
        Game.startflag == 0 ? Game.startflag = 1 :
        pressFlag = 1;
        flappyBird.jump();
        // console.log('Space downpressed');
    }
    if (keyHandler.code === 'Space' && Game.alphaflag == 2){
        stop();
        startGame();
    }
});

window.addEventListener('mousedown', function keyHandler(e) {
    // I got mouse positioning code from: https://dustinpfister.github.io/2019/03/14/canvas-position/
    var bx = e.target.getBoundingClientRect();
    x = e.clientX - bx.left;
    y = e.clientY - bx.top;
    //hovering over the replay button
    if (x > 125 && x < 230 && y > 385 && y < 435 && Game.alphaflag == 2){
        stop();
        startGame();
    }
    Game.startflag == 0 ? Game.startflag = 1 :
    flappyBird.jump();
});

window.addEventListener('keyup', keyHandler => {
    if (keyHandler.code === 'Space' && pressFlag == 1) {
        pressFlag = 0;
        // console.log('Space uppressed');
    }
});
