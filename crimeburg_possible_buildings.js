"use strict";

(function(global) {

//Public

    /* The police building must be externally accessible so it can be directly
        assigned
    */
    global.getPoliceBuilding = function() {
        return(policeBuilding);
        }

    /* Randomly pick a building for a particular class of street
    */
    global.generateBuilding = function(type) {
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


//Private

    /* Define array of possible buildings and a function to add a building to
        the array
    */
    var possibleBuildings = [];
    function registerBuilding(name, abbrev, peopleLiving, peopleEmployed,
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
            canBeRobbed: (name === "House") ? true : false,
            };
        obj.isLegal = typeof isLegal !== 'undefined' ? isLegal : true;
        obj.isPolice = typeof isPolice !== 'undefined' ? isPolice : false;
        possibleBuildings.push(obj)
        }

    /* Verify that building chances add up to 100% on each column - call this
        after all buildings are registered
    */
    function verifyBaseBuildings() {
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


    /* Police are never randomly generated, one police station is always assigned
    */
    registerBuilding("Police",                 "Pol ", 0,  2,      0,  0,  0, true, true);
    var policeBuilding = possibleBuildings[0];

    /* All other buildings have a certain chance to be generated in each street
        type
    */
    registerBuilding("Factory",                "Fact", 0,  40,     0,  0,  5);
    registerBuilding("Workshop",               "Work", 0,  10,     5,  5,  7);
    registerBuilding("Warehouse",              "Ware", 0,  15,     0,  5,  10);

    registerBuilding("House",                  "_^^_", 5,  1,      51, 47, 26);
    registerBuilding("Slum",                   "Slum", 10, 1,      10, 15, 20);
    registerBuilding("Grocery Store",          "Groc", 0,  8,      5,  3,  1);
    registerBuilding("Shop",                   "Shop", 0,  8,      17, 7,  5);
    registerBuilding("Pharmacy",               "Phar", 0,  8,      5,  3,  1);
    registerBuilding("Farm",                   "Farm", 10, 25,     0,  5,  5);
    registerBuilding("Barn",                   "Barn", 0,  5,      0,  2,  10);
    registerBuilding("Inn",                    "Inn ", 5,  15,     5,  5,  3);

    registerBuilding("Speakeasy",              "Spk ", 0,  8,      1,  1,  1, false);
    registerBuilding("Gambling Den",           "Gamb", 0,  8,      1,  1,  1, false);
    registerBuilding("House of Ill Repute",    "Whor", 0,  15,     0,  1,  5, false);

    verifyBaseBuildings();

})(this);
