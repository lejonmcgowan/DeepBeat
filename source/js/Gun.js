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

        this.addChild(new createjs.Bitmap(DeepBeat.preload.getResult("gun")));
        this.on("tick", p.tick);
        this.x = 500;
        this.y = 288;
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
            if(this.direction != null) {
                this.addChild(this.laser);
                this.laserTimer = 7;
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
            this.laser.rotation = this.laserAim.rotation = direction;
        } else if(this.direction != null && direction == null) {
            this.removeChild(this.laserAim);
        } else if(direction != null) {
            this.laser.rotation = this.laserAim.rotation = direction;
        }
        this.direction = direction;
    }
}(window));