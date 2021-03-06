

//Game States
//Wrap the game logic in a startGame() function
//When the player is defeated or there are no more enemies, call an endGame() function that:
//  *Alerts the player's total stats
//  *Asks the player if they want to play again
//  *If yes, call startGame() to restart the game
//After the player skips or defeats an enemy (and there are still more robots to fight):
//  *Ask the player is they want to "shop"
//  *If no, continue as normal
//  *if yes, call the shop() function
//  *In the shop() function, ask player if they want to "refill" health, "upgrade" attack, or "leave" the shop
//  *If refill, subtract money and increase health
//  *If upgrade, subtract money and increase attack power
//  *If leave, alert goodbye and exit funtion
//  *If any other invalid option, call shop() again

// Alert users that they are starting the round
//window.alert("Welcome to Robot Gladiators!");

var fightOrSkip = function () {
    //ask user if they'd like to fight or run
    var promptFight = window.prompt("Would you like to FIGHT or SKIP this battle? Enter 'FIGHT' or 'SKIP' to choose.");

    if (promptFight === "" || promptFight === null) {
        window.alert("You need to pick a valid answer! Please try again.");
        return fightorskip();
    }
    
    promptFight = promptFight.toLowerCase();
    //if user picks "skip" confirm and then stop the loop
    if (promptFight === "skip") {
        //confirm user wants to skip
        var confirmSkip = window.confirm("Are you sure you'd like to quit?");

        //if yes (true), leave the fight
        if (confirmSkip) {
            window.alert(playerInfo.name + " has decided to skip this fight.  Goodbye!");        
            //subtract money from playerInfo.money for skipping
            playerInfo.money = Math.max(0, playerInfo.money - 10);
            return true;
        }
    }
    
}

var fight = function(enemy) {
    // keep track of who goes first
    var isPlayerTurn = true;

  // randomly change turn order
    if (Math.random() > 0.5) {
      isPlayerTurn = false;
    }
    
    while (playerInfo.health > 0 && enemy.health > 0) {
      if (isPlayerTurn) {
        // ask user if they'd like to fight or skip using fightOrSkip function
        if (fightOrSkip()) {
          // if true, leave fight by breaking loop
          break;
        }

        var damage = randomNumber(playerInfo.attack - 3, playerInfo.attack);

        // remove enemy's health by subtracting the amount we set in the damage variable
        enemy.health = Math.max(0, enemy.health - damage);
        console.log(
          playerInfo.name +
            " attacked " +
            enemy.name +
            ". " +
            enemy.name +
            " now has " +
            enemy.health +
            " health remaining."
        );

        // check enemy's health
        if (enemy.health <= 0) {
          window.alert(enemy.name + " has died!");

          // award player money for winning
          playerInfo.money = playerInfo.money + 20;

          // leave while() loop since enemy is dead
          break;
        } else {
          window.alert(enemy.name + " still has " + enemy.health + " health left.");
        }
        // player gets attacked first
      } else {
        var damage = randomNumber(enemy.attack - 3, enemy.attack);

        // remove enemy's health by subtracting the amount we set in the damage variable
        playerInfo.health = Math.max(0, playerInfo.health - damage);
        console.log(
          enemy.name +
            " attacked " +
            playerInfo.name +
            ". " +
            playerInfo.name +
            " now has " +
            playerInfo.health +
            " health remaining."
        );

        // check player's health
        if (playerInfo.health <= 0) {
          window.alert(playerInfo.name + " has died!");
          // leave while() loop if player is dead
          break;
        } else {
          window.alert(playerInfo.name + " still has " + playerInfo.health + " health left.");
        }
      }
      // switch turn order for next round
      isPlayerTurn = !isPlayerTurn;
    }
  };

//function to start a new game
var startGame = function() {
    //reset player stats
    playerInfo.reset();

    for(var i = 0; i < enemyInfo.length; i++) {
        if (playerInfo.health > 0) {
            //tell user which round they're in
            window.alert("Welcome to robot gladiators! Round " + ( i + 1 ) );
            //use debugger to pause script
            // debugger;
            // pick a new enemy to fight
            var pickedEnemyObj = enemyInfo[i];
            //reset enemy health before new fight
            pickedEnemyObj.health = randomNumber(40, 60);
            //call fight function with enemy robot
            fight(pickedEnemyObj);
        } 
        
        //if we're not at the last enemy in the array
        if (playerInfo.health > 0 && i < enemyInfo.length - 1 && playerInfo.money > 6) {
            //ask if user wants to use the store before the next round
            var storeConfirm = window.confirm("The fight is over, visit the store before the next round?");

            //if yes, take them to the store() function
            if (storeConfirm) {
            shop();
            }
        }
        
    }

    //after the loop ends, player is either out of health or opponents, so run endgame function
    endGame();
};

var endGame = function() {
    window.alert("The game has now ended. Let's see how you did!");
    //if player is still alive, player wins!
    if (playerInfo.health > 0) {
        window.alert("Great job, you've survived the game! You now have a score of " + playerInfo.money + ",");
    }
    else {
        window.alert("You've lost your robot in battle.");
    }

    var highScore = localStorage.getItem("highScore");
    if (highScore === null) {
        highScore = 0;
    }

    if (highScore < playerInfo.money) {
        localStorage.setItem("highscore", playerInfo.money);
        localStorage.setItem("name", playerInfo.name);

        window.alert(playerInfo.name + " now has the high score of " + playerInfo.money + "!");
    }
    else {
        window.alert(playerInfo.name + " did not beat the High Score of, " + highScore + " maybe next time!");
    }

    //ask to play again
    var playAgainConfirm = window.confirm("Would you like to play again?");

    if (playAgainConfirm) {
        //restart the game
        startGame();
    }
    else {
        window.alert("Thank you for playing Robot Gladiators! Come back soon!");
    }

    
}

var shop = function() {
    var shopOptionPrompt = window.prompt(
        "Would you like to REFILL your health, UPGRADE your attack, or LEAVE the store? Please enter 1 for REFILL, 2 for UPGRADE, or 3 for LEAVE."
    );
    shopOptionPrompt = parseInt(shopOptionPrompt);
    //use switch to carry out action
    switch (shopOptionPrompt) {
        case 1:
            playerInfo.refillHealth();
            break;

        case 2:    
            playerInfo.upgradeAttack()
            break;

        case 3:
            window.alert("Leaving the store.");
            //do nothing so function will end
            break;
        default:
            window.alert("You did not pick a valid option. Try again.");
            //call shop again to force player to pick a valid option
            shop();
            break;
    }
}

//function to generate a random numeric value
var randomNumber = function(min, max) {
    var value = Math.floor(Math.random() * (max - min +1) + min);

    return value;
};

var getPlayerName = function() {
    var name = "";

    while (name === "" || name === null) {
        name = prompt("What is your robot's name?");
    }

    console.log("Your robot's name is " + name);
    return name;
}

var playerInfo = {
    name: getPlayerName(),
    health: 100,
    attack: 10,
    money: 10,
    reset: function () {
        this.health = 100;
        this.money = 10;
        this.attack = 30;
    },
    refillHealth: function() {
        if (this.money >= 7) {
            window.alert("Refilling player's health by 20 for 7 dollars.");  
            this.health += 20;
            this.money -= 7;
        }  
        else {
            window.alert("You don't have enough money!");
        }
    },
    upgradeAttack: function() {
        if (this.money >=7) {
            window.alert("Upgrading player's attack by 6 for 7 dollars.");
            this.attack += 6;
            this.money -= 7;
        }
        else {
            window.alert("You don't have enough money!");
        }
    }
};

var enemyInfo = [
    {
        name: "Roborto",
        attack: randomNumber(10, 14)
    },
    {
        name: "Amy Android",
        attack: randomNumber(10, 14)
    },
    {
        name: "Robo Trumble",
        attack: randomNumber(10, 14)
    }
];

//start the game when the page loads
startGame();