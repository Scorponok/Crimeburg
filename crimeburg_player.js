"use strict";

var player = new function() {

//Public

    this.spendMoney = function(amount) {
        changeMoney(-amount);
        }

    this.earnMoney = function(amount) {
        changeMoney(amount);
        }

		/* Rent is $25 a month
		*/
		this.getRent = function() {
				return(25);
				}
		
    this.spendMonthly = function() {
        var outgoings = this.getRent();
				log("You spent $" + outgoings + " on rent for this month.");
        this.spendMoney(outgoings);
        }

    this.hasLost = function() {
    		return(_hasLost);
    		}
    this.hasWon = function() {
    		return(_hasWon);
    		}

    /* Getting caught means you're fined a random amount
    */
    this.getFine = function() {
        var roll = randomPercent();
        if (roll <= 10) {
        		return(0);
        		}
        return(roll);
        }
        
    this.strike = function() {
    		_strikes += 1;
    		if (_strikes >= 3) {
    				youLose();
    				}
    		updateStrikesDisplay();
    		}
    		
  	this.getMoney = function() {
  			return(_money);
  			}
  	this.getTargetMoney = function() {
  			return(_targetMoney);
  			}
    this.isBroke = function() {
        return(_money <= 0);
        }
    this.hasMoneyTarget = function() {
        return(_money >= _targetMoney);
        }

    this.youWin = function() {
				_hasWon = true;
				$("#nextmonth").prop('disabled', true);
				$("#leavetown").prop('disabled', true);
    		}


//Private

    function changeMoney(amount) {
        _money += amount;
        
        /* Make sure we can't end up at negative money
        */
        if (_money < 0.) {
        		_money = 0.;
        		youLose();
        		}

        updateMoneyLabel();
        
        if (_money >= _targetMoney) {
						$("#leavetown").prop('disabled', false);
						}
        }


    function updateMoneyLabel() {
        var amount = _money < 0 ? 0 : _money;
        var text = formatMoney(amount);
        if (_hasLost) {
            text += " <strong><font color='red'>You ran out of money and had to leave town!</font></strong>";
            }
        $("#money").html(text);
        }
        

    function updateStrikesDisplay() {
        var text = "You've been caught <strong>" + _strikes + "</strong> times.";
        if (_strikes >= 3) {
            text += " <strong><font color='red'>You got caught too many times and had to leave town!</font></strong>";
            }
        $("#strikes").html(text);
        }
        
        
    function youLose() {
				_hasLost = true;
				$("#nextmonth").prop('disabled', true);
				$("#leavetown").prop('disabled', true);
    		}
    		
    		
    var _money = 100;
    var _targetMoney = 500;
    var _hasLost = false;
    var _hasWon = false;
    var _strikes = 0;

    /* Update our money label to the starting state
    */
    updateMoneyLabel();
    };
