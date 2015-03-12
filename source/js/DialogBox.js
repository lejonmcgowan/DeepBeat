(function (window) {
	var width;
	var height = 200;

 	function DialogBox(text,canvasWidth, time)
 	{
		this.Container_constructor();
 		width = canvasWidth;

 		this.y = DeepBeat.windowHeight - height;
 		this.removeAllChildren();

 		var rectDialogBox = new createjs.Graphics().f("rgba(60,60,175,0.5)").rc(0,0,width, height,50,50,50,50);
 		var rectangle = new createjs.Shape(rectDialogBox); 	

 		var textContainer = new createjs.Container();
 		textContainer.x = 40;
 		textContainer.y = 30;
 		textContainer.lineWidth = 20;

 		var textInDialog = new createjs.Text(text, "20px Arial", "#ff7700");
 			textInDialog.textBaseline = "alphabetic";

 		textContainer.addChild(textInDialog);

 		this.addChild(textContainer, rectangle);
 	}

 	 var p = createjs.extend(DialogBox, createjs.Container);
     window.DialogBox = createjs.promote(DialogBox, "Container")

}(window));