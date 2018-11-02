// old bot

class BOT {
	constructor({ size, start, end }) {
        this.position = start;
        this.size = size;
        this.end = end;
        this.actionSequence = []
        this.history = []
    };

    avoidBumping(actions, {MAP}){

        let actions2 = actions;

        if(MAP[1][2] == false || this.position[0]==0){
            actions2 = actions2.filter(action => action != 'up');
        }

        if(MAP[3][2] == false || this.position[0]==this.size[0]-1){
            actions2 = actions2.filter(action => action != 'down');
        }

        if(MAP[2][1] == false || this.position[1]==0){
            actions2 = actions2.filter(action => action != 'left');
        }

        if(MAP[2][3] == false){
            actions2 = actions2.filter(action => action != 'right');
        }

        return actions2;
    }

    updateGPS(action){
        if(action == 'down'){this.position[0]++}
        if(action == 'up'){this.position[0]--}
        if(action == 'left'){this.position[1]--}
        if(action == 'right'){this.position[1]++}
        this.history.unshift(action);
        this.history = this.history.slice(0, 9);
    }

	Move({ MAP }) {

        let actions = ['up', 'right', 'down', 'left'];

        actions = this.avoidBumping(actions, { MAP });

        // if stuck
        if(this.history[0] == this.history[2] && this.history[1] == this.history[3]){
            console.log("Help I'm stuck");
            actions = actions.filter(action => action !=this.history[1]);

            if(
            (this.history[0]=='left' && this.history[1]=='right') ||
            (this.history[1]=='left' && this.history[0]=='right'))
            {

                console.log(this.position[0] > this.size.height/2);
                if(this.position[0] > this.size.height/2){
                    let moveCount = 0;


                    if (MAP[2][3]== false){
                        moveCount++;
                        if (MAP[1][3]== false){
                            moveCount++;
                            if (MAP[0][3]== false){
                                moveCount++;
                            }
                        }
                    }

                    for(let i=0; i<moveCount; i++){
                        this.actionSequence.push('up');
                    }

                    this.actionSequence.push('right');

                }
            }
        }

        let action = actions[ Math.floor( Math.random() * actions.length ) ];

        if (actions.includes('down')){
            action = 'down';
        }else if(actions.includes('right')){
            action = 'right';
        }

        if(this.actionSequence.length > 0){
            action = this.actionSequence.shift();
        }
        console.log(this.actionSequence);

        this.updateGPS(action);
        return action;
	}
}

module.exports = exports = BOT;
