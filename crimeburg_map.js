"use strict";

function updateMap(text) {
    $("#map").html(text);
    }

function updatePopulation(living, employedLegal, employedIllegal, police) {
    $("#population").text(living + " citizens, " + employedLegal + " legal jobs, " +
                            employedIllegal + " illegal jobs, " + police + " police");
    }

updateMap("generating Crimeburg...");



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
        row: row,
        column: column,
        baseBuilding: baseBuilding,

        calculateSecurity: function() {

            /* The more scared people are of crime, the more alert they are to it
            */
            var newSecurity = this.fear;

            /* The closer the police station is, the more secure a building is - if
                within 1-5 spaces or just on the same street, you get a big bonus
            */
            if (this.column == policeColumn) {
                newSecurity += (difference(this.row, policeRow) <= 5) ? 50 : 25;
                }

            /* Within 2 columns, you get a minor bonus
            */
            else if (difference(this.column, policeColumn) <= 2)
                newSecurity += 15;

            /* Within 4, smaller bonus still
            */
            else if (difference(this.column, policeColumn) <= 3)
                newSecurity += 5;

            this.security = newSecurity;
            }

        };
    }

function getBuildingTip(row, column) {
    var text = "";
    var building = buildings[row][column];

    if (!building.baseBuilding.canBeRobbed) {
        return("(can't rob this building)");
        }

    text += "Money: " + formatMoney(building.money) + "\n";
    text += "Building Value: " + formatMoney(building.value) + "\n";
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
            buildings[i][j].money = randomPercentOfValue(getAverageSalary(), 5, 25);
            buildings[i][j].value = randomPercentOfValue(getAverageHouseValue(), 50, 150);
            buildings[i][j].fear = getBaselineFear();
            buildings[i][j].calculateSecurity();
            }
        }
    }


/* We always start with a single, understaffed police station
*/
var policeRow = randomRow();
var policeColumn = randomColumn();
setBuilding(policeRow, policeColumn, getPoliceBuilding());

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
        map[i][j] = "<span id='" + getBuildingId(i, j) + "' title='???' onclick='showBuildingMenu(event, " + i + ", " + j + ");'>";
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


function showBuildingMenu(event, i, j) {

    var popup = $("#popup");
    var overlay = $("#overlay");

    /* Build up the content we want to show in the popup
    */
    if (buildings[i][j].baseBuilding.canBeRobbed) {
        popup.html("<button onclick='robBuilding(" + i + ", " + j + ");'>Rob House</button>");
        }
    else {
        popup.html("<font color='grey'>(can't do anything with this building)</font>");
        }

    /* Position appropriately
    */
    var x = event.pageX - 25;
    var y = event.pageY + 25;
    $("#popup").css({
        left: x + "px",
        top: y + "px",
        });
    overlay.show();

    /* Make sure we go away if clicked
    */
    overlay.click(function() {
        overlay.hide();
        });
    }
