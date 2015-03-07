(function (window) {
    var gunSize = 32;
    var laserSize = 32; // TODO reduce laser size?
    var laserDuration = 150;

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

        this.laserTimer = 0;

        this.currentLaser = new createjs.Container();
        this.currentCollision = new createjs.Container();

        this.addChild(this.currentLaser);
        this.addChild(this.currentCollision);
        
        this.x = 0;
        this.y = 0;



        DeepBeat.addKeyHandler(this, "keydown-up", function() {
            this.updateLaser(this.laserNodes[0][0].right);
        });
        DeepBeat.addKeyHandler(this, "keydown-right", function() {
            this.updateLaser(this.laserNodes[1][0].down);
        });
        DeepBeat.addKeyHandler(this, "keydown-down", function() {
            this.updateLaser(this.laserNodes[0][1].right);
        });
        DeepBeat.addKeyHandler(this, "keydown-left", function() {
            this.updateLaser(this.laserNodes[0][0].down);
        });

        DeepBeat.addKeyHandler(this, "keydown-mute", function() {
            // Toggle muting all audio
            createjs.Sound.setMute(!createjs.Sound.getMute());
        });

        DeepBeat.addCollisionHandler(this, this.currentCollision, "Enemy", function(other) {
            DeepBeat.removeObject(other);
            DeepBeat.currentLevel.health.incrementHealth(2);
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

    p.updateLaser = function(laserLine) {
        // Place laser in new direction
        if (this.laserTimer > 0) {
            this.currentLaser.removeAllChildren();
            this.currentCollision.removeAllChildren();
            this.laserTimer = 0;
        }
        this.currentLaser.addChild(laserLine.laser);
        this.currentCollision.addChild(laserLine.collision);
        this.laserTimer = laserDuration;
        DeepBeat.currentLevel.health.decrementHealth(1); // Lose health whenever shoot laser but earn equal amount back if hit enemy. This way user can't spam
    };

    p.constructLaserNode = function(x, y) {
        var shape = new createjs.Shape();
        shape.x = x;
        shape.y = y;
        shape.regX = 0;
        shape.regY = 0;
        shape.graphics.clear();
        shape.graphics.beginFill("#2DBEFB");
        shape.graphics.beginStroke("#2DFEFB");
        shape.graphics.setStrokeStyle(2);
        shape.graphics.drawCircle(0,0,gunSize/2 - 5);
        shape.graphics.beginFill("#2DFEFB");
        shape.graphics.drawCircle(0,0,gunSize/2 - 10);
        this.addChild(shape);
        return {x: x, y: y, shape: shape};
    };

    p.constructLaserLines = function(laserNodes) {
        for (var i = 0; i < 2; i++) {
            for (var j = 0; j < 2; j++) {
                if(i < 1) {
                    laserNodes[i][j].right = this.constructLaserLine(laserNodes[i][j].x, laserNodes[i][j].y - laserSize/2, laserNodes[i + 1][j].x, laserNodes[i][j].y + laserSize/2);
                }
                if(j < 1) {
                    laserNodes[i][j].down = this.constructLaserLine(laserNodes[i][j].x - laserSize/2, laserNodes[i][j].y, laserNodes[i][j].x + laserSize/2, laserNodes[i][j + 1].y);
                }
                if(i > 0) {
                    laserNodes[i][j].left = this.constructLaserLine(laserNodes[i - 1][j].x, laserNodes[i][j].y - laserSize/2, laserNodes[i][j].x, laserNodes[i][j].y + laserSize/2);
                }
                if(j > 0) {
                    laserNodes[i][j].up = this.constructLaserLine(laserNodes[i][j].x - laserSize/2, laserNodes[i][j - 1].y, laserNodes[i][j].x + laserSize/2, laserNodes[i][j].y);
                }
            }
        }
    };

    p.constructLaserLine = function(startX, startY, endX, endY) {
        var width = endX - startX;
        var height = endY - startY;

        var laser = new createjs.Shape();
        var laserCollisionBitmap;


        if(width < 64) {
            laser.graphics.beginFill("#2DFEFB").drawRoundRect(10, -gunSize/2 + 10, width - 20, height + gunSize - 20, 10);
            laser.alpha = 0.5;
            laser.x = startX
            laser.y = startY

            var laserCollisionImage = new Image(12, height);
            laserCollisionBitmap = new createjs.Bitmap(laserCollisionImage);
            laserCollisionBitmap.x = startX + 10;
            laserCollisionBitmap.y = startY;
            laserCollisionBitmap.regX = 0;
            laserCollisionBitmap.regY = 0;
        } else {
            laser.graphics.beginFill("#2DFEFB").drawRoundRect(-gunSize/2 + 10, 10, width + gunSize - 20, height-20, 10);
            laser.alpha = 0.5;
            laser.x = startX
            laser.y = startY

            var laserCollisionImage = new Image(width, 12);
            laserCollisionBitmap = new createjs.Bitmap(laserCollisionImage);
            laserCollisionBitmap.x = startX;
            laserCollisionBitmap.y = startY + 10;
            laserCollisionBitmap.regX = 0;
            laserCollisionBitmap.regY = 0;
        }

        return {
            laser: laser,
            collision: laserCollisionBitmap
        };
    };


}(window));