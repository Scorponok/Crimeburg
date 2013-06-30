"use strict";

var player = new function() {

//Public

    this.spendMoney = function(amount) {
        changeMoney(-amount);
        }

    this.earnMoney = function(amount) {
        changeMoney(amount);
        }

    this.spendMonthly = function() {
        var outgoings = Math.max(100, _money * 0.2);
        spendMoney(outgoings);
        }

    /* Getting caught means you're fined half your cash
    */
    this.getFine = function() {
        return(Math.max(_money / 2, 250));
        }


//Private

    function isBroke() {
        return(_money <= 0);
        }

    function changeMoney(amount) {
        _money += amount;

        if (isBroke())
            _hasLost = true;

        updateMoneyLabel();
        }

    function updateMoneyLabel() {
        var amount = _money < 0 ? 0 : _money;
        var text = formatMoney(amount);
        if (_hasLost) {
            text += " <strong><font color='red'>Sorry, you lost!</font></strong>";
            }
        $("#money").html(text);
        }


    var _money = 500;
    var _hasLost = false;

    /* Update our money label to the starting state
    */
    updateMoneyLabel();
    };
