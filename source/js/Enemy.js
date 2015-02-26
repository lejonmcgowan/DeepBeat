(function (window) {
    var size = 20;

    function Enemy(params) {
        this.Container_constructor();

        this.shape = new createjs.Shape();
        this.addChild(this.shape);

        this.addChild(new createjs.Bitmap(new Image(size, size)));
        //this.addChild(new createjs.Bitmap(DeepBeat.preload.getResult("enemy")));

        this.on("tick", p.tick);
        this.xReg = size/2;
        this.yReg = size/2;
        this.xPos = params[0];
        this.yPos = params[1];
        this.xDir = params[2];
        this.yDir = params[3];
        this.speed = params[4];
        this.type = params[5];

        DeepBeat.addCollisionType(this, "Enemy");
    }
    var p = createjs.extend(Enemy, createjs.Container);
    window.Enemy = createjs.promote(Enemy, "Container");

    p.tick = function (event) {
        if (this.type == DeepBeat.enemyType.linear) {
            this.xPos += this.xDir * this.speed * DeepBeat.dt;
            this.yPos += this.yDir * this.speed * DeepBeat.dt;
        } else if (this.type == DeepBeat.enemyType.wave) {
            if (this.xDir == 0) {
                this.xPos = DeepBeat.windowWidth/2 + 50 * Math.cos(this.speed/3 * this.yPos);
                this.yPos += this.yDir * this.speed * DeepBeat.dt;
            }
            if (this.yDir == 0) {
                this.xPos += this.xDir * this.speed * DeepBeat.dt;
                this.yPos = DeepBeat.windowHeight/2 + 50 * Math.cos(this.speed/3 * this.xPos);
            }
        }
        
        this.x = BlackholeDistortX(this.xPos, this.yPos);
        this.y = BlackholeDistortY(this.xPos, this.yPos);
        this.shape.graphics.clear();
        this.shape.graphics.beginFill("#AA0000");
        this.shape.graphics.moveTo(BlackholeDistortX(this.xPos - size/2, this.yPos - size/2) - this.x, BlackholeDistortY(this.xPos - size/2, this.yPos - size/2) - this.y);
        this.shape.graphics.lineTo(BlackholeDistortX(this.xPos - size/2, this.yPos + size/2) - this.x, BlackholeDistortY(this.xPos - size/2, this.yPos + size/2) - this.y);
        this.shape.graphics.lineTo(BlackholeDistortX(this.xPos + size/2, this.yPos + size/2) - this.x, BlackholeDistortY(this.xPos + size/2, this.yPos + size/2) - this.y);
        this.shape.graphics.lineTo(BlackholeDistortX(this.xPos + size/2, this.yPos - size/2) - this.x, BlackholeDistortY(this.xPos + size/2, this.yPos - size/2) - this.y);
        this.shape.graphics.endFill(); // draw the last line segment back to the start point.
    };

    p.timeToSound = function(params) {
        //return params[2] == 0 ? DeepBeat.windowHeight/2 : DeepBeat.windowWidth/2;
        return (params[2] == 0 ? DeepBeat.windowHeight/3 : DeepBeat.windowWidth/3) / params[4];
    };
    
}(window));