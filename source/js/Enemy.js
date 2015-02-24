(function (window) {


    function Enemy(params) {
        this.Container_constructor();

        this.shape = new createjs.Shape();
        this.addChild(this.shape);

        this.addChild(new createjs.Bitmap(new Image(32,32)));

        this.on("tick", p.tick);
        this.xReg = 16;
        this.yReg = 16;
        this.xPos = params[0];
        this.yPos = params[1];
        this.xDir = params[2];
        this.yDir = params[3];
        this.speed = params[4];


        DeepBeat.addCollisionType(this, "Enemy");
    }
    var p = createjs.extend(Enemy, createjs.Container);
    window.Enemy = createjs.promote(Enemy, "Container")

    p.tick = function (event) {
        this.xPos += this.xDir * this.speed * DeepBeat.dt;
        this.yPos += this.yDir * this.speed * DeepBeat.dt;
        this.x = BlackholeDistortX(this.xPos, this.yPos);
        this.y = BlackholeDistortY(this.xPos, this.yPos);
        this.shape.graphics.clear();
        this.shape.graphics.beginFill("#FFFFFF");
        this.shape.graphics.moveTo(BlackholeDistortX(this.xPos - 16, this.yPos - 16) - this.x, BlackholeDistortY(this.xPos - 16, this.yPos - 16) - this.y);
        this.shape.graphics.lineTo(BlackholeDistortX(this.xPos - 16, this.yPos + 16) - this.x, BlackholeDistortY(this.xPos - 16, this.yPos + 16) - this.y);
        this.shape.graphics.lineTo(BlackholeDistortX(this.xPos + 16, this.yPos + 16) - this.x, BlackholeDistortY(this.xPos + 16, this.yPos + 16) - this.y);
        this.shape.graphics.lineTo(BlackholeDistortX(this.xPos + 16, this.yPos - 16) - this.x, BlackholeDistortY(this.xPos + 16, this.yPos - 16) - this.y);
        this.shape.graphics.endFill(); // draw the last line segment back to the start point.
    }

    p.timeToSound = function(params) {
        //return params[2] == 0 ? DeepBeat.windowHeight/2 : DeepBeat.windowWidth/2;
        return (params[2] == 0 ? DeepBeat.windowHeight/3 : DeepBeat.windowWidth/3) / params[4];
    };
    
}(window));