function player(pos, size){
	this.pos = pos;
	this.size = size;
	this.color = '#'+Math.floor(Math.random()*16777215).toString(16);
	this.vel = [0,0];
	this.mVel = {
		move: 15,
		rotateBody: Math.PI/80,
		rotateGun: 0.025
	}

	this.checkCollision = function(walls, r, l, j){
		if(r == 3){//gravity
		    for(var wall of walls){   
	            if(this.pos[0] > wall.pos[0] &&
	               this.pos[0] < wall.pos[0] + wall.size[0] &&
	               this.pos[1]+this.size > wall.pos[1] &&
	               this.pos[1]-this.size < wall.pos[1] + wall.size[1]){
					return true;
				}
			}
		}
		else if(j){//jump
			for(var wall of walls){   
	            if(this.pos[0] > wall.pos[0] &&
	               this.pos[0] < wall.pos[0] + wall.size[0] &&
	               this.pos[1]+this.size > wall.pos[1] &&
	               this.pos[1]-this.size < wall.pos[1] + wall.size[1]){
					return true;
				}
			}
		}
		else{//move
			for(var wall of walls){ 
	            if(this.pos[0]+this.size+r+l > wall.pos[0] &&
	               this.pos[0]-this.size+r+l < wall.pos[0] + wall.size[0] &&
	               this.pos[1] > wall.pos[1] &&
	               this.pos[1] < wall.pos[1] + wall.size[1]){
					return true;
				}
			}
		}
	}

	this.move = function(dir, walls){
		switch(dir){
			case 'right':
				if(!this.checkCollision(walls, 5, 0)){
					this.vel[0] += 5;
				}
			break;
			case 'left':
				if(!this.checkCollision(walls, 0, -5)){
					this.vel[0] -= 5;
				}
			break;
			case 'jump':
				if(this.checkCollision(walls, 1, 1, 1)){
					for(var i = 0; i < 4; i++){
						this.vel[1]-=4;
					}
				}
			break;
		}
	}

	this.render = function(ctx){
		ctx.beginPath();//body
		ctx.fillStyle = this.color;
		ctx.arc(this.pos[0], this.pos[1], this.size, 0, Math.PI*2, 0);
		ctx.fill();
	}
}
