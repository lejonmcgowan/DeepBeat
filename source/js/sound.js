createjs.Sound.registerSound({id:"soundID", src:"../assets/audio/music.mp3"});

 var date = new Date();
 var timeInPlayer = 0;

function currentTime()
{
	console.log("Time: " + (date.getTime - time));
	return (date.getTime() - time) / 1000;
}

function playSound () 
{
	soundID = createjs.Sound.play("soundID");	
	console.log("PLAYING");
}

function stopSound () 
{
	createjs.Sound.stop();
	console.log("STOPPED");
}

function log()
{
	console.log(timeInPlayer.toString());
	timeInPlayer++;

	return 
};

var logVolume = log;