(function (window) {

    function SpaceStation() {
        this.Container_constructor();

        this.size = 140;

        this.collision = new createjs.Bitmap(new Image(this.size,this.size));
        this.collision.x = 0;
        this.collision.y = 0;
        this.collision.regX = this.size/2;
        this.collision.regY = this.size/2;
        this.addChild(this.collision);

        this.points = [];
        for(var i = -10; i <= 10; i++) {
            this.points.push({
                x: -11,
                y: i,
                health: 1,
                targetHealth: 1
            });
        }
        for(var i = -10; i <= 10; i++) {
            this.points.push({
                x: i,
                y: 11,
                health: 1,
                targetHealth: 1
            });
        }
        for(var i = 10; i >= -10; i--) {
            this.points.push({
                x: 11,
                y: i,
                health: 1,
                targetHealth: 1
            });
        }
        for(var i = 10; i >= -10; i--) {
            this.points.push({
                x: i,
                y: -11,
                health: 1,
                targetHealth: 1
            });
        }
        
        this.x = DeepBeat.windowWidth/2;
        this.y = DeepBeat.windowHeight/2;
        this.shape = new createjs.Shape();
        this.shape.alpha = 0.9;
        this.drawShape(100);
        this.addChild(this.shape);

        DeepBeat.addCollisionHandler(this, this.collision, "Enemy", function(other) {
            this.checkCollision(other);
        });

        this.on("tick", this.tick);

    }
    var p = createjs.extend(SpaceStation, createjs.Container);
    window.SpaceStation = createjs.promote(SpaceStation, "Container")

    p.tick = function (event) {
        if(DeepBeat.currentLevel.health) {
            this.drawShape(DeepBeat.currentLevel.health.health);
        }
    }

    p.drawShape = function(health) {
        this.shape.graphics.clear().beginFill("rgba("+parseInt((100-health)*2.22)+","+parseInt((health)*2.22)+",0,1)").beginStroke("rgba("+parseInt((100-health)*2.55)+","+parseInt((health)*2.55)+",0,1)").setStrokeStyle(2);
        this.shape.graphics.moveTo(this.points[this.points.length-1].x * this.points[this.points.length-1].health * this.size/23, this.points[this.points.length-1].y * this.points[this.points.length-1].health * this.size/23);
        for(var i = 0; i < this.points.length; i++) {
            this.points[i].health += (this.points[i].targetHealth - this.points[i].health)/10;
            this.points[i].targetHealth += (1 - this.points[i].targetHealth)/200;
            this.shape.graphics.lineTo(this.points[i].x * this.points[i].health * this.size/23, this.points[i].y * this.points[i].health * this.size/23);
        }
        this.shape.graphics.endFill().endStroke();
    }

    p.checkCollision = function(other) {
        var x = other.x - DeepBeat.windowWidth/2;
        var y = other.y - DeepBeat.windowHeight/2;
        var index;
        var point;
        var collide = false;
        var obj = this;

        var checkX = function() {
            if(x < 0) {
                index = 10 + y/(obj.size/23);
                point = obj.getPoint(index);

                if(x > point.x * point.health * obj.size/23) {
                    obj.distort(index);
                    collide = true;
                }
            } else {
                index = 52 + -y/(obj.size/23);

                point = obj.getPoint(index);
                if(x < point.x * point.health * obj.size/23) {
                    obj.distort(index);
                    collide = true;
                }
            }
        }

        var checkY = function() {
            if(y < 0) {
                index = 73 - x/(obj.size/23);
                point = obj.getPoint(index);
                if(y > point.y * point.health * obj.size/23) {
                    obj.distort(index);
                    collide = true;
                }
            } else {
                index = 31 + x / (obj.size/23);
                point = obj.getPoint(index);
                if(y < point.y * point.health * obj.size/23) {
                    obj.distort(index);
                    collide = true;
                }
            }
        }

        if(Math.abs(x) > Math.abs(y)) {
            checkX();
        } else {
            checkY();
        }

        if(collide || Math.abs(x) < 30 && Math.abs(y) < 30) {
            this.removeEnemy(other);
        }
    }

    p.getPoint = function(approxIndex) {
        var index = Math.round(approxIndex);
        while(index < 0) {
            index += this.points.length;
        }
        while(index > this.points.length - 1) {
            index -= this.points.length;
        }
        return this.points[index];
    }

    p.distort = function(index) {
        for(var i = -8; i <= 8; i++) {
            this.getPoint(index + i).targetHealth *= 0.4 * Math.abs(i) / 8 + 0.6;
        }
    }

    p.removeEnemy = function(other) {
        DeepBeat.removeObject(other);
        DeepBeat.currentLevel.health.decrementHealth(10);
    }

    window.SSDistortX = function(x, y) {
        var ny = y - DeepBeat.windowHeight / 2;
        var nx = x - DeepBeat.windowWidth / 2;
        var dx = nx / (DeepBeat.windowWidth / 7);
        var dy = ny / (DeepBeat.windowHeight / 7);
        var d = dx * dx + dy * dy;
        if(d > 1)
            return x;
        return DeepBeat.windowWidth/2+nx*d;
    }

    window.SSDistortY = function(x, y) {
        var ny = y - DeepBeat.windowHeight / 2;
        var nx = x - DeepBeat.windowWidth / 2;
        var dx = nx / (DeepBeat.windowWidth / 7);
        var dy = ny / (DeepBeat.windowHeight / 7);
        var d = dx * dx + dy * dy;
        if(d > 1)
            return y;
        return DeepBeat.windowHeight/2+ny*d;
    }

}(window));