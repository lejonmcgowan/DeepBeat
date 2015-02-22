(function (window) {

    function Gun() {
        this.Container_constructor();

        this.on("tick", this.tick);

        this.x = 0;
        this.y = 0;

        this.laserNodes = [
            [
                this.constructLaserNode(DeepBeat.windowWidth/3, DeepBeat.windowHeight/3),
                this.constructLaserNode(DeepBeat.windowWidth/3, 2 * DeepBeat.windowHeight/3)
            ],
            [
                this.constructLaserNode(2 * DeepBeat.windowWidth/3, DeepBeat.windowHeight/3),
                this.constructLaserNode(2 * DeepBeat.windowWidth/3, 2 * DeepBeat.windowHeight/3)
            ]
        ];

        this.constructLaserLines(this.laserNodes);

        this.laserNode = {x: 0, y: 0};
        this.laserNodes[this.laserNode.x][this.laserNode.y].bitmap.alpha = 1.0;
        this.laserTimer = 0;

        this.currentDirection = null;
        this.currentAim = new createjs.Container();
        this.currentLaser = new createjs.Container();
        this.currentCollision = new createjs.Container();
        this.addChild(this.currentAim);
        this.addChild(this.currentLaser);
        this.addChild(this.currentCollision);
        
        this.x = 0;
        this.y = 0;

        DeepBeat.addKeyHandler(this, "keydown-up", function() {
            this.updateAim("up");
            this.updateLaser();
        });
        DeepBeat.addKeyHandler(this, "keydown-right", function() {
            this.updateAim("right");
            this.updateLaser();
        });
        DeepBeat.addKeyHandler(this, "keydown-down", function() {
            this.updateAim("down");
            this.updateLaser();
        });
        DeepBeat.addKeyHandler(this, "keydown-left", function() {
            this.updateAim("left");
            this.updateLaser();
        });
        DeepBeat.addKeyHandler(this, "key-up", function() {
            this.updateAim("up");
        });
        DeepBeat.addKeyHandler(this, "key-right", function() {
            this.updateAim("right");
        });
        DeepBeat.addKeyHandler(this, "key-down", function() {
            this.updateAim("down");
        });
        DeepBeat.addKeyHandler(this, "key-left", function() {
            this.updateAim("left");
        });
        DeepBeat.addKeyHandler(this, "keyup-up", function() {
            this.updateAim(null);
        });
        DeepBeat.addKeyHandler(this, "keyup-right", function() {
            this.updateAim(null);
        });
        DeepBeat.addKeyHandler(this, "keyup-down", function() {
            this.updateAim(null);
        });
        DeepBeat.addKeyHandler(this, "keyup-left", function() {
            this.updateAim(null);
        });
        DeepBeat.addKeyHandler(this, "keydown-space", function() {
            this.updatePosition();
        });
        DeepBeat.addKeyHandler(this, "keydown-mute", function() {
            // Toggle muting all audio
            createjs.Sound.setMute(!createjs.Sound.getMute());
        });


        DeepBeat.addCollisionHandler(this, this.currentCollision, "Enemy", function(other) {
            DeepBeat.removeObject(other);
        });
    }
    var p = createjs.extend(Gun, createjs.Container);
    window.Gun = createjs.promote(Gun, "Container")

    p.tick = function (event) {
        if(this.laserTimer > 0) {
            this.laserTimer -= DeepBeat.dt;
            if(this.laserTimer <= 0) {
                this.currentLaser.removeAllChildren();
                this.currentCollision.removeAllChildren();
            }
        }
    }

    p.updateAim = function(direction) {
        if(this.currentDirection == direction) {
            return;
        }
        if(this.currentDirection != null) {
            this.currentAim.removeAllChildren();
            this.currentDirection = null;
        }            
        if(direction != null) {
            var laserLine = this.laserNodes[this.laserNode.x][this.laserNode.y][direction];
            if(laserLine) {
                this.currentAim.addChild(laserLine.aim);
                this.currentDirection = direction;
            }
        }
    };

    p.updateLaser = function() {
        if(this.laserTimer <= 0 && this.laserNodes[this.laserNode.x][this.laserNode.y][this.currentDirection]) {
            this.currentLaser.addChild(this.laserNodes[this.laserNode.x][this.laserNode.y][this.currentDirection].laser);
            this.currentCollision.addChild(this.laserNodes[this.laserNode.x][this.laserNode.y][this.currentDirection].collision);
            this.laserTimer = 300;
        }
    };

    p.updatePosition = function() {
        if(this.currentDirection) {
            this.currentAim.removeAllChildren();
            this.laserNodes[this.laserNode.x][this.laserNode.y].bitmap.alpha = 0.5;
            if(this.currentDirection == "right")
                this.laserNode.x++;
            if(this.currentDirection == "left")
                this.laserNode.x--;
            if(this.currentDirection == "down")
                this.laserNode.y++;
            if(this.currentDirection == "up")
                this.laserNode.y--;
            this.laserNodes[this.laserNode.x][this.laserNode.y].bitmap.alpha = 1.0;
            this.currentDirection = null;
        }
    };

    p.constructLaserNode = function(x, y) {
        var bitmap = new createjs.Bitmap(DeepBeat.preload.getResult("gun"));
        bitmap.x = x;
        bitmap.y = y;
        bitmap.regX = 16;
        bitmap.regY = 16;
        bitmap.alpha = 0.5;
        this.addChild(bitmap);
        return {x: x, y: y, bitmap: bitmap};
    };

    p.constructLaserLines = function(laserNodes) {
        for (var i = 0; i < 2; i++) {
            for (var j = 0; j < 2; j++) {
                if(i < 1) {
                    laserNodes[i][j].right = this.constructLaserLine(laserNodes[i][j].x, laserNodes[i][j].y - 16, laserNodes[i + 1][j].x, laserNodes[i][j].y + 16);
                }
                if(j < 1) {
                    laserNodes[i][j].down = this.constructLaserLine(laserNodes[i][j].x - 16, laserNodes[i][j].y, laserNodes[i][j].x + 16, laserNodes[i][j + 1].y);
                }
                if(i > 0) {
                    laserNodes[i][j].left = this.constructLaserLine(laserNodes[i - 1][j].x, laserNodes[i][j].y - 16, laserNodes[i][j].x, laserNodes[i][j].y + 16);
                }
                if(j > 0) {
                    laserNodes[i][j].up = this.constructLaserLine(laserNodes[i][j].x - 16, laserNodes[i][j - 1].y, laserNodes[i][j].x + 16, laserNodes[i][j].y);
                }
            }
        }
    };

    p.constructLaserLine = function(startX, startY, endX, endY) {
        var width = endX - startX;
        var height = endY - startY;

        var laserAim = new createjs.Shape();
        laserAim.graphics.beginFill("#ffffff").drawRect(0, 0, width, height);
        laserAim.alpha = 0.2;
        laserAim.x = startX + 16;
        laserAim.y = startY + 16;
        laserAim.regX = 16;
        laserAim.regY = 16;

        var laser = new createjs.Shape();
        laser.graphics.beginFill("#7777ff").drawRect(0, 0, width, height);
        laser.alpha = 0.4;
        laser.x = startX + 16;
        laser.y = startY + 16;
        laser.regX = 16;
        laser.regY = 16;

        if(width < 64) {
            var laserCollisionImage = new Image(1, height);
            laserCollisionBitmap = new createjs.Bitmap(laserCollisionImage);
            laserCollisionBitmap.regX = 0;
            laserCollisionBitmap.regY = 16;
            laserCollisionBitmap.x = startX + 16;
            laserCollisionBitmap.y = startY + 16;
        } else {
            var laserCollisionImage = new Image(width, 1);
            laserCollisionBitmap = new createjs.Bitmap(laserCollisionImage);
            laserCollisionBitmap.regX = 16;
            laserCollisionBitmap.regY = 0;
            laserCollisionBitmap.x = startX + 16;
            laserCollisionBitmap.y = startY + 16;
        }

        return {
            aim: laserAim,
            laser: laser,
            collision: laserCollisionBitmap
        };
    };


}(window));