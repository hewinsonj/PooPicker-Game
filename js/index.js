// this is an extension and adjustment of the monsterMash branch of this repo. There are more comments on the monsterMash branch, explaining some of the lines in this branch.
// this incorporates smoother movement, and a more open ended collision detection function, as well as a second enemy.

// ////// RULES FOR DEVELOPING THE GAME //////////
// we need two entities, a hero and an ogre
// the hero should be moveable with the WASD or arrow keys
// the ogre should be stationary
// the hero and first ogre should be able to collide to make something happen
// when the hero and ogre1 collide, the ogre is removed from the canvas, and a second ogre appears
// when hero and ogre2 collide, the game stops, and sends a message to our user that they have won.
// ////////////// END RULES ////////////////////////////////


// first we need to grab our elements so we can make them do stuff
const game = document.getElementById('canvas')
const movement = document.getElementById('movement')
const message = document.getElementById('status')

// we need to set the game's context to be 2d
const ctx = game.getContext('2d')

game.setAttribute('width', getComputedStyle(game)['width'])
game.setAttribute('height', getComputedStyle(game)['height'])

// we're now diverging, and making a different class for each type of entity. One for our hero, one for our Ogres+
// class for our ogre
class Neighbor {
    constructor(x, y, color, width, height, alive) {
        this.x = x,
        this.y = y,
        this.color = color,
        this.width = width,
        this.height = height,
        this.alive = alive,
        this.render = function () {
            ctx.fillStyle = this.color
            ctx.fillRect(this.x, this.y, this.width, this.height)
        }
    }
}

class PooSpot {
    constructor(x, y, color, width, height, alive) {
        this.x = x,
        this.y = y,
        this.color = color,
        this.width = width,
        this.height = height,
        this.alive = alive,
        this.render = function () {
            ctx.fillStyle = this.color
            ctx.fillRect(this.x, this.y, this.width, this.height)
        }
    }
}

class Dog {
    constructor(x, y, color, width, height, alive) {
        this.x = x,
        this.y = y,
        this.color = color,
        this.width = width,
        this.height = height,
        this.alive = alive,
        this.render = function () {
            ctx.fillStyle = this.color
            ctx.fillRect(this.x, this.y, this.width, this.height)
        }
    }
}
// class for our hero
class Dad {
    constructor(x, y, color, width, height) {
        this.x = x,
        this.y = y,
        this.color = color,
        this.width = width,
        this.height = height,
        this.alive = true,
        // we need two additional properties in order to make our hero move around a little smoother.
        this.speed = 10,
        // because we're going to rework our movement handler, we need directions, set to be different values that we can update with a keypress
        this.direction = {
            up: false,
            down: false,
            left: false,
            right: false
        },
        // we need two key based functions here that will change our hero's movement direction
        // this time, we'll only use WASD keys(purely for the sake of time)
        // setDirection will be tied to a keyDown event
        this.setDirection = function (key) {
            console.log('this is the key that was pressed', key)
            if (key.toLowerCase() == 'w') { this.direction.up = true }
            if (key.toLowerCase() == 'a') { this.direction.left = true }
            if (key.toLowerCase() == 's') { this.direction.down = true }
            if (key.toLowerCase() == 'd') { this.direction.right = true }
        },
        // unsetDirection will be tied to a keyUp event
        this.unsetDirection = function (key) {
            console.log('this is the key that was released', key)
            if (key.toLowerCase() == 'w') { this.direction.up = false }
            if (key.toLowerCase() == 'a') { this.direction.left = false }
            if (key.toLowerCase() == 's') { this.direction.down = false }
            if (key.toLowerCase() == 'd') { this.direction.right = false }
        },
        // we're also adding a movePlayer function that is tied to our directions
        this.movePlayer = function () {
            // movePlayer, sends our guy flying in whatever direction is true
            if (this.direction.up) {
                this.y -= this.speed
                // while we're tracking movement, let's stop our hero from exiting the top of the screen
                if (this.y <= 200) {
                    this.y = 200
                }
            }
            if (this.direction.left) {
                this.x -= this.speed
                // while we're tracking movement, let's stop our hero from exiting the top of the screen
                if (this.x <= 0) {
                    this.x = 0
                }
            }
            if (this.direction.down) {
                this.y += this.speed
                // while we're tracking movement, let's stop our hero from exiting the top of the screen
                // for down, and right, we need the entire character for our detection of the wall, as well as the canvas width and height
                if (this.y + this.height >= game.height - 200) {
                    this.y = game.height - this.height - 200
                }
            }
            if (this.direction.right) {
                this.x += this.speed
                // while we're tracking movement, let's stop our hero from exiting the top of the screen
                // for down, and right, we need the entire character for our detection of the wall, as well as the canvas width and height
                if (this.x + this.width >= game.width) {
                    this.x = game.width - this.width
                }
            }
        },
        this.render = function () {
            ctx.fillStyle = this.color
            ctx.fillRect(this.x, this.y, this.width, this.height)
        }
    }
}

// places ogres at random spots in the horizontal direction
const randomPlaceShrekX = (max) => {
    // we can use math random and canvas dimensions for this
    return Math.floor(Math.random() * max)
}

const player = new Dad(10, 200, 'lightsteelblue', 20, 60)
const dog = new Dog(40, 205, 'white', 20, 20, true)
const neighborOne = new Neighbor(200, 400, '#bada55', 32, 48, true)
const neighborTwo = new Neighbor(randomPlaceShrekX(game.width), 200, 'red', 64, 96, true)
const pooSpot1 = new PooSpot(300, 250, 'brown', 20, 20)
const pooSpot2 = new PooSpot(200, 600, 'brown', 10, 10, true)


dog.updatePosition = function (spotNum, spotNum) {
    const diffX = spotNum.x - dog.x;
    const diffY = spotNum.y - dog.y;
    
      if(diffX > 0)
          dog.x += 3;
      else 
          dog.x -= 3;
      if(diffY > 0)
          dog.y += 3;
      else
          dog.y -= 3;
    }


neighborOne.updatePosition = function (spotNum, spotNum) {
    const diffX = spotNum.x - neighborOne.x;
    const diffY = spotNum.y - neighborOne.y;

    if(diffX > 0)
        neighborOne.x += 1;
    else 
        neighborOne.x -= 1;
    if(diffY > 0)
        neighborOne.y += 1;
    else
        neighborOne.y -= 1;
}



// function that changes the player's direction
document.addEventListener('keydown', (e) => {
    // when a key is pressed, call the setDirection method
    player.setDirection(e.key)
})
// function that stops player from going in specific direction
document.addEventListener('keyup', (e) => {
    // when a key is pressed, call the setDirection method
    if (['w', 'a', 's', 'd'].includes(e.key)) {
        player.unsetDirection(e.key)
    }
})

// detect when player has hit anything
const detectHitPlayer = (thing) => {
    // we're basically using one big if statement to cover all our bases
    // that means judging the player and ogre's x, y, width and height values
    if(player.x < thing.x + thing.width 
        && player.x + player.width > thing.x
        && player.y < thing.y + thing.height
        && player.y + player.height > thing.y) {
            thing.alive = false
        }
}

const detectHitDog = (thing) => {
    // we're basically using one big if statement to cover all our bases
    // that means judging the player and ogre's x, y, width and height values
    
    
        if(    dog.x < thing.x + thing.width 
            && dog.x + dog.width > thing.x
            && dog.y < thing.y + thing.height
            && dog.y + dog.height > thing.y ) {
                thing.alive = true
                thing.render()
            }
    
}

const detectHitNeighborOne = (thing) => {
    // we're basically using one big if statement to cover all our bases
    // that means judging the player and ogre's x, y, width and height values
    if(neighborOne.x < thing.x + thing.width 
        && neighborOne.x + neighborOne.width > thing.x
        && neighborOne.y < thing.y + thing.height
        && neighborOne.y + neighborOne.height > thing.y) {
            thing.alive = false
            stopGameLoop()
            message.textContent = `You're Neighbor Stepped in Poo! You Loose!`
        }
}

// we're going to set up a gameLoop function
// this will be attached to an interval
// this is how we will create animation in our canvas

const gameLoop = () => {
    // make sure you don't have any console.logs in here
    // console.log('frame running')
    ctx.clearRect(0, 0, game.width, game.height)

    if (player.alive) {
        detectHitPlayer(pooSpot1)
    } else if (player.alive) {
        message.textContent = `Poo's Collected: 1`
        // pooSpot2.render()
        detectHitPlayer(pooSpot2)
    } else {
        stopGameLoop()
        message.textContent = 'Youve cleaned up all of your dogs mess! You win! '
    }


    if (!pooSpot1.alive) {
       // pooSpot1.render()
        dog.updatePosition(pooSpot1, pooSpot1)
        
        
    } else if (pooSpot2.alive) {
        message.textContent = `Poo's Collected: 1`
        //pooSpot2.render()
        dog.updatePosition(pooSpot2, pooSpot2)
        neighborOne.updatePosition(pooSpot2, pooSpot2)
        detectHitDog(pooSpot2)
        detectHitNeighborOne(pooSpot2)
    }
    detectHitDog(pooSpot1)

    movement.textContent = player.x + ", " + player.y
    player.render()
    player.movePlayer()
    dog.render()
    neighborOne.render()
    
    
}
// used to render the game every 60 ms
const gameInterval = setInterval(gameLoop, 60)
// used to stop the game when the condition to do so is met
const stopGameLoop = () => {clearInterval(gameInterval)}

document.addEventListener('DOMContentLoaded', function () {
    // calls the game loop and runs the interval 
    gameInterval
})