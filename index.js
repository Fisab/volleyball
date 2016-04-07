var canvas = document.getElementById("canvas");
var ctx = canvas.getContext('2d');
var w = canvas.width = 915;
var h = canvas.height = 715;

var walls = [];
var players = [];
var posWalls = [[0,0,w,15],[0,0,15,h],[w-15,0,15,h],[0,h-15,w,15],[w/4, h/3, 15, 100]];
var keys = new Set();
var vel = [4,Math.PI/80];
var players = [];
var bullets = [];
var mTick = 0;
var tick = 0;
var dPlayers = [];

function init(){
	for(var i = 0; i < posWalls.length; i++){
		walls.push({
			pos: [posWalls[i][0], posWalls[i][1]],
			size: [posWalls[i][2], posWalls[i][3]],
			color: 'green'
		});
	}
	for(var j = 0; j < 2; j++){players.push(new player([w/(j+2), h/(j+2)], 25));}

	document.body.addEventListener('keydown', function(e){keys.add(e.which);});
	document.body.addEventListener('keyup', function(e){keys.delete(e.which);});
}

function checkCollision(p, dir){
    nx = Math.cos(p.angle)*p.mVel.move;
    ny = Math.sin(p.angle)*p.mVel.move;

    if(dir == 'ago'){nx*=-1; ny*=-1;}
    for(var wall of walls){   
        if(p.color != wall.color){
            if(p.pos[0]+p.size+nx > wall.pos[0] &&
               p.pos[0]-p.size+nx < wall.pos[0] + wall.size[0] &&
               p.pos[1]+p.size+ny > wall.pos[1] &&
               p.pos[1]-p.size+ny < wall.pos[1] + wall.size[1]){
				return true;
			}
	    }
	}
}


function control(player){
	if(keys.has(32)){player.shoot(bullets, tick)}//space
	if(keys.has(87)){
		player.move('forward', walls);
	}
	if(keys.has(83)){
		player.move('ago', walls);
	}
	if(keys.has(65)){player.rotateBody(-1)}//left
	if(keys.has(68)){player.rotateBody(1)}//right
	if(keys.has(81) || keys.has(37)){player.gun.angle-=player.gun.rotateSpeed;}//left gun
	if(keys.has(69) || keys.has(39)){player.gun.angle+=player.gun.rotateSpeed;}//right gun
}

function process(){
	control(players[0]);
	players[0].pos[0]+=players[0].vel[0];
	players[0].pos[1]+=players[0].vel[1];
	players[0].vel[0] = 0;
	players[0].vel[1] = 0;
	for(var wall of walls){
		if(wall.type == 'player'){
			for(var player of players){
				if(player.color == wall.color){
					wall.pos[0] = player.pos[0]-20;
					wall.pos[1] = player.pos[1]-20;
				}
			}
		}
	}
	for(var bullet of bullets){bullet.process(walls, players, bullets, dPlayers);}
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
	for(var bullet of bullets){bullet.render(ctx);}
}

function secondTicker(){if(mTick >= 30){mTick = 0; tick++;}}

function loop(){
	process();
	render();
	secondTicker();
}

init();
setInterval(function(){loop(); mTick++;}, 16);

