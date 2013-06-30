"use strict";

var map = new function(global) {

// Public

    /* If you click on a building, this gets shown
    */
    this.showBuildingMenu = function(event, i, j) {

        var popup = $("#popup");
        var overlay = $("#overlay");

        /* Build up the content we want to show in the popup
        */
        if (_buildings[i][j].baseBuilding.canBeRobbed) {
            popup.html("<button onclick='game.robBuilding(" + i + ", " + j + ");'>Rob House</button>");
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

        /* Make sure we go away once clicked
        */
        overlay.click(function() {
            overlay.hide();
            });
        }

    this.getBuilding = function(i, j) {
        return(_buildings[i][j]);
        }

    this.setBuildingTips = function() {
        for (var i = 0; i < numRows; i++) {
            for (var j = 0; j < numCols; j++) {
                var tip = getBuildingTip(i, j);
                $("#" + getBuildingId(i, j)).prop("title", tip);
                }
            }
        }


// Private

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
    var _streets_lookup = [];
    (function() {
        var streets = []
        function addStreet(name, type, levelBonus) {
            var obj = {
                name: name,
                type: type,
                levelBonus: levelBonus,
                };
            streets.push(obj);
            }
        addStreet("Town Limits", classSecondary, 0);
        addStreet("B Street", classSecondary, 2);
        addStreet("A Street", classPrimary, 4);
        addStreet("Main Street", classMain, 6);
        addStreet("1st Street", classPrimary, 4);
        addStreet("2nd Street", classSecondary, 2);
        addStreet("Town Limits", classSecondary, 0);

        /* Define the streets used to generate each column
        */
        _streets_lookup = [streets[0], streets[1], streets[1], streets[2], streets[2],
                                streets[3], streets[3], streets[4], streets[4],
                                streets[5], streets[5], streets[6]];
        })();


    /* Keep track of various stats about Crimeburg
    */
    var _population = 0;
    var _employedLegal = 0;
    var _employedIllegal = 0;
    var _police = 0;

    /* Create arrays to hold all the buildings
    */
    var _buildings = [];
    for (var i = 0; i < numRows; i++) {
        _buildings[i] = [];
        }

    /* Initialize a building spot with a building
    */
    function setBuilding(row, column, baseBuilding, levelBonus) {
        _buildings[row][column] = {
            money: 0,
            fear: 0,
            value: 0,
            security: 0,
            level: levelBonus + randomInt(1, 6),
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
                if (this.column == _policeColumn) {
                    newSecurity += (difference(this.row, _policeRow) <= 5) ? 50 : 25;
                    }

                /* Within 2 columns, you get a minor bonus
                */
                else if (difference(this.column, _policeColumn) <= 2)
                    newSecurity += 15;

                /* Within 4, smaller bonus still
                */
                else if (difference(this.column, _policeColumn) <= 3)
                    newSecurity += 5;

                this.security = newSecurity;
                },

            levelName: function() {
                return(baseBuilding.nameForRank(this.getRank()));
                },

            getRank: function() {
                if (this.level <= 4) {
                    return(1);
                    }
                if (this.level <= 8) {
                    return(2);
                    }
                return(3);
                },

            rob: function(stolen) {

                /* Robbing someone adds a significant chunk of fear and drops
                    the level by 1 (to a minimum of 0)
                */
                this.fear += 50;
                this.level -= 1;
                this.level = Math.max(1, this.level);

                /* Also you lose money
                */
                this.money -= stolen;
                this.money = Math.max(0, this.money);

                /* Update the building tooltips after messing with them
                */
                this.calculateSecurity();
                renderMap();
                map.setBuildingTips();
                }

            };
        }

    /* Generate tooltip for a building
    */
    function getBuildingTip(row, column) {
        var building = _buildings[row][column];

        var text = building.levelName();
        text += "\n\nLevel: " + building.level;

        if (!building.baseBuilding.canBeRobbed) {
            return(text);
            }

        text += "\nMoney: " + formatMoney(building.money);
        text += "\nBuilding Value: " + formatMoney(building.value);
        text += "\nFear: " + building.fear;
        text += "\nSecurity: " + building.security;

        return(text);
        }

    /* Canonical id for element of a building
    */
    function getBuildingId(row, column) {
        return("buildingC" + row + "R" + column);
        }

    function calculateInitialBuildingStats() {
        for (var i = 0; i < numRows; i++) {
            for (var j = 0; j < numCols; j++) {

                /* We only care about values for robbable buildings
                */
                var baseBuilding = _buildings[i][j].baseBuilding;
                if (!baseBuilding.canBeRobbed)
                    continue;

                /* Start off with some reasonable values
                */
                _buildings[i][j].money = randomPercentOfValue(getAverageSalary(), 5, 25);
                _buildings[i][j].value = randomPercentOfValue(getAverageHouseValue(), 50, 150);
                _buildings[i][j].fear = getBaselineFear();
                _buildings[i][j].calculateSecurity();
                }
            }
        }


    /* We always start with a single, understaffed police station
    */
    var _policeRow = randomRow();
    var _policeColumn = randomColumn();
    setBuilding(_policeRow, _policeColumn, getPoliceBuilding(), _streets_lookup[_policeColumn].levelBonus);

    /* Nothing illegal will set up near the police
    */
    var _policeLimit = 5;
    function isNearPolice(row, column) {
        return ((difference(row, _policeRow) <= _policeLimit) &&
            (difference(column, _policeColumn) <= _policeLimit))
            return(true);
        }


    /* Choose our buildings
    */
    for (var i = 0; i < numRows; i++) {
        for (var j = 0; j < numCols; j++) {

            /* Make sure we don't overwrite the police station or any other
                building that's already been placed here
            */
            if (typeof _buildings[i][j] === 'undefined') {
                var baseBuilding = generateBuilding(_streets_lookup[j].type);

                /* If we're near the police, keep generating until we get a legal
                    building
                */
                while (!baseBuilding.isLegal && isNearPolice(i, j)) {
                    baseBuilding = generateBuilding(_streets_lookup[j].type);
                    }

                setBuilding(i, j, baseBuilding, _streets_lookup[j].levelBonus);
                }
            var baseBuilding = _buildings[i][j].baseBuilding;

            /* Add this building to our demographics
            */
            _population += baseBuilding.peopleLiving;
            if (baseBuilding.isLegal)
                _employedLegal += baseBuilding.peopleEmployed;
            else
                _employedIllegal += baseBuilding.peopleEmployed;
            if (baseBuilding.isPolice) {
                _police += baseBuilding.peopleEmployed;
                }
            }
        }


    /* Render map array into string
    */
    function renderMap() {
        var rendered = "";

        /* Define array of empty arrays to hold map
        */
        var map = [];
        for (var i = 0; i < numRows; i++) {
            map[i] = [];
            }

        for (var i = 0; i < numRows; i++) {
            for (var j = 0; j < numCols; j++) {
                var building = _buildings[i][j];
                var baseBuilding = building.baseBuilding;

                /* Appropriate formatting
                */
                var style = "";
                if (baseBuilding.isPolice) {
                    style += "color: blue; ";
                    }
                else if (!baseBuilding.isLegal) {
                    style += "color: red; ";
                    }
                if (building.getRank() <= 1) {
                    style += "font-weight: lighter; ";
                    }
                else if (building.getRank() >= 3) {
                    style += "font-weight: bolder; ";
                    }

                /* Add the building to the map
                */
                map[i][j] = "<span id='" + getBuildingId(i, j) + "' title='???' style='" + style + "'"
                map[i][j] += "onclick='map.showBuildingMenu(event, " + i + ", " + j + ");'>";
                map[i][j] += baseBuilding.abbrev + "</span>";

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
        }
    renderMap();

    /* Set up our buildings now they've been chosen
        NOTE: We have to wait until the HTML has been rendered to set the tips
            for it, as the tip code relies on being able to find the notes to
            set up
    */
    calculateInitialBuildingStats();
    this.setBuildingTips();

    /* Update population info based on building contents
    */
    updatePopulation(_population, _employedLegal, _employedIllegal, _police);
    };
