(function (window) {
    var origSize = 20;

    function Enemy(params) {
        this.Container_constructor();

        this.shape = new createjs.Shape();
        this.addChild(this.shape);

        var collision = new createjs.Bitmap(new Image(origSize, origSize));
        collision.regX = origSize / 2;
        collision.regY = origSize / 2;
        collision.x = 0;
        collision.y = 0;
        this.addChild(collision);
        //this.addChild(new createjs.Bitmap(DeepBeat.preload.getResult("enemy")));

        this.on("tick", p.tick);
        this.xReg = origSize/2;
        this.yReg = origSize/2;
        this.xPos = params[0];
        this.yPos = params[1];
        this.xDir = params[2];
        this.yDir = params[3];
        this.speed = params[4];
        this.type = params[5];
        
        this.angle = 0.2*Math.PI;

        DeepBeat.addCollisionType(this, "Enemy");
    }
    var p = createjs.extend(Enemy, createjs.Container);
    window.Enemy = createjs.promote(Enemy, "Container");

    p.tick = function (event) {

        var size = origSize;
        this.x = SSDistortX(this.xPos, this.yPos);
        this.y = SSDistortY(this.xPos, this.yPos);

        if (this.type == DeepBeat.enemyType.linear) {
            this.xPos += this.xDir * this.speed * DeepBeat.dt;
            this.yPos += this.yDir * this.speed * DeepBeat.dt;

            // Draw as red square
            this.shape.graphics.clear();
            this.shape.graphics.beginFill("#770000").beginStroke("#cc0000").setStrokeStyle(2);
            this.shape.graphics.moveTo(SSDistortX(this.xPos - size/2, this.yPos - size/2) - this.x, SSDistortY(this.xPos - size/2, this.yPos - size/2) - this.y);
            this.shape.graphics.lineTo(SSDistortX(this.xPos - size/2, this.yPos + size/2) - this.x, SSDistortY(this.xPos - size/2, this.yPos + size/2) - this.y);
            this.shape.graphics.lineTo(SSDistortX(this.xPos + size/2, this.yPos + size/2) - this.x, SSDistortY(this.xPos + size/2, this.yPos + size/2) - this.y);
            this.shape.graphics.lineTo(SSDistortX(this.xPos + size/2, this.yPos - size/2) - this.x, SSDistortY(this.xPos + size/2, this.yPos - size/2) - this.y);
            this.shape.graphics.lineTo(SSDistortX(this.xPos - size/2, this.yPos - size/2) - this.x, SSDistortY(this.xPos - size/2, this.yPos - size/2) - this.y);
            this.shape.graphics.endFill();

        } else if (this.type == DeepBeat.enemyType.wave) {
            if (this.xDir == 0) {
                this.xPos = DeepBeat.windowWidth/2 + 50 * Math.cos(this.speed/8 * this.yPos);
                this.yPos += this.yDir * this.speed * DeepBeat.dt;
            }
            if (this.yDir == 0) {
                this.xPos += this.xDir * this.speed * DeepBeat.dt;
                this.yPos = DeepBeat.windowHeight/2 + 50 * Math.cos(this.speed/8 * this.xPos);
            }

            // Draw as yellow circle
            this.shape.graphics.clear();
            this.shape.graphics.beginFill("#777700").beginStroke("#cccc00").setStrokeStyle(2);
            this.shape.graphics.drawEllipse(
                SSDistortX(this.xPos - size/1.5, this.yPos - size/1.5) - this.x,
                SSDistortY(this.xPos - size/1.5, this.yPos - size/1.5) - this.y,
                SSDistortX(this.xPos + size/1.5, this.yPos + size/1.5) - SSDistortX(this.xPos - size/1.5, this.yPos - size/1.5),
                SSDistortY(this.xPos + size/1.5, this.yPos + size/1.5) - SSDistortY(this.xPos - size/1.5, this.yPos - size/1.5))


        } else if (this.type == DeepBeat.enemyType.spiral) {
            var x = (200 * Math.cos(this.angle) * Math.pow(Math.E, 1 * this.angle));
            var y = (200 * Math.sin(this.angle) * Math.pow(Math.E, 1 * this.angle));
            if (this.xDir == 0) {
                this.xPos = y * this.yDir;
                this.yPos = x * this.yDir;
            }
            if (this.yDir == 0) {
                this.xPos = x * -this.xDir;
                this.yPos = y * this.xDir;
            }
            this.xPos += DeepBeat.windowWidth/2;
            this.yPos += DeepBeat.windowHeight/2;
            this.angle -= 0.005*this.speed*DeepBeat.dt;

            // Draw as pink diamond
            this.shape.graphics.clear();
            this.shape.graphics.beginFill("#770044").beginStroke("#cc0077").setStrokeStyle(2);
            this.shape.graphics.moveTo(SSDistortX(this.xPos, this.yPos - size/1.5) - this.x, SSDistortY(this.xPos, this.yPos - size/1.5) - this.y);
            this.shape.graphics.lineTo(SSDistortX(this.xPos - size/1.5, this.yPos) - this.x, SSDistortY(this.xPos - size/1.5, this.yPos) - this.y);
            this.shape.graphics.lineTo(SSDistortX(this.xPos, this.yPos + size/1.5) - this.x, SSDistortY(this.xPos, this.yPos + size/1.5) - this.y);
            this.shape.graphics.lineTo(SSDistortX(this.xPos + size/1.5, this.yPos) - this.x, SSDistortY(this.xPos + size/1.5, this.yPos) - this.y);
            this.shape.graphics.lineTo(SSDistortX(this.xPos, this.yPos - size/1.5) - this.x, SSDistortY(this.xPos, this.yPos - size/1.5) - this.y);
            this.shape.graphics.endFill();
        } else if (this.type == DeepBeat.enemyType.diagonal) {
            this.xPos += this.xDir * this.speed * DeepBeat.dt;
            this.yPos += this.yDir * this.speed * DeepBeat.dt;

            // Draw as orange triangle
            this.shape.graphics.clear();
            this.shape.graphics.beginFill("#774400").beginStroke("#cc7700").setStrokeStyle(2);
            this.shape.graphics.moveTo(SSDistortX(this.xPos - size/1.5, this.yPos + size/1.5) - this.x, SSDistortY(this.xPos - size/1.5, this.yPos + size/1.5) - this.y);
            this.shape.graphics.lineTo(SSDistortX(this.xPos, this.yPos - size/1.5) - this.x, SSDistortY(this.xPos, this.yPos - size/1.5) - this.y);
            this.shape.graphics.lineTo(SSDistortX(this.xPos + size/1.5, this.yPos + size/1.5) - this.x, SSDistortY(this.xPos + size/1.5, this.yPos + size/1.5) - this.y);
            this.shape.graphics.lineTo(SSDistortX(this.xPos - size/1.5, this.yPos + size/1.5) - this.x, SSDistortY(this.xPos - size/1.5, this.yPos + size/1.5) - this.y);
            this.shape.graphics.endFill();
        } else if (this.type == DeepBeat.enemyType.creeper) {
            this.xPos += this.xDir * this.speed * DeepBeat.dt;
            this.yPos += this.yDir * this.speed * DeepBeat.dt;
            if (this.xDir == 0) {
                this.yPos += 4 * Math.sin(this.speed/16 * DeepBeat.time);
            }
            if (this.yDir == 0) {
                this.xPos += 4 * Math.sin(this.speed/16 * DeepBeat.time);
            }

            // Draw as green upside-down triangle
            this.shape.graphics.clear();
            this.shape.graphics.beginFill("#007700").beginStroke("#00cc00").setStrokeStyle(2);
            this.shape.graphics.moveTo(SSDistortX(this.xPos - size/1.5, this.yPos - size/1.5) - this.x, SSDistortY(this.xPos - size/1.5, this.yPos - size/1.5) - this.y);
            this.shape.graphics.lineTo(SSDistortX(this.xPos, this.yPos + size/1.5) - this.x, SSDistortY(this.xPos, this.yPos + size/1.5) - this.y);
            this.shape.graphics.lineTo(SSDistortX(this.xPos + size/1.5, this.yPos - size/1.5) - this.x, SSDistortY(this.xPos + size/1.5, this.yPos - size/1.5) - this.y);
            this.shape.graphics.lineTo(SSDistortX(this.xPos - size/1.5, this.yPos - size/1.5) - this.x, SSDistortY(this.xPos - size/1.5, this.yPos - size/1.5) - this.y);
            this.shape.graphics.endFill();
        }
    };

    p.timeToSound = function(params) {
        //return params[2] == 0 ? DeepBeat.windowHeight/2 : DeepBeat.windowWidth/2;
        return (params[2] == 0 ? DeepBeat.windowHeight/3 : DeepBeat.windowWidth/3) / params[4];
    };
    
}(window));