"use strict";

/* There are three classes of street
*/
var numClasses = 3;
var classMain = 0;
var classPrimary = 1;
var classSecondary = 2;

/* Crimeburg takes place on a 12x12 map of buildings
*/
var numRows = 12;
var numCols = 12;

/* Needed statistics
*/
function getAverageSalary() {
    return(1000);
    }
function getAverageHouseValue() {
    return(8000);
    }
function getBaselineFear() {
    return(20);
    }

/* Helpful functions
*/
function randomInt(limitLow, limitHigh) {
    return(Math.floor(Math.random() * (limitHigh - limitLow)) + limitLow);
    }
function randomPercent() {
    return(randomInt(1,100));
    }
function randomPercentOfValue(value, lowPercent, highPercent) {
    var percent = randomInt(lowPercent, highPercent);
    return(value * percent / 100);
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

function formatMoney(amount) {
    return("$" + amount.toFixed(2));
    }





