"use strict";

var game = new function() {

    this.nextMonth = function() {
        player.spendMonthly();
        }

    this.robBuilding = function(i, j) {
        var building = map.getBuilding(i, j);

        /* The security rating is our chance to be caught
        */
        var roll = randomPercent();
        if (roll <= building.security) {
            var fine = player.getFine();
            player.spendMoney(fine);
            alert("You got caught! You were fined " + formatMoney(fine) + ".");
            return;
            }

        /* You get 25-100% of money
        */
        var moneyStolen = randomPercentOfValue(building.money, 25, 100);
        player.earnMoney(moneyStolen);
        alert("You stole " + formatMoney(moneyStolen) + " from those poor people.");

        building.rob(moneyStolen);
        }
    };