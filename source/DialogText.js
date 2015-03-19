DIALOG = 
{
	MENU_HELP: "Press the arrow keys to choose a level. use enter to confirm your choice.",
	WELCOME: "Welcome to DeepBeat. Here you are protecting your gelatanous ship (called the Groovitron) from the perils of space.",
	CONTROLS: "Use the Arrow keys to fire your tesla beams. Your directions determines\
				which teslas are activated.",
	GOAL: "The Dysfuncitnoals will try to funk up your groove. Use your tesla cannons to keep the flow going!\
	For now, you will be tested against some slugs; slow, predictable, shootable. Perfect to practice your markmanship!"
	,
	OVERHEAT: "Careful! Firing your Tesla Cannon too often will result in overheating.\
				You'll have to wait a brief moment as the cannons cool down, leaving you \
				vulnerable to the Dysfuncitnoals!"
};

function DialogTiming(condition, text, timeVisible)
{
	this.condition = condition;
	this.text = text;
	this.timeVisible = timeVisible;
};
