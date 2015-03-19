DIALOG = 
{
	MENU_HELP: "Press the arrow keys to choose a level. use enter to confirm your choice.",
	WELCOME: "Welcome to DeepBeat. Here you are protecting your gelatanous ship (called the Groovitron) from the perils of space.",
	CONTROLS: "Use the Arrow keys to fire your tesla beams. Your directions determines\
				which teslas are activated.",
	GOAL: "The Dysfuncitnoals will try to funk up your groove. Use your tesla cannons to keep the flow going! For now, you will be tested against some slugs; slow, predictable, shootable. Perfect to practice your markmanship!"
	,
	OVERHEAT: "Careful! Firing your Tesla Cannon too often will result in overheating.\
				You'll have to wait a brief moment as the cannons cool down, leaving you \
				vulnerable to the Dysfuncitnoals!",
	OVERHEAT2: "Easy on the trigger! We don't want to blow up ANOTHER ship!",
	LEVEL1_INTRO: "Incoming enemies at 3 O'Clock! and 6 O'Clock! and... Everywhere O'Clock!!",
	LEVEL1_HIT: "We've been breached! stop slacking! get with the flow!",
	LEVEL1_MID: "Good job so far, but it's getting worse by the minute! stay on guard!",
	LEVEL1_MID2: "Still in the Deep! Keep the Rhythym going!",
	LEVEL1_MID3: "Nice and On-beat! We're Almost there!",
	HALF_DAMAGE: "Heavy Dissonance crated so far! Get back in Sync! ",
	CRITICAL: "DANGEROUSLY DE-SYNCED! We can't take anymore dischording!",
};

function DialogTiming(condition, text, timeVisible)
{
	this.condition = condition;
	this.text = text;
	this.timeVisible = timeVisible;
};
