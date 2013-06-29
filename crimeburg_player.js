"use strict";

var player = {
    money: 500,
    hasLost: false,
    };

function isBroke() {
    return(player.money <= 0);
    }

function formatMoney(money) {
    return("$" + money.toFixed(2));
    }

function changeMoney(amount) {
    player.money += amount;

    if (isBroke())
        player.hasLost = true;

    updateMoneyLabel();
    }

function spendMoney(money) {
    changeMoney(-money);
    }

function earnMoney(money) {
    changeMoney(money);
    }

function spendMonthly() {
    var outgoings = Math.max(100, player.money * 0.2);
    spendMoney(outgoings);
    }

function updateMoneyLabel() {
    var money = player.money < 0 ? 0 : player.money;
    var text = formatMoney(money);
    if (hasLost()) {
        text += " <strong><font color='red'>Sorry, you lost!</font></strong>";
        }
    $("#money").html(text);
    }

function hasLost() {
    return(player.hasLost);
    }

/* Getting caught means you're fined half your cash
*/
function getFine() {
    return(Math.max(player.money / 2, 250));
    }

updateMoneyLabel();
