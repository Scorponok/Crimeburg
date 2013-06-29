"use strict";

function updateMap(text) {
    $("#map").html(text);
    }

function updatePopulation(living, employedLegal, employedIllegal, police) {
    $("#population").text(living + " citizens, " + employedLegal + " legal jobs, " +
                            employedIllegal + " illegal jobs, " + police + " police");
    }

updateMap("generating Crimeburg...");



/* Define the classes of street
*/
var classMain = 0;
var classPrimary = 1;
var classSecondary = 2;

var numRows = 12;
var numCols = 12;



/* Helpful functions
*/
function randomInt(limitLow, limitHigh) {
    return(Math.floor(Math.random() * limitHigh) + limitLow);
    }
function randomPercent() {
    return(randomInt(1,100));
    }
function randomRow() {
    return(randomInt(0,numRows));
    }
function randomColumn() {
    return(randomInt(0,numCols));
    }




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



/* Define the streets and the classes of buildings on each
*/
var streets = []
function addStreet(name, type) {
    var obj = {
        name: name,
        type: type,
        };
    streets.push(obj);
    }
addStreet("Town Limits", classSecondary);
addStreet("B Street", classSecondary);
addStreet("A Street", classPrimary);
addStreet("Main Street", classMain);
addStreet("1st Street", classPrimary);
addStreet("2nd Street", classSecondary);
addStreet("Town Limits", classSecondary);

/* Define the streets used to generate each column
*/
var streets_lookup = [streets[0], streets[1], streets[1], streets[2], streets[2],
                        streets[3], streets[3], streets[4], streets[4],
                        streets[5], streets[5], streets[6]];


/* Define array of empty arrays to hold map
*/
var map = [];
for (var i = 0; i < numRows; i++) {
    map[i] = [];
    }


/* Choose our buildings
*/
var population = 0;
var employedLegal = 0;
var employedIllegal = 0;
var police = 0;


/* Someone gets overwritten by the police station!
*/
var buildings = [];
for (var i = 0; i < numRows; i++) {
    buildings[i] = [];
    }
var policeRow = randomRow();
var policeColumn = randomColumn();
buildings[policeRow][policeColumn] = policeBuilding;


for (var i = 0; i < numRows; i++) {

    for (var j = 0; j < numCols; j++) {
        if (typeof buildings[i][j] === 'undefined') {
            buildings[i][j] = generateBuilding(streets_lookup[j].type);
            }
        var building = buildings[i][j];

        population += building.peopleLiving;
        if (building.isLegal)
            employedLegal += building.peopleEmployed;
        else
            employedIllegal += building.peopleEmployed;
        if (building.isPolice) {
            police += building.peopleEmployed;
            }

        var start = "";
        if (building.isPolice)
            start = "<strong><font color='blue'>";
        else if (!building.isLegal)
            start = "<strong><font color='red'>";
        var end = (building.isLegal && !building.isPolice) ? "" : "</font></strong>";;
        map[i][j] = start + building.abbrev + end;
        }
    }


/* Render array of arrays into string
*/
var rendered = "";
for (var i = 0; i < map.length; i++) {
    for (var j = 0; j < map[i].length; j++) {
        rendered += map[i][j] + " "

        /* Road!
        */
        if ((j + 1) % 2 == 0) {
            rendered += "  ";
            }
        }

    rendered += "\n";

    /* Road!
    */
    if (i == 5) {
        rendered += "\n";
        }
    }

updateMap(rendered);


/* Population info
*/
updatePopulation(population, employedLegal, employedIllegal, police);
