class BOT {
	constructor({ size, start, end }) {
		this.position = start;
		this.size = size;
		this.end = end;
		this.direction = "down";
		this.actionSequence = [];
		this.history = [];
	}

	avoidBumping(direction, { MAP }) {
		const amOnTopEdge    = this.position[0] == 0;
		const amOnBottomEdge = this.position[0] == this.size[0] - 1;
		const amOnLeftEdge   = this.position[1] == 0;
		const amOnRightEdge  = this.position[1] == this.size[1] - 1;

		const cantGo = {
			up:    !MAP[1][2] || amOnTopEdge,
			down:  !MAP[3][2] || amOnBottomEdge,
			left:  !MAP[2][1] || amOnLeftEdge,
			right: !MAP[2][3] || amOnRightEdge
		};

		if(!cantGo[direction]){
			return direction;
		}else{
			let actions = ["up", "right", "down", "left"];
			if (cantGo.up) {actions = actions.filter(action => action != "up")}
			if (cantGo.down) {actions = actions.filter(action => action != "down")}
			if (cantGo.left) {actions = actions.filter(action => action != "left")}
			if (cantGo.right) {actions = actions.filter(action => action != "right")}

			return actions[Math.floor(Math.random() * actions.length)];
		}
	}

	updateGPS(action) {
		if (action == "down")  { this.position[0]++ }
		if (action == "up")    { this.position[0]-- }
		if (action == "left")  { this.position[1]-- }
		if (action == "right") { this.position[1]++ }

		this.history.unshift(action);
		this.history = this.history.slice(0, 9);
	}

	changeDirection() {
		if (this.direction == "down") {
			this.direction = "right";
		} else {
			this.direction = "down";
		}
	}

	Move({ MAP }) {
		const amOnTopEdge    = this.position[0] == 0;
		const amOnBottomEdge = this.position[0] == this.size[0] - 1;
		const amOnLeftEdge   = this.position[1] == 0;
		const amOnRightEdge  = this.position[1] == this.size[1] - 1;

		const somethingIs = {
			toTheLeft: {
				up:    !MAP[2][1] || amOnLeftEdge,
				down:  !MAP[2][3] || amOnRightEdge,
				left:  !MAP[3][2] || amOnBottomEdge,
				right: !MAP[1][2] || amOnTopEdge
			},
			toTheRight: {
				up:    !MAP[2][3] || amOnRightEdge,
				down:  !MAP[2][1] || amOnLeftEdge,
				left:  !MAP[1][2] || amOnTopEdge,
				right: !MAP[3][2] || amOnBottomEdge
			},
			inFront: {
				up:    !MAP[1][2] || amOnTopEdge,
				down:  !MAP[3][2] || amOnBottomEdge,
				left:  !MAP[2][1] || amOnLeftEdge,
				right: !MAP[2][3] || amOnRightEdge
			},
			behind: {
				up:    !MAP[3][2] || amOnBottomEdge,
				down:  !MAP[1][2] || amOnTopEdge,
				left:  !MAP[2][3] || amOnRightEdge,
				right: !MAP[2][1] || amOnLeftEdge
			}
		};

		if (somethingIs.inFront[this.direction]) {
			this.changeDirection();
		}

		let action = this.avoidBumping(this.direction,{ MAP });

		if (this.actionSequence.length > 0) {
			action = this.actionSequence.shift();
		}

		this.updateGPS(action);

		return action;
	}
}

module.exports = exports = BOT;
