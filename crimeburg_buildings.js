"use strict";

/* Define array of possible buildings and their likelyhoods of appearing
*/
var possibleBuildings = [];
var numClasses = 3;

function addBuildingChance(name, abbrev, peopleLiving, peopleEmployed,
                            chanceMain, chancePrimary, chanceSecondary,
                            isLegal, isPolice) {
    var obj = {
        name: name,
        abbrev: abbrev,
        peopleLiving: peopleLiving,
        peopleEmployed: peopleEmployed,
        chance: [chanceMain, chancePrimary, chanceSecondary],
        isLegal: true,
        isPolice: false,
        };
    obj.isLegal = typeof isLegal !== 'undefined' ? isLegal : true;
    obj.isPolice = typeof isPolice !== 'undefined' ? isPolice : false;
    possibleBuildings.push(obj)
    }


/* Police are never randomly generated, one police station is always assigned
*/
addBuildingChance("Police",                 "Pol ", 0,  2,      0,  0,  0, true, true);
var policeBuilding = possibleBuildings[0];

addBuildingChance("Factory",                "Fact", 0,  40,     0,  0,  5);
addBuildingChance("Workshop",               "Work", 0,  10,     5,  5,  7);
addBuildingChance("Warehouse",              "Ware", 0,  15,     0,  5,  10);

addBuildingChance("House",                  "^^^^", 5,  1,      51, 47, 26);
addBuildingChance("Slum",                   "^ss^", 10, 1,      10, 15, 20);
addBuildingChance("Grocery Store",          "Groc", 0,  8,      5,  3,  1);
addBuildingChance("Shop",                   "Shop", 0,  8,      17, 7,  5);
addBuildingChance("Pharmacy",               "Phar", 0,  8,      5,  3,  1);
addBuildingChance("Farm",                   "Farm", 10, 25,     0,  5,  5);
addBuildingChance("Barn",                   "Barn", 0,  5,      0,  2,  10);
addBuildingChance("Inn",                    "Inn ", 5,  15,     5,  5,  3);

addBuildingChance("Speakeasy",              "Spk ", 0,  8,      1,  1,  1, false);
addBuildingChance("Gambling Den",           "Gamb", 0,  8,      1,  1,  1, false);
addBuildingChance("House of Ill Repute",    "Whor", 0,  15,     0,  1,  5, false);


/* Verify that buildings add up to 100% on each column
*/
function verifyBuildings() {
    var totals = [0, 0, 0];
    for (var i = 0; i < possibleBuildings.length; i++) {
        for (var j = 0; j < numClasses; j++) {
            totals[j] += possibleBuildings[i].chance[j];
            }
        }

    for (var i = 0; i < numClasses; i++) {
        if (totals[i] != 100) {
            updateMap("Total for column " + i + " is " + totals[i] + "!");
            exit();
            }
        }
    }
verifyBuildings();


/* Define function to randomly generate a building
*/
function generateBuilding(type) {
    var roll = randomPercent();
    var soFar = 0;
    for (var i = 0; i < possibleBuildings.length; i++) {
        soFar += possibleBuildings[i].chance[type];
        if (soFar >= roll) {
            return(possibleBuildings[i]);
            }
        }
    updateMap("Couldn't find building on column " + type + " for roll " + roll + "!");
    exit();
    }
