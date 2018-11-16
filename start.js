/*

This is a javascript implementation of a simple ascii art RPG game

TODO: smart terrain generation
TODO: inventory
TODO: achievement / badges / honors (all should be funny)
TODO: skills
TODO: moving around
TODO: edge of the world : how to deal with it? 
TODO: item name generator
TODO: building screen
TODO: a wilderness zone
TODO: a town zone
TODO: a space zone (really  - I have big plans for interplanetary travel)
TODO: a combat zone
TODO: a store zone (buy / sell)
TODO: a character sheet zone
TODO: a quest zone (give/receive quests)
TODO: maybe a crafting zone to craft stuff
TODO: an event zone, so after X number of turns we can trigger events
TODO: animals 
TODO: NPC's
TODO: changelog
TODO: add credits
TODO: help screen, ditch tooltips
HINT: throw new Error("Something went badly wrong!");
LEARNED: about shallow copies. Thanks stackoverflow
TODO: make alert messages more random, funny and meaningful
TODO: death
TODO: remove bear trap after its been triggered

DONE STUFF: 

TODO: player object
TODO: put listener into a function. 

*/

const main_map = document.getElementById('main_map');
var turn = 0;
var grid = [];
var terrain;
var destination_terrain = 1;
var player = {};
var foo = [];
var array_for_map = [];

function initialize() {


console.log('function initialize start');
  player = {
    score: 0,
    name: "Player",
    level: 1,
    rank: "ready to be eaten",
    kingdom: "None",
    reputation: "huh?",
    skills: [["Not dying",1], ["Running away",10]],
    location_X: 0,
    location_Y: 0,
    location_Z: 0,
    health: 100,
    magic: 100,
    strength: 10,
    intelligence: 10,
    wisdom: 10,
    dexterity: 10,
    constitution: 10,
    charisma: 10,
    luck: 10,
    region: "newbie",
    achievements: {
                    achievement_1: {
                        name: 'test',
                        awarded: 'date'
                    }

    },
    inventory: {
                    weapon_1: {
                        name: 'The feeble axe of butterfly death!',
                        category: 'weapon',
                        damage: 20,
                        cursed: 0,
                        material: 'wood',
                        plus_to_hit: 0,
                        plus_to_damage: 0,
                        level: 1,
                        type: 'axe',
                        cost: 5,
                        equipped: 'no' 
                    },

                    weapon_2: {
                        name: 'The feeble axe of mosquito death!',
                        category: 'weapon',
                        damage: 20,
                        cursed: 0,
                        material: 'wood',
                        plus_to_hit: 0,
                        plus_to_damage: 0,
                        level: 1,
                        type: 'axe',
                        cost: 5,
                        equipped: 'no'
                    },
                    weapon_3: {
                        name: 'The axe of killing small things!',
                        category: 'weapon',
                        damage: 20,
                        cursed: 0,
                        material: 'wood',
                        plus_to_hit: 0,
                        plus_to_damage: 0,
                        level: 1,
                        type: 'axe',
                        cost: 5,
                        equipped: 'no'
                    },
                    thing_1: {
                        name: 'Incredible potion of doing nothing',
                        category: 'potion',
                        damage: 0,
                        cursed: 0,
                        material: 'glass',
                        plus_to_hit: 0,
                        plus_to_damage: 0,
                        level: 1,
                        type: 'potion',
                        cost: 2,
                        equipped: 'no'
                    }

                }

        }
        update_footer(player);
        update_messages(player);
        update_stats(player);
        document.getElementById('messages').innerHTML = "Welcome.";
        console.log('function initialize end');
        return player;
} 

function game_messages(message){

    if (message === "cant_go_there") {

        document.getElementById("messages").innerHTML += "<div class=\"alert\">" + 
        "<span class=\"closebtn\" onclick=\"this.parentElement.style.display='none';\">&times;</span> " + 
        "Your path is blocked </div>";
    }

    else if (message === "bear_trap") {

        document.getElementById("messages").innerHTML += "<div class=\"alert\">" + 
        "<span class=\"closebtn\" onclick=\"this.parentElement.style.display='none';\">&times;</span> " + 
        "You have walked into a bear trap and suffered horribly. The bears thank you. </div>";
    }

    else if (message === "triggered_bear_trap") {

        document.getElementById("messages").innerHTML += "<div class=\"information\">" + 
        "<span class=\"closebtn\" onclick=\"this.parentElement.style.display='none';\">&times;</span> " + 
        "You pass over a triggered bear trap. You wonder who was silly enough to actually step on a bear trap. <br /><br />...and then you look down at your leg.... </div>";
    }

}

function make_random_terrain() {
    console.log('function make random terrain start');
    // the stuff below generates an array which is then eventually translated into terrain
    var counter = 1;
    while ( counter <= 1215 ) {
    // the line below creates some random terrain. totally random, TODO: this needs to be smart.
    terrain = Math.floor(Math.random() * 5)+1;
    grid.push(terrain);
    counter += 1;
    }
    console.log('function make random terrain end');
    return grid;
}

function starting_map() {
    console.log('function starting map start');
    grid.splice(0, 30, 7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7);
    // grid.splice(1, 0, 7);
    // grid.splice(2, 0, 7);
    // grid.splice(3, 0, 7);
    // grid.splice(4, 0, 7);
    grid.splice(34, 0, 7);
    grid.splice(67, 0, 7);
    grid.splice(101, 0, 7);
    grid.splice(135, 0, 7);
    // the lines below are for bear traps. Because BEAR TRAPS!!!!
    grid.splice(109, 1, 8);
    grid.splice(100, 1, 8);
    grid.splice(523, 1, 8);
    grid.splice(58, 1, 8);
    grid.splice(999, 1, 8);
    grid.splice(241, 1, 8);
    grid.splice(387, 1, 8);
    grid.splice(366, 1, 8);
    grid.splice(42, 1, 8);
    grid.splice(49, 1, 8);



    // make player starting location. It's just TOTALLY for testing. Also, we should track the current player location for
    // reasons. 
    grid.splice(57, 0, 6);
    console.log('function starting map end');
}

function draw_map(array_for_map) {
   var temp_grid = array_for_map.slice(0);
    var counter = 0;
    var arrayLength = array_for_map.length;
    for (var i = 0; i < arrayLength; i++) {

    if (array_for_map[i] === 1 || array_for_map[i] === 2 || array_for_map[i] === 3){
        // this is plain, open terrain
        array_for_map[i] = "<i class=\"fas fa-ellipsis-h fa-fw\" style=\"color:#D2B48C\"></i>";
    } else if (array_for_map[i] === 4) {
        // this is a tree
        array_for_map[i] = "<i class=\"fas fa-tree fa-fw\" style=\"color:green\" title=\"A tree.\"></i>";
    } else if (array_for_map[i] === 5) {
        // this is a mountain or hill
        array_for_map[i] = "<i class=\"fas fa-mountain fa-fw\" style=\"color:grey\"  title=\"A mountain\"></i>";
    } else if (array_for_map[i] === 6) {
        // this is the player object
        array_for_map[i] = "<i class=\"fas fa-child fa-fw\" style=\"color:red\" title=\"You.\"></i>";
    } else if (array_for_map[i] === 7) {
        // impossible, impassible mountains of Thogar (aka Thogars Teeth)
        array_for_map[i] = "<i class=\"fas fa-mountain fa-fw\" style=\"color:black\" title=\"Impossible impassible mountains of Thogar (aka Thogars Teeth)\"></i>";
    } else if (array_for_map[i] === 8) {
        // ACTIVE bear trap. Heh. 
        array_for_map[i] = "<i class=\"fab fa-codepen fa-fw\" style=\"color:black\" title=\"Bear Attractor\"></i>";
    } else if (array_for_map[i] === 9) {
        // TRIGGERED bear trap. Heh. 
        array_for_map[i] = "<i class=\"fab fa-codepen fa-fw\" style=\"color:grey\" title=\"Triggered Bear Attractor\"></i>";
    }

}
 
array_for_map = array_for_map.join('');

// this is where we draw the map. once we draw it, we want to turn grid back into a normal array. 
document.getElementById("main_map").innerHTML = array_for_map;

grid = temp_grid.slice(0);

return array_for_map;
}

function map_interaction_item(map_object,destination){    
    console.log("hi. I'm map_interaction_item function, and you've just passed me: " + map_object);

    if (map_object === 1 || map_object === 2 || map_object === 3 ) {
        return ("allow_move")

    }   else if (map_object === 8) {
        // bear trap code: 
        player.health = (player.health - 60);
        player.skills.push(['Friend of the bear',1]);
        game_messages("bear_trap");
        grid[destination] = 9;
        return ("allow_move")

    } else if (map_object === 9) {
            game_messages("triggered_bear_trap");
            return ("allow_move")


    } else {
        return("prohibit_move")

    }
}

function move(direction) {
// issue with not counting until the first move.
  if (direction === 'r'){

    // let's start by getting the current location of the player
    var current_location = grid.indexOf(6);
    // now the destination. This ASSUMES A 34 LENGTH array
    var destination = current_location + 1;
    // now we check if terrain is passable
    var result_of_move = map_interaction_item(grid[destination],destination);

    if (result_of_move === "allow_move") {
        // now lets replace the terrain that was in the old place.
        grid[destination - 1] = destination_terrain;
        // now let's get the terrain the place they want to go. we need this so we can replace it when they move later on. 
        destination_terrain = grid[current_location + 1];
        // now let's move the player icon. 
        grid[destination] = 6;
            // increment the turn counter 
            turn = turn + 1;
            // now lets update the map
            draw_map(grid);
            update_footer();
            update_stats(player);

    } else {
        game_messages("cant_go_there");
    } 
}

     else if (direction === 'l'){

        // let's start by getting the current location of the player
        var current_location = grid.indexOf(6);
        // now the destination. This ASSUMES A 34 LENGTH array
        var destination = current_location - 1;
        // now we check if terrain is passable
        var result_of_move = map_interaction_item(grid[destination],destination);
    
        if (result_of_move === "allow_move") {
            // now lets replace the terrain that was in the old place.
            grid[destination + 1] = destination_terrain;
            // now let's get the terrain the place they want to go. we need this so we can replace it when they move later on. 
            destination_terrain = grid[current_location - 1];
            // now let's move the player icon. 
            grid[destination] = 6;
                // increment the turn counter 
                turn = turn + 1;
                // now lets update the map
                draw_map(grid);
                update_footer();
                update_stats(player);
    
        } else {
            game_messages("cant_go_there");
        } 
    


  } else if (direction === 'u'){

    // let's start by getting the current location of the player
    var current_location = grid.indexOf(6);
    // now the destination. This ASSUMES A 34 LENGTH array
    var destination = current_location - 34;
    // now we check if terrain is passable
    var result_of_move = map_interaction_item(grid[destination],destination);

    if (result_of_move === "allow_move") {
        // now lets replace the terrain that was in the old place.
        grid[destination + 34] = destination_terrain;
        // now let's get the terrain the place they want to go. we need this so we can replace it when they move later on. 
        destination_terrain = grid[current_location - 34];
        // now let's move the player icon. 
        grid[destination] = 6;
            // increment the turn counter 
            turn = turn + 1;
            // now lets update the map
            draw_map(grid);
            update_footer();
            update_stats(player);

    } else {
        game_messages("cant_go_there");
    } 

    } else if (direction === 'd'){

        // let's start by getting the current location of the player
        var current_location = grid.indexOf(6);
        // now the destination. This ASSUMES A 34 LENGTH array
        var destination = current_location + 34;
        // now we check if terrain is passable
        var result_of_move = map_interaction_item(grid[destination],destination);
    
        if (result_of_move === "allow_move") {
            // now lets replace the terrain that was in the old place.
            grid[destination - 34] = destination_terrain;
            // now let's get the terrain the place they want to go. we need this so we can replace it when they move later on. 
            destination_terrain = grid[current_location + 34];
            // now let's move the player icon. 
            grid[destination] = 6;
                // increment the turn counter 
                turn = turn + 1;
                // now lets update the map
                draw_map(grid);
                update_footer();
                update_stats(player);
    
        } else {
            game_messages("cant_go_there");
        } 

    return
  }

} 

function update_footer() {
    document.getElementById("footer").innerHTML = "Health: " + health_number_to_text(player.health) + " | Magic: " + player.magic + " | Turn: " + turn;
}

function update_messages() {
// if messages are a certain length, do a "more messages" or something.
}

function health_number_to_text(value){
    var condition;
    if (value < 0){
        condition = "<font color=\"black\"><strong>DEAD!(" + value + ")</strong></font>";
        return condition
    } else if (value < 10){
        condition = "<font color=\"#FF001F\"><strong>Basically about dead.(" + value + ")</strong></font>";
        return condition
    } else if (value < 20) {
        condition = "<font color=\"#FF001F\"><strong>Falling off the edge of death. (" + value + ")</strong></font>";
        return condition
    } else if (value < 30) {
        condition = "<font color=\"#FF001F\"><strong>Edge of death(" + value + ")</strong></font>";
        return condition
    } else if (value < 40) {
        condition = "<font color=\"#FF001F\"><strong>Mildly decapitated (" + value + ")</strong></font>";
        return condition
    } else if (value < 50) {
        condition = "<font color=\"#FF001F\"><strong>Damaged liver(" + value + ")</strong></font>";
        return condition
    } else if (value < 60) {
        condition = "<font color=\"#FBB004\"><strong>Missing part of leg(" + value + ")</strong></font>";
        return condition
    } else if (value < 70) {
        condition = "<font color=\"green\"><strong>Unhealthy (" + value + ")</strong></font>";
        return condition
    } else if (value < 80) {
        condition = "<font color=\"green\"><strong>Less healthy (" + value + ")</strong></font>";
        return condition
    } else if (value < 101) {
        condition =  "<font color=\"green\"><strong>Healthy (" + value + ")</strong></font>";
        return condition
    }
}

function update_stats(player) {
    document.getElementById("stats_and_inventory_block").innerHTML = "<div class=\"category\">Skills</div><ul>";
    for(var i in player.skills) {
        document.getElementById("stats_and_inventory_block").innerHTML += "<li>" + player.skills[i][0] + " : " + player.skills[i][1] + "</li>";
    }
    document.getElementById("stats_and_inventory_block").innerHTML += "</ul><br />";
    document.getElementById("stats_and_inventory_block").innerHTML += "<div class=\"category\">Inventory</div><ul>";
    
    var print_header = false;
    for(var j in player.inventory) {
        if (player.inventory[j].category === 'weapon') {
            if (!print_header) {
                document.getElementById("stats_and_inventory_block").innerHTML += "<strong>Sharp pokey things:</strong><ul>";
                print_header = true;
            }
                document.getElementById("stats_and_inventory_block").innerHTML += "<li>" + player.inventory[j].name + "</li>";


        } else if (player.inventory[j].category === 'armor') {
            print_header = false;
            if (!print_header) {
                document.getElementById("stats_and_inventory_block").innerHTML += "<br /><strong>Protection! Sort of...</strong><ul>";
                print_header = true;
            }
            document.getElementById("stats_and_inventory_block").innerHTML += "<li>" + player.inventory[j].name + "</li>";
        }

        else if (player.inventory[j].category === 'magic_items') {
            print_header = false;
            if (!print_header) {
                document.getElementById("stats_and_inventory_block").innerHTML += "<br /><strong>Glowing Uselessness:</strong><ul>";
                print_header = true;
            }
            document.getElementById("stats_and_inventory_block").innerHTML += "<li>" + player.inventory[j].name + "</li>";
        }

         else if (player.inventory[j].category === 'potion') {
            print_header = false;
            if (!print_header) {
                document.getElementById("stats_and_inventory_block").innerHTML += "<br /><strong>Drinky things:</strong><ul>";
                print_header = true;
            }
            document.getElementById("stats_and_inventory_block").innerHTML += "<li>" + player.inventory[j].name + "</li>";
        }
    }

    document.getElementById("stats_and_inventory_block").innerHTML += "</ul>";


    document.getElementById("stats_and_inventory_block").innerHTML += "<br /> <div class=\"category\">Achievements</div><ul>";
    for(var k in player.achievements) {
        document.getElementById("stats_and_inventory_block").innerHTML += "<li>" + player.achievements[k].name +  "</li>";
    }
}



function main_listener() {
    // the code below is used from https://medium.com/@uistephen/keyboardevent-key-for-cross-browser-key-press-check-61dbad0a067a
    // I also used this site for keycodes: https://keycode.info/
    // the code below listens for keys being released, and then triggers a function which "does something". 

    document.addEventListener('keyup', function (event) {
    if (event.defaultPrevented) {
        return;
    }

    var key = event.key || event.keyCode;

    if (key === 'Escape' || key === 'Esc' || key === 27) {
        document.getElementById("messages").innerHTML = key;

    } else if (key === 'w' || key === 'W') {
        player.health -= 10;
        update_footer(player);


        } else if (key === 'ArrowRight' || key === 39) {
            // then we call the move function and pass 'r' for right.
            move('r');
            


        } else if (key === 'ArrowLeft' || key === 39) {
            // then we call the move function and pass 'r' for right.
            move('l')
            // finally, we update the map after the move has been completed (but this might no belong here).
            document.getElementById("main_map").innerHTML = draw_map(grid); 
            // increment the turn counter 
            turn = turn + 1;

        } else if (key === 'ArrowUp' || key === 39) {
            // then we call the move function and pass 'r' for right.
            move('u')
            // finally, we update the map after the move has been completed (but this might no belong here).
            document.getElementById("main_map").innerHTML = draw_map(grid); 
            // increment the turn counter 
            turn = turn + 1;

            

        } else if (key === 'ArrowDown' || key === 39) {
            // then we call the move function and pass 'r' for right.
            move('d')
            // finally, we update the map after the move has been completed (but this might no belong here).
            document.getElementById("main_map").innerHTML = draw_map(grid); 
            // increment the turn counter 
            turn = turn + 1;
            
        } else if (key === '?' || key === 191) {
            document.getElementById("messages").innerHTML = key; 
            
            
        } 
    });
}

initialize();
// must I have the line below? 
const entries = Object.entries(player)
make_random_terrain();
starting_map();
draw_map(grid);
main_listener();
