"use strict";

var player = {
    money: 500,
    hasLost: false,
    };

function isBroke() {
    return(player.money <= 0);
    }

function spendMonthly() {
    var outgoings = Math.max(100, player.money * 0.2);
    player.money -= outgoings;

    if (isBroke())
        player.hasLost = true;

    updateMoneyLabel();
    }

function updateMoneyLabel() {
    var money = player.money < 0 ? 0 : player.money;
    var text = money;
    if (hasLost()) {
        text += " <strong><font color='red'>Sorry, you lost!</font></strong>";
        }
    $("#money").html(text);
    }

function hasLost() {
    return(player.hasLost);
    }

updateMoneyLabel();
