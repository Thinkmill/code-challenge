class BOT {
	constructor({ size, start, end }) {
		this.position = start;
		this.size = size;
		this.end = end;
        this.direction = "down";
        this.actionSequence = []
		this.history = [];
	}

	avoidBumping(actions, { MAP }) {
		let actions2 = actions;

		if (MAP[1][2] == false || this.position[0] == 0) {
			actions2 = actions2.filter(action => action != "up");
		}

		if (MAP[3][2] == false || this.position[0] == this.size[0] - 1) {
			actions2 = actions2.filter(action => action != "down");
		}

		if (MAP[2][1] == false || this.position[1] == 0) {
			actions2 = actions2.filter(action => action != "left");
		}

		if (MAP[2][3] == false) {
			actions2 = actions2.filter(action => action != "right");
		}

		return actions2;
	}

	updateGPS(action) {
		if (action == "down") {
			this.position[0]++;
		}
		if (action == "up") {
			this.position[0]--;
		}
		if (action == "left") {
			this.position[1]--;
		}
		if (action == "right") {
			this.position[1]++;
		}
		this.history.unshift(action);
		this.history = this.history.slice(0, 9);
    }

    backUp(){
        if(this.direction == 'down'){
            this.actionSequence.push('up');
        }else{
            this.actionSequence.push('left');
        }
    }

    changeDirection(){
        if(this.direction == 'down'){
            this.direction = 'right'
        }else{
            this.direction = 'down'
        }
    }

	Move({ MAP }) {

        // const amOnTopEdge = this.position[0] == 0;
        // const amOnBottomEdge = this.position[0] == this.size[0]-1;

        // const amOnLeftEdge = this.position[1] == 0;
        // const amOnRightEdge = this.position[1] == this.size[1]-1;

		const somethingIs = {
			toTheLeft: {
				right: (!MAP[1][2] || this.position[0] == 0),
				down: !MAP[2][3],
			},
			toTheRight: {
				right: !MAP[3][2],
				down: (!MAP[2][1] || this.position[0] == 0),
			},
			inFront: {
				right: !MAP[2][3],
				down: !MAP[3][2],
			},
			behind: {
				right: !MAP[2][1],
				down: (!MAP[1][2] || this.position[0] == 0),
			}
        };


        if(somethingIs.inFront[this.direction]){
            //check if I can't change direction
            if(
                (this.direction == 'right' && somethingIs.toTheLeft[this.direction]) ||
                (this.direction == 'down' && somethingIs.toTheLeft[this.direction])
            ){
                //back it up!
                //this.actionSequence.push('up');
                this.backUp()
                this.changeDirection();
            }else{
                this.changeDirection();
            }
        }

		let actions = ["up", "right", "down", "left"];
		actions = this.avoidBumping(actions, { MAP });

        let action = this.direction;

        if(this.actionSequence.length > 0){
            action = this.actionSequence.shift();
        }

		this.updateGPS(action);

		return action;
	}
}

module.exports = exports = BOT;
