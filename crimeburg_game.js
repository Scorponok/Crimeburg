"use strict";

function nextMonth() {
    spendMonthly();
    }

function robBuilding(i, j) {

    var building = buildings[i][j];

    /* The security rating is our chance to be caught
    */
    var roll = randomPercent();
    if (roll <= building.security) {
        var fine = getFine();
        spendMoney(fine);
        alert("You got caught! You were fined " + formatMoney(fine) + ".");
        return;
        }

    /* Robbing someone adds a significant chunk of fear
    */
    building.fear += 50;

    /* You get 25-100% of money
    */
    var moneyStolen = randomPercentOfValue(building.money, 25, 100);
    building.money -= moneyStolen;
    earnMoney(moneyStolen);
    alert("You stole " + formatMoney(moneyStolen) + " from those poor people.");

    /* Update the building tooltips after messing with them
    */
    building.calculateSecurity();
    setBuildingTips();
    }