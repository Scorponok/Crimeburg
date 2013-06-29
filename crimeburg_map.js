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
function difference(num1, num2) {
    return(Math.abs(num1 - num2));
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


/* Keep track of various stats about Crimeburg
*/
var population = 0;
var employedLegal = 0;
var employedIllegal = 0;
var police = 0;


var buildings = [];
for (var i = 0; i < numRows; i++) {
    buildings[i] = [];
    }

function setBuilding(row, column, baseBuilding) {
    buildings[row][column] = {
        money: 0,
        fear: 0,
        value: 0,
        security: 0,
        baseBuilding: baseBuilding,
        };
    }

function getBuildingTip(row, column) {
    var text = "";
    var building = buildings[row][column];

    if (!building.baseBuilding.canBeRobbed) {
        return("(can't rob this building)");
        }

    text += "Money: $" + building.money + "\n";
    text += "Value: $" + building.value + "\n";
    text += "Fear: " + building.fear + "\n";
    text += "Security: " + building.security;

    return(text);
    }

function getBuildingId(row, column) {
    return("buildingC" + row + "R" + column);
    }

function setBuildingTips() {
    for (var i = 0; i < numRows; i++) {
        for (var j = 0; j < numCols; j++) {
            $("#" + getBuildingId(i, j)).prop("title", getBuildingTip(i, j));
            }
        }
    }

function calculateInitialBuildingStats() {
    for (var i = 0; i < numRows; i++) {
        for (var j = 0; j < numCols; j++) {

            /* We only care about values for robbable buildings
            */
            var baseBuilding = buildings[i][j].baseBuilding;
            if (!baseBuilding.canBeRobbed)
                continue;

            /* Start off with some reasonable values
            */
            buildings[i][j].money = getAverageSalary() * 0.25;
            buildings[i][j].value = getAverageHouseValue();
            buildings[i][j].fear = getBaselineFear();
            buildings[i][j].security = 0; // calculate this

            /* Meddle with the cash and property value so they're not all the
                same
            */
            }
        }
    }


/* We always start with a single, understaffed police station
*/
var policeRow = randomRow();
var policeColumn = randomColumn();
setBuilding(policeRow, policeColumn, policeBuilding);

/* Nothing illegal will set up near the police
*/
var policeLimit = 5;
function isNearPolice(row, column) {
    return ((difference(row, policeRow) <= policeLimit) &&
        (difference(column, policeColumn) <= policeLimit))
        return(true);
    }


/* Choose our buildings
*/
for (var i = 0; i < numRows; i++) {
    for (var j = 0; j < numCols; j++) {

        /* Make sure we don't overwrite the police station or any other
            building that's already been placed here
        */
        if (typeof buildings[i][j] === 'undefined') {
            var baseBuilding = generateBuilding(streets_lookup[j].type);

            /* If we're near the police, keep generating until we get a legal
                building
            */
            while (!baseBuilding.isLegal && isNearPolice(i, j)) {
                baseBuilding = generateBuilding(streets_lookup[j].type);
                }

            setBuilding(i, j, baseBuilding);
            }
        var building = buildings[i][j].baseBuilding;

        /* Add this building to our demographics
        */
        population += building.peopleLiving;
        if (building.isLegal)
            employedLegal += building.peopleEmployed;
        else
            employedIllegal += building.peopleEmployed;
        if (building.isPolice) {
            police += building.peopleEmployed;
            }

        /* Appropriate formatting
        */
        var start = "";
        if (building.isPolice)
            start = "<strong><font color='blue'>";
        else if (!building.isLegal)
            start = "<strong><font color='red'>";
        var end = (building.isLegal && !building.isPolice) ? "" : "</font></strong>";;

        /* Add the building to the map
        */
        map[i][j] = "<span id='" + getBuildingId(i, j) + "' title='???'>";
        map[i][j] += start + building.abbrev + end;
        map[i][j] += "</span>";
        }
    }


/* Render map array into string
*/
var rendered = "";
for (var i = 0; i < map.length; i++) {
    for (var j = 0; j < map[i].length; j++) {
        rendered += map[i][j] + " "

        /* Vertical road!
        */
        if ((j + 1) % 2 == 0) {
            rendered += "  ";
            }
        }

    rendered += "\n";

    /* Horizontal road!
    */
    if (i == 5) {
        rendered += "\n";
        }
    }

updateMap(rendered);

calculateInitialBuildingStats();
setBuildingTips();


/* Update population info
*/
updatePopulation(population, employedLegal, employedIllegal, police);
