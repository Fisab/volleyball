var canvas = document.getElementById("canvas");
var ctx = canvas.getContext('2d');
var w = canvas.width = 915;
var h = canvas.height = 715;

var walls = [];
var players = [];
var posWalls = [[0,0,w,15],[0,0,15,h],[w-15,0,15,h],[0,h-15,w,15]];
var keys = new Set();
var vel = [4,Math.PI/80];
var players = [];
var mTick = 0;
var tick = 0;

function init(){
	for(var i = 0; i < posWalls.length; i++){
		walls.push({
			pos: [posWalls[i][0], posWalls[i][1]],
			size: [posWalls[i][2], posWalls[i][3]],
			color: 'green'
		});
	}
	for(var j = 0; j < 2; j++){players.push(new player([w/(j+2), h/(j+2)], 35));}

	document.body.addEventListener('keydown', function(e){keys.add(e.which);});
	document.body.addEventListener('keyup', function(e){keys.delete(e.which);});
}

function control(player){
	if(keys.has(32)){players[0].move('jump', walls)}//space
	if(keys.has(65)){players[0].move('left', walls)}//left
	if(keys.has(68)){players[0].move('right', walls)}//right
}

function process(){
	players[0].vel[0] *= 0.15;
	control(players[0]);

	players[0].pos[0]+=players[0].vel[0];
	players[0].pos[1]+=players[0].vel[1];

	if(!players[0].checkCollision(walls, 3)){players[0].vel[1] += 1;}
	else{players[0].vel[1] *=-0.25;}
}

function render(){
	ctx.clearRect(0,0, w,h);
	for(var wall of walls){
		ctx.beginPath();
		ctx.fillStyle = wall.color;
		ctx.fillRect(wall.pos[0], wall.pos[1], wall.size[0], wall.size[1]);
		ctx.fill();
	}
	for(var player of players){player.render(ctx);}
}

function loop(){
	process();
	render();
}

init();
setInterval(function(){loop(); mTick++;}, 16);

