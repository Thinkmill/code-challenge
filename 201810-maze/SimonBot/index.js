"use strict";

class BOT {
  constructor({ size, start, end }) {
    this.bannedAction = '' // bannedAction contains a nextAction we know we shouldn't take
  }

  Move({ MAP }) {

    // TODO - Improvements:
    // 1. Determine preferredActions automatically - it's currently hard coded
    // 2. The edge case fix will only work for dead ends that are no more than 2 levels deep

    // We simply move right and down towards the goal
    // TODO - we can use start, end in constructor to determine our prefferedActions
    const prefferedActions = ['right', 'down'].filter(action => action !== this.bannedAction);
    let nextAction = prefferedActions[Math.floor(Math.random() * prefferedActions.length)]

    /**
     * We don't want to waste moves by trying to move into blockages
     * Calculate whether any of our potenital next actions are blocked
     *
     * @param {Array} map  - Array representation of the map surroundings
     *
     * @return {Object}    - false indicates that nextAction is blocked { up: true, right: true, down: false, left: true }
     *
     */
    const determineSurroundings = map => {
      // Our current location is the center of the map
      const currentLocation = Math.floor(MAP.length / 2);

      return {
        up: map[currentLocation - 1][currentLocation],
        right: map[currentLocation][currentLocation + 1],
        down: map[currentLocation + 1][currentLocation],
        left: map[currentLocation][currentLocation - 1]
      }
    }

    const canMove = determineSurroundings(MAP);

    if(!canMove.right && canMove.down) nextAction = this.bannedAction === 'down' ? 'up' : 'down'
    if(!canMove.down && canMove.right) nextAction = this.bannedAction === 'right' ? 'left' : 'right'

    // EDGE CASE
    // A nasty edge case of the simple 'just move down and right' approach is that we can get stuck in an inifinte loop for some geometrys:
    // ░ ▓ ▓ ░ ░
    // ░ Φ ░ ▓ ░
    // ░ ▓ ▓ ░ ░
    // ░ ░ ░ ▓ ░
    // ░ ░ ░ ▓ ░
    // Step 1. In the above example, the player will choose to move right because it cannot move down.

    // ░ ▓ ▓ ░ ░
    // ░ ░ Φ ▓ ░
    // ░ ▓ ▓ ░ ░
    // ░ ░ ░ ▓ ░
    // ░ ░ ░ ▓ ░
    // Step 2. Now the player will choose to move back because it cannot move any other way. Thus returning to previous position

    // ░ ▓ ▓ ░ ░
    // ░ Φ ░ ▓ ░
    // ░ ▓ ▓ ░ ░
    // ░ ░ ░ ▓ ░
    // ░ ░ ░ ▓ ░
    // Step 3. The player will choose to move right because... Uh oh - we are stuck in an infinite loop

    // To remedy this, when Step 2 occurs, we set a reminder to ban repeating the action on our next step
    // This will break down for deeper dead end geometry - but it's a simple solution for now
    if(!canMove.right && !canMove.down && canMove.up) {
      // we got stuck, lets remember not to return to this position
      this.bannedAction = 'down';
      nextAction = 'up'
    }
    else if(!canMove.right && !canMove.down && !canMove.up) {
      // we got stuck, lets remember not to return to this position
      this.bannedAction = 'right';
      nextAction = 'left'
    } else {
      this.bannedAction = ''
    }

    return nextAction;
  }
}

module.exports = exports = BOT;
