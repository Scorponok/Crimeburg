"use strict";

(function(global) {

//Public

    /* The police building must be externally accessible so it can be directly
        assigned
    */
    global.getPoliceBuilding = function() {
        return(_policeBuilding);
        }

    /* Randomly pick a building for a particular class of street
    */
    global.generateBuilding = function(type) {
        var roll = randomPercent();
        var soFar = 0;
        for (var i = 0; i < _possibleBuildings.length; i++) {
            soFar += _possibleBuildings[i].chance[type];
            if (soFar >= roll) {
                return(_possibleBuildings[i]);
                }
            }
        reportError("Couldn't find building on column " + type + " for roll " + roll + "!");
        exit();
        }


//Private

    /* Define array of possible buildings and a function to add a building to
        the array
    */
    var _possibleBuildings = [];
    function registerBuilding(name, abbrev, levels, peopleLiving, peopleEmployed,
                                chanceMain, chancePrimary, chanceSecondary,
                                isLegal, isPolice) {
        var obj = {
            name: name,
            abbrev: abbrev,
            levels: levels,
            peopleLiving: peopleLiving,
            peopleEmployed: peopleEmployed,
            chance: [chanceMain, chancePrimary, chanceSecondary],
            isLegal: true,
            isPolice: false,
            canBeRobbed: (name === "House") ? true : false,

            nameForRank: function(rank) {
                return(levels[rank-1]);
                },
            };
        obj.isLegal = typeof isLegal !== 'undefined' ? isLegal : true;
        obj.isPolice = typeof isPolice !== 'undefined' ? isPolice : false;
        _possibleBuildings.push(obj)
        }

    /* Verify that building chances add up to 100% on each column - call this
        after all buildings are registered
    */
    function verifyBaseBuildings() {
        var totals = [0, 0, 0];
        for (var i = 0; i < _possibleBuildings.length; i++) {
            for (var j = 0; j < numClasses; j++) {
                totals[j] += _possibleBuildings[i].chance[j];
                }
            }

        for (var i = 0; i < numClasses; i++) {
            if (totals[i] != 100) {
                reportError("Total for column " + i + " is " + totals[i] + "!");
                exit();
                }
            }
        }


    /* Police are never randomly generated, one police station is always assigned
    */
    registerBuilding("Police", "Pol ", ["Deputy", "Sheriff", "Police"],
        0,  2,      0,  0,  0, true, true);
    var _policeBuilding = _possibleBuildings[0];

    /* All other buildings have a certain chance to be generated in each street
        type
    */
    registerBuilding("Factory", "Fact", ["Sweatshop", "Factory", "Foundry"],
        0,  40,     0,  0,  5);
    registerBuilding("Workshop", "Work", ["Mill", "Workshop", "Studio"],
        0,  10,     5,  5,  7);
    registerBuilding("Warehouse", "Ware", ["Yard", "Warehouse", "Depot"],
        0,  15,     0,  5,  10);

    registerBuilding("House", "_^^_", ["Slum", "House", "Mansion"],
        5,  1,      61, 62, 46);
    registerBuilding("Grocery Store", "Groc", ["Fruit Stand", "Grocery", "Supermarket"],
        0,  8,      5,  3,  1);
    registerBuilding("Shop", "Shop", ["Five-and-dime", "Shop", "Store"],
        0,  8,      17, 7,  5);
    registerBuilding("Pharmacy", "Phar", ["Herbalist", "Pharmacy", "Druggist"],
        0,  8,      5,  3,  1);
    registerBuilding("Farm", "Farm", ["Freehold", "Farm", "Ranch"],
        10, 25,     0,  5,  5);
    registerBuilding("Barn", "Barn", ["Field", "Barn", "Garden"],
        0,  5,      0,  2,  10);
    registerBuilding("Inn", "Inn ", ["Flophouse", "Inn", "Hotel"],
        5,  15,     5,  5,  3);

    registerBuilding("Speakeasy", "Spk ", ["Dive Bar", "Speakeasy", "Club"],
        0,  8,      1,  1,  1, false);
    registerBuilding("Gambling Den", "Gamb", ["Dice Joint", "Gambling Den", "Casino"],
        0,  8,      1,  1,  1, false);
    registerBuilding("House of Ill Repute", "Whor", ["Cathouse", "Brothel", "Massage Parlour"],
        0,  15,     0,  1,  5, false);

    verifyBaseBuildings();

    })(this);
