(function (window) {
    var gunSize = 32;
    var laserSize = 32; // TODO reduce laser size?
    var laserDuration = 100;

    function Gun() {
        this.Container_constructor();

        this.on("tick", this.tick);

        this.x = 0;
        this.y = 0;


        var bar1 = new createjs.Shape();
        bar1.graphics.clear();
        bar1.graphics.beginFill("#2D6EFB");
        bar1.graphics.beginStroke("#2D8EFB");
        bar1.graphics.setStrokeStyle(3);
        bar1.graphics.drawRoundRect(0, 0, (DeepBeat.windowWidth/3)*Math.sqrt(2), gunSize - 10, 5);
        bar1.regX = (DeepBeat.windowHeight/3)*Math.sqrt(2)/2;
        bar1.regY = (gunSize - 10) / 2;
        bar1.x = DeepBeat.windowWidth / 2;
        bar1.y = DeepBeat.windowHeight / 2;
        bar1.rotation = 45;
        bar1.alpha = 0.5;
        this.addChild(bar1);


        bar1 = new createjs.Shape();
        bar1.graphics.clear();
        bar1.graphics.beginFill("#2D6EFB");
        bar1.graphics.beginStroke("#2D8EFB");
        bar1.graphics.setStrokeStyle(3);
        bar1.graphics.drawRoundRect(0, 0, (DeepBeat.windowWidth/3)*Math.sqrt(2), gunSize - 10, 5);
        bar1.regX = (DeepBeat.windowHeight/3)*Math.sqrt(2)/2;
        bar1.regY = (gunSize - 10) / 2;
        bar1.x = DeepBeat.windowWidth / 2;
        bar1.y = DeepBeat.windowHeight / 2;
        bar1.rotation = -45;
        bar1.alpha = 0.5;
        this.addChild(bar1);

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
        this.laserOverheat = 0;
        this.laserOverheatTimer = 0;
        this.laserOverheatColor = 0;

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

        DeepBeat.addKeyHandler(this, "keydown-esc", function() {
            DeepBeat.setLevel(DeepBeatLevels.MainMenu);
        });

        DeepBeat.addCollisionHandler(this, this.currentCollision, "Enemy", function(other) {
            if(this.laserTimer > 0) {
                DeepBeat.addObject(new Explosion(other.x,other.y,25,150));
                DeepBeat.removeObject(other);
                DeepBeat.currentLevel.health.incrementHealth(1);
            }
        });

        this.on("removed", function() {
            this.currentLaser.removeAllChildren();
            this.currentCollision.removeAllChildren();
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
        if(this.laserOverheat > 0) {
            this.laserOverheat -= DeepBeat.dt / 1.5;
        } else {
            this.laserOverheat = 0;
        }

        if(this.laserOverheatTimer > 0) {
            this.laserOverheatTimer -= DeepBeat.dt;
        } else {
            this.laserOverheatTimer = 0;
        }

        this.laserOverheatColor += (this.laserOverheat - this.laserOverheatColor)/400*DeepBeat.dt;

        var mult = (DeepBeat.currentLevel.getTimeToBeat ? DeepBeat.currentLevel.beatRate*2/(DeepBeat.currentLevel.beatRate+DeepBeat.currentLevel.getTimeToBeat()) : 1);
        mult = ((mult - 1) * 0.5 * (250 - this.laserOverheatColor)/250) + 1;
        var color1 = "rgb("+Math.round(45 + this.laserOverheatColor/250*200)+","+Math.round(190-this.laserOverheatColor/250*100)+","+Math.round(255-this.laserOverheatColor/250*255)+")";
        var color2 = "rgb("+Math.round(45 + this.laserOverheatColor/250*200)+","+Math.round(255-this.laserOverheatColor/250*150)+","+Math.round(255-this.laserOverheatColor/250*255)+")";

        this.laserNodes[0][0].shape.scaleX = mult;
        this.laserNodes[0][0].shape.scaleY = mult;
        this.laserNodes[0][0].setColor(color1, color2);
        this.laserNodes[1][0].shape.scaleX = mult;
        this.laserNodes[1][0].shape.scaleY = mult;
        this.laserNodes[1][0].setColor(color1, color2);
        this.laserNodes[0][1].shape.scaleX = mult;
        this.laserNodes[0][1].shape.scaleY = mult;
        this.laserNodes[0][1].setColor(color1, color2);
        this.laserNodes[1][1].shape.scaleX = mult;
        this.laserNodes[1][1].shape.scaleY = mult;
        this.laserNodes[1][1].setColor(color1, color2);
    }

    p.updateLaser = function(laserLine) {
        if(this.laserOverheat > 250) {
            this.laserOverheatTimer = 1500;
        }
        if(this.laserOverheatTimer > 0) {
            return;
        }

        var sfx = createjs.Sound.play("laserSFX");
        sfx.volume = 0.3;
        
        // Place laser in new direction
        if (this.laserTimer > 0) {
            this.currentLaser.removeAllChildren();
            this.currentCollision.removeAllChildren();
            this.laserTimer = 0;
        }
        this.currentLaser.addChild(laserLine.laser);
        laserLine.setColor("rgb("+Math.round(45 + this.laserOverheat/250*200)+","+Math.round(255-this.laserOverheat/250*150)+","+Math.round(255-this.laserOverheat/250*255)+")");
        this.currentCollision.addChild(laserLine.collision);
        this.laserTimer = laserDuration;

        this.laserOverheat += 150;
        //DeepBeat.currentLevel.health.decrementHealth(1); // Lose health whenever shoot laser but earn equal amount back if hit enemy. This way user can't spam
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
        
        var setColor = function(color1, color2) {
            shape.graphics.clear();
            shape.graphics.beginFill(color1);
            shape.graphics.beginStroke(color2);
            shape.graphics.setStrokeStyle(2);
            shape.graphics.drawCircle(0,0,gunSize/2 - 5);
            shape.graphics.beginFill(color2);
            shape.graphics.drawCircle(0,0,gunSize/2 - 10);
        };

        return {x: x, y: y, shape: shape, setColor: setColor};
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

        var setColor = function(color) {
            laser.graphics.clear();
            if(width < 64) {
                laser.graphics.beginFill(color).drawRoundRect(10, -gunSize/2 + 10, width - 20, height + gunSize - 20, 5);
            } else {
                laser.graphics.beginFill(color).drawRoundRect(-gunSize/2 + 10, 10, width + gunSize - 20, height-20, 5);
            }
        };

        if(width < 64) {
            laser.graphics.beginFill("#2DFEFB").drawRoundRect(10, -gunSize/2 + 10, width - 20, height + gunSize - 20, 5);
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
            laser.graphics.beginFill("#2DFEFB").drawRoundRect(-gunSize/2 + 10, 10, width + gunSize - 20, height-20, 5);
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
            collision: laserCollisionBitmap,
            setColor: setColor
        };
    };


}(window));