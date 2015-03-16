(function (window) {

    function Menu(menuItems) {
        this.Container_constructor();

        this.menuItems = [];
        this.currentItem = 0;
        this.esc = -1;

        for(var i = 0; i < menuItems.length; i++) {
            this.menuItems.push({
                text: new createjs.Text(menuItems[i].text, "24px Verdana", "#aaa"),
                level: menuItems[i].level
            });
            this.menuItems[i].text.x = DeepBeat.windowWidth/2 - this.menuItems[i].text.getMeasuredWidth()/2;
            this.menuItems[i].text.y = DeepBeat.windowHeight/2 - menuItems.length * 25 - this.menuItems[i].text.getMeasuredHeight()/2 + i * 50;
            this.addChild(this.menuItems[i].text);
            if(menuItems[i].esc) {
                this.esc = i;
            }
        }

        this.setCurrentItem(0);

        DeepBeat.addKeyHandler(this, "keydown-up", function() {
            var sfx = createjs.Sound.play("laserSFX");
            sfx.volume = 0.3;
            this.setCurrentItem(this.currentItem - 1);
        });
        DeepBeat.addKeyHandler(this, "keydown-down", function() {
            var sfx = createjs.Sound.play("laserSFX");
            sfx.volume = 0.3;
            this.setCurrentItem(this.currentItem + 1);
        });
        DeepBeat.addKeyHandler(this, "keydown-space", function() {
            DeepBeat.setLevel(this.menuItems[this.currentItem].level);
        });
        DeepBeat.addKeyHandler(this, "keydown-enter", function() {
            DeepBeat.setLevel(this.menuItems[this.currentItem].level);
        });
        DeepBeat.addKeyHandler(this, "keydown-esc", function() {
            if(this.esc == -1) return;
            DeepBeat.setLevel(this.menuItems[this.esc].level);
        });
    }

    var p = createjs.extend(Menu, createjs.Container);
    window.Menu = createjs.promote(Menu, "Container")

    p.setCurrentItem = function (index) {
        if(index < 0 || index >= this.menuItems.length)
            return;
        this.menuItems[this.currentItem].text.color = "#aaa";
        this.currentItem = index;
        this.menuItems[this.currentItem].text.color = "#ffffff";
    }


}(window));