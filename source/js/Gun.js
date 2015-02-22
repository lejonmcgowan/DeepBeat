(function (window) {

    function Gun() {
        this.Container_constructor();

        this.laserAim = new createjs.Shape();
        this.laserAim.graphics.beginFill("#ffffff").drawRect(0, 0, 1024, 32);
        this.laserAim.alpha = 0.2;
        this.laserAim.x = 16;
        this.laserAim.y = 16;
        this.laserAim.regX = 16;
        this.laserAim.regY = 16;

        this.laser = new createjs.Shape();
        this.laser.graphics.beginFill("#7777ff").drawRect(0, 0, 1024, 32);
        this.laser.alpha = 0.4;
        this.laser.x = 16;
        this.laser.y = 16;
        this.laser.regX = 16;
        this.laser.regY = 16;
        this.laserTimer = 0;

        this.collisionImageHor = new Image(1024, 32);
        this.collisionBitmap = new createjs.Bitmap(this.collisionImageHor);
        this.collisionBitmap.regX = 16;
        this.collisionBitmap.regY = 16;
        this.addChild(this.collisionBitmap);

        this.regX = 16;
        this.regY = 16;

        this.bitmap = new createjs.Bitmap(DeepBeat.preload.getResult("gun"));
        this.addChild(this.bitmap);
        this.on("tick", p.tick);
        this.x = 1024/2;
        this.y = 608/2;
        this.direction = null;

        DeepBeat.addKeyHandler(this, "key-up", function() {
            this.updateDirection(-90);
        });
        DeepBeat.addKeyHandler(this, "key-right", function() {
            this.updateDirection(0);
        });
        DeepBeat.addKeyHandler(this, "key-down", function() {
            this.updateDirection(90);
        });
        DeepBeat.addKeyHandler(this, "key-left", function() {
            this.updateDirection(180);
        });
        DeepBeat.addKeyHandler(this, "keyup-up", function() {
            this.updateDirection(null);
        });
        DeepBeat.addKeyHandler(this, "keyup-right", function() {
            this.updateDirection(null);
        });
        DeepBeat.addKeyHandler(this, "keyup-down", function() {
            this.updateDirection(null);
        });
        DeepBeat.addKeyHandler(this, "keyup-left", function() {
            this.updateDirection(null);
        });
        DeepBeat.addKeyHandler(this, "keydown-space", function() {
            if (this.direction != null) {
                this.addChild(this.laser);
                this.laserTimer = 7;
            }
        });
        DeepBeat.addKeyHandler(this, "keydown-mute", function() {
            // Toggle muting all audio
            createjs.Sound.setMute(!createjs.Sound.getMute());
        });
        
        DeepBeat.addCollisionHandler(this, this.collisionBitmap, "Enemy", function(other) {
            if(this.laserTimer > 0) {
                console.log("hi");
            }
        });
    }
    var p = createjs.extend(Gun, createjs.Container);
    window.Gun = createjs.promote(Gun, "Container")

    p.tick = function (event) {
        if(this.laserTimer > 0) {
            if(--this.laserTimer <= 0) {
                this.removeChild(this.laser);
            }
        }
    }

    p.updateDirection = function(direction) {
        if(this.direction == null && direction != null) {
            this.addChild(this.laserAim);
            this.rotation = direction;
        } else if(this.direction != null && direction == null) {
            this.removeChild(this.laserAim);
        } else if(direction != null) {
            this.rotation = direction;
        }
        this.direction = direction;
    }
}(window));