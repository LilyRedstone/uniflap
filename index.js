/**
* This game aims to be a simple flappy bird type game, featuring everyone's favorite mythical creature, a unicorn!
*/


// a list of our game elements put at the beginning so preload, create and update can access them. 
let player;
let coins;
let walls;
let enemies;
let splat;
let reload;
let cursor;
let wallHeight = 6;
let position = 0;

var w = 500, h = 500;

const getRandomInt = function(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

let text;

// the following javascript object called playState contains all the active code for this simple game, you can add other states like, win, lose, start etc

const playState = {

    init: function() {
      // Here reset score when play state starts
      score = 0;
      game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
      game.scale.pageAlignHorizontally = true;
      game.scale.pageAlignVertically = true;
      
    },
  
    preload: function() {
      // Here we preload the image assets - make more here http://piskelapp.com
      game.load.crossOrigin = 'anonymous';
      //game.load.image('player', 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/1171931/player.png');
      game.load.image('player', players.unicorn);
      //game.load.image('wall', 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/1171931/wall.png');
      game.load.image('wall', objects.wall);
      game.load.image('coin', objects.coin);
      game.load.image('enemy', objects.enemy);
      
      // Here we preload the audio assets - make more here http://sfbgames.com/chiptone/  
      game.load.audio('win', 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/1171931/win.wav');
      game.load.audio('splat', 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/1171931/splat.wav');
      
    },

    create: function() {  
        // Here we create the game
      
    // Create a label to use as a button
    pause_label = game.add.text(w - 80, 20, 'Pause', { font: '24px Arial', fill: '#fff' });
      pause_label.fixedToCamera = true;
    pause_label.inputEnabled = true;
    pause_label.events.onInputUp.add(function () {
        // When the paus button is pressed, we pause the game
        game.paused = true;

        // Then add the menu
        menu = game.add.sprite(w/2, h/2, 'menu');
        menu.anchor.setTo(0.5, 0.5);

        // And a label to illustrate which menu item was chosen. (This is not necessary)
        choiseLabel = game.add.text(w/2, h-150, 'Click outside menu to continue', { font: '30px Arial', fill: '#fff' });
        choiseLabel.anchor.setTo(0.5, 0.5);
    });

    // Add a input listener that can help us return from being paused
    game.input.onDown.add(unpause, self);

    // And finally the method that handels the pause menu
    function unpause(event){
        // Only act if paused
        if(game.paused){
            // Calculate the corners of the menu
            var x1 = w/2 - 270/2, x2 = w/2 + 270/2,
                y1 = h/2 - 180/2, y2 = h/2 + 180/2;

            // Check if the click was inside the menu
            if(event.x > x1 && event.x < x2 && event.y > y1 && event.y < y2 ){
                // The choicemap is an array that will help us see which item was clicked
                var choisemap = ['one', 'two', 'three', 'four', 'five', 'six'];

                // Get menu local coordinates for the click
                var x = event.x - x1,
                    y = event.y - y1;

                // Calculate the choice 
                var choise = Math.floor(x / 90) + 3*Math.floor(y / 90);

                // Display the choice
                choiseLabel.text = 'You chose menu item: ' + choisemap[choise];
            }
            else{
                // Remove the menu and the label
                menu.destroy();
                choiseLabel.destroy();

                // Unpause the game
                game.paused = false;
            }
        }
    };
      game.stage.backgroundColor = '#90DF95';
      game.world.setBounds(0, 0);
      
      // These two lines add physics to the game world
      game.physics.startSystem(Phaser.Physics.ARCADE);
      game.world.enableBody = true;
      
      // set up cursor keys to allow user input (the options are set in update)
      cursor = game.input.keyboard.createCursorKeys();
      
      // add the main player to the game 70 pixels to the left and 100 pixels down from the top
      player = game.add.sprite(200, 200, 'player');

      // increase the size of the player by 50%
      player.scale.setTo(1.5);

      //add gravity to the player so that it falls down
      player.body.gravity.y = 500;
      
      // don't let the player leave the screen area
      player.body.collideWorldBounds=true;

      
      // add audio to two variable ready to play later in other functions
      splat = game.add.audio('splat');
      win = game.add.audio('win');


      //create groups for the walls, coins and enemies - what ever happens to the group happens
      // to all the members of the group 
      
      walls = game.add.group();
      coins = game.add.group();
      enemies = game.add.group();

      // if this is the first update, draw the wall up until the point it becomes continous
      for(var i = 0; i < 550; i += 20) {
        let topWall = game.add.sprite(i, 5, 'wall');
        let bottomWall = game.add.sprite(i, 395, 'wall');
        walls.add(topWall);
        walls.add(bottomWall);
      }
      text = game.add.text(
        game.world.centerX,
        game.world.centerY,
        score.toString(),
        {
          font: "65px Arial",
          fill: "#ff0044",
          align: "center"
        }
      );
      text.fixedToCamera = true;
    },

    update: function() {
        // Here we update the game 60 times per second - all code here is run all the time
      if(player.body.x % 20 === 0) {
        let topWall = game.add.sprite(player.body.x + 360, 0, 'wall');
        let bottomWall = game.add.sprite(player.body.x + 360, 395, 'wall');
        walls.add(topWall);
        walls.add(bottomWall);
      }
      
      if(player.body.x % 320 === 0) {
        let position = getRandomInt(3);
        for(var y = 20; y < 380; y += 20) {
          if(
            (position === 0 && y < 200)
            || (position === 1 && y > 200)
            || (position === 2 && (y < 120 || y > 280))
          ) {
            let barrier = game.add.sprite(player.body.x + 360, y, 'wall');
            walls.add(barrier);
          } else if(getRandomInt(4) === 0) {
            let coin = game.add.sprite(player.body.x + 360, y, 'coin');
            coins.add(coin);
          }
        }
      }
      
      if(player.body.x % 320 === 0) {
        walls.forEach(function(wall) {
          if(wall.x < player.body.x - 250) {
            walls.remove(wall);
          }
        }, this);
      }

        // make the player fall if no key is pressed
        player.body.velocity.y = 200;
        game.camera.x += 4.0;
        player.body.x += 4.0;
      
      // We draw a wall 360 pixels ahead of the current player position
      /*  
      enemies.forEach(enemy => {
          console.log(enemy);
          enemy.body.velocity.x = -200
        });
        */
      
        // Make the player and the walls collide , so player can't move through them
        game.physics.arcade.collide(player, walls, this.lose, null, this);

        // Call the 'takeCoin' function when the player takes a coin
        game.physics.arcade.overlap(player, coins, this.takeCoin, null, this);

        // Call the 'lose' function when the player touches the enemy
        game.physics.arcade.overlap(player, enemies, this.lose, null, this);
             
        // Make the player jump if he is touching the ground
        if (cursor.up.isDown || game.input.activePointer.isDown) {
          player.body.velocity.y = -250;
        }
  
    },
  
    // Function to kill/disappear a coin if player touches it
    takeCoin: function(player, coin) {
        coin.kill();
      
        //increase the score by one if a coin is taken
        score = score +1;
      text.text = score.toString();
      
        // restart the game dependent on score count of coin
        if (score == 40) {
           this.win();
        }
    },

      // Function to restart the game when a player touches an enemy
    lose: function() {
        splat.play();
        game.state.start('main');
    },  
  
    // Function to restart the game if there are no coins left
    win: function() {
        win.play();
        game.state.start('main');
    },
  
  
};

// Initialize the game at a certain size 
var game = new Phaser.Game(500, 500, Phaser.CANVAS, "", "main", false, false);  

//Add and start our play state 
game.state.add('main', playState);  
game.state.start('main');
