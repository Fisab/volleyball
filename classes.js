function player(pos, size){
	this.pos = pos;
	this.size = size;
	this.color = '#'+Math.floor(Math.random()*16777215).toString(16);
	this.vel = [0,0];
	this.angle = 0;
	this.reload = 1;
	this.lastShoot = 0;
	this.health = 3;
	this.gun = {
		length: 40,
		rotateSpeed: 0.025,
		angle: 0
	}
	this.mVel = {
		move: 4,
		rotateBody: Math.PI/80,
		rotateGun: 0.025
	}

	this.shoot = function(bullets, tick){
		if(this.lastShoot + this.reload < tick){
			bullets.push(new bullet(this.pos, this.angle+this.gun.angle, this.color));
			this.lastShoot = tick;
		}
	}

	this.checkCollision = function(dir, walls){
	    var nx = Math.cos(this.angle)*this.mVel.move;
	    var ny = Math.sin(this.angle)*this.mVel.move;

	    if(dir == 'ago'){nx*=-1; ny*=-1;}
	    for(var wall of walls){   
	        if(this.color != wall.color){
	            if(this.pos[0]+this.size+nx > wall.pos[0] &&
	               this.pos[0]-this.size+nx < wall.pos[0] + wall.size[0] &&
	               this.pos[1]+this.size+ny > wall.pos[1] &&
	               this.pos[1]-this.size+ny < wall.pos[1] + wall.size[1]){
					return true;
				}
		    }
		}
	}

	this.rotateBody = function(dir){
		if(dir <= this.mVel.rotateBody && dir >= this.mVel.rotateBody*-1){this.angle+=dir;}
		else if(dir < 0){this.angle+=this.mVel.rotateBody*-1}
		else{this.angle+=this.mVel.rotateBody}
	}

	this.move = function(dir, walls){
		switch(dir){
			case 'forward':
				if(!this.checkCollision('forward', walls)){
					this.vel[0]+=Math.cos(this.angle)*vel[0];
					this.vel[1]+=Math.sin(this.angle)*vel[0];
				}
			break;
			case 'ago':
				if(!this.checkCollision('ago', walls)){
					this.vel[0]-=Math.cos(this.angle)*vel[0];
					this.vel[1]-=Math.sin(this.angle)*vel[0];
				}
			break;
		}
	}

	this.render = function(ctx){
		ctx.beginPath();//body
		ctx.fillStyle = this.color;
		ctx.arc(this.pos[0], this.pos[1], this.size, 0, Math.PI*2, 0);
		ctx.fill();

		ctx.save();//front side
		ctx.beginPath();
		ctx.fillStyle = this.color;
		ctx.translate(this.pos[0], this.pos[1]);
		ctx.rotate(this.angle);
		ctx.arc(this.size/1.95, 0, this.size/1.55, 0, Math.PI*2, 0);
		ctx.fill();
		ctx.restore();

		ctx.save();//gun
		ctx.beginPath();
		ctx.fillStyle = '#322';
		ctx.translate(this.pos[0], this.pos[1]);
		ctx.rotate(this.angle+this.gun.angle);
		ctx.fillRect(Math.cos(this.angle)-1, Math.sin(this.angle)-4, this.gun.length, 10);
		ctx.restore();
		ctx.fill();


		ctx.save();//tower
		ctx.beginPath();
		ctx.fillStyle = '#322';
		ctx.translate(this.pos[0], this.pos[1]);
		ctx.rotate(this.angle+this.gun.angle);
		ctx.arc(this.size/5, 0, this.size/1.55, 0, Math.PI*2, 0);
		ctx.fill();
		ctx.restore();
	}
}

function bullet(pos, angle, color){
	this.pos = [pos[0], pos[1]];
	this.angle = angle;
	this.color = color;
	this.size = [27, 8];
	this.vel = 5;

	this.checkCollisionW = function(walls){//check collision with walls
		for(var wall of walls){
			if(this.pos[0] > wall.pos[0] &&
                this.pos[0] < wall.pos[0] + wall.size[0] &&
                this.pos[1] > wall.pos[1] &&
                this.pos[1] < wall.pos[1] + wall.size[1]){
				return this.pos;
			}
		}
	}

	this.checkCollisionP = function(players){//check collision with players
		for(var p of players){
			if(this.color != p.color && 
			   this.pos[0] > p.pos[0] - p.size &&
	           this.pos[0] < p.pos[0] + p.size &&
	           this.pos[1] > p.pos[1] - p.size &&
	           this.pos[1] < p.pos[1] + p.size){
				return p.color;
			}
		}
	}

	this.process = function(walls, players, bullets, dPlayers){
		if(!this.checkCollisionW(walls) && !this.checkCollisionP(players)){
			this.pos[0] += Math.cos(this.angle) * this.vel;
			this.pos[1] += Math.sin(this.angle) * this.vel;
		}
		else if(this.checkCollisionP(players)){
			var needId = this.checkCollisionP(players);
			for(var t = 0; t < players.length; t++){//delete if touch any player
				if(players[t].color == needId){
					if(players[t].health <= 1){
						//dPlayers.push(players[t]);
						players.splice(t, 1);
					}
					else{players[t].health-=1;}
				}
			}
			for(var i = 0; i < bullets.length; i++){
				if(bullets[i].pos[0] == this.pos[0] && bullets[i].pos[1] == this.pos[1]){
					bullets.splice(i, 1);
				}
			}
		}
		else if(this.checkCollisionW(walls)){//delete if touch any wall
			var needPos = this.checkCollisionW(walls);
			for(var j = 0; j < bullets.length; j++){
				if(bullets[j].pos[0] == needPos[0] && bullets[j].pos[1] == needPos[1]){
					bullets.splice(i, 1);
				}
			}
		}
	}

	this.render = function(ctx){
		ctx.save();
		ctx.beginPath();
		ctx.fillStyle = this.color;
		ctx.translate(this.pos[0], this.pos[1]);
		ctx.rotate(this.angle);
		ctx.fillRect(-this.size[0]/2, 0, this.size[0], this.size[1]);
		ctx.fill();
		ctx.restore();
	}
}
