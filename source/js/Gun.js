(function (window) {
    var gunSize = 32;
    var laserSize = 32; // TODO reduce laser size?
    var laserDuration = 100;

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
        if(this.laserTimer <= 0) {
            this.currentLaser.addChild(laserLine.laser);
            this.currentCollision.addChild(laserLine.collision);
            this.laserTimer = laserDuration;
        }
    };

    p.constructLaserNode = function(x, y) {
        var bitmap = new createjs.Bitmap(DeepBeat.preload.getResult("gun"));
        bitmap.x = x;
        bitmap.y = y;
        bitmap.regX = gunSize/2;
        bitmap.regY = gunSize/2;
        this.addChild(bitmap);
        return {x: x, y: y, bitmap: bitmap};
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
        laser.graphics.beginFill("#7777ff").drawRect(0, 0, width, height);
        laser.alpha = 0.4;
        laser.x = startX + gunSize/2;
        laser.y = startY + gunSize/2;
        laser.regX = gunSize/2;
        laser.regY = gunSize/2;

        if(width < 64) {
            var laserCollisionImage = new Image(1, height);
            laserCollisionBitmap = new createjs.Bitmap(laserCollisionImage);
            laserCollisionBitmap.regX = 0;
            laserCollisionBitmap.regY = gunSize/2;
            laserCollisionBitmap.x = startX + gunSize/2;
            laserCollisionBitmap.y = startY + gunSize/2;
        } else {
            var laserCollisionImage = new Image(width, 1);
            laserCollisionBitmap = new createjs.Bitmap(laserCollisionImage);
            laserCollisionBitmap.regX = gunSize/2;
            laserCollisionBitmap.regY = 0;
            laserCollisionBitmap.x = startX + gunSize/2;
            laserCollisionBitmap.y = startY + gunSize/2;
        }

        return {
            laser: laser,
            collision: laserCollisionBitmap
        };
    };


}(window));