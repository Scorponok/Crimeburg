"use strict";

// should be possible to optimize your chance of maximum money with minimum risk

// achievements - get out of town with no strikes, get $500, get $500 in short time period

// playing card mechanic for burglary minigame?

// playing card mechanic makes more interesting losses on strike possible

// Simplify levelling - only 4 levels instead of 12? Want a visible change every time you
// rob something

// Start smaller - maybe half the size the town is now, with lower levels and limited
// buildings.
// Short early game - very easy, just don't lose. Maybe spend a year doing that

// Or start really small - with just crossroads and no police?

// City needs to change every month

// No chance of failure at first unless you pick the wrong places?

// Maybe as soon as you get caught, you either leave town or get put away until the next
// level

// Something bad always happens to the place you rob?

// Town always levels up? Or is there some minimum level threshold? Probably always,
// unless there's something the player specifically can do to help buildings level up

// Level up threshold: Population is 50% of what's needed to actually work in the town; 
// town expands into suburbs, which are mostly slums, and starts gentrifying

// Possible objectives:
// * Commit crime to lower property values to keep <something> out of the town
// * Raise property values
// * Keep <neighborhood> poor so it doesn't level up
// * Stop an upgraded police station being built by disgracing <someone>
// * Work for the mayor to <achieve nefarious objective>
// * Force specific building to leave
// * Defeat rival gang
        

var game = new function() {

    this.nextMonth = function() {
        player.spendMonthly();
        
        /* Reset our risk penalty for doing multiple crimes in a month
        */
        _actionsSoFar = 0;
        this.updateRiskPenalty();
        
        this.updateDateDisplay();
        
// Display log of everything going on in a separate window
// Use log instead of alerts <-- not working!

// Display average level & fear, recalculate population etc every month
// Display average level & fear per-street

// Buildings should employ / house different numbers of people based on their level.
// Employment goes up with level; housing goes DOWN with level (slums -> mansions)

// Flag buildings that were robbed recently (X months ago)

// Every building needs to advance every month
// if building is below fear baseline, level can go up
// if building is significantly above fear baseline, level can go down
// if building is below level baseline for its streets, it will always level up
// Increase security and money with level
// Require skillups on poor buildings before you can rob richer ones

// Ability to buy buildings? Flag which ones you own, and have them tithe to you

// 1% (or lower)? chance per month that each building changes to a different building too
// ideally only ~1 building changing per month

// What could player do to *reduce* fear and help buildings level up? Fight crime
// mafia style? "Patrol" option where you keep things safe by being a vigilante?

// Flag buildings that have been patrolled recently
        }
        
        
  	this.leaveTown = function() {
  	
  			if (player.hasLost() || player.hasWon() || !player.hasMoneyTarget()) {
  					return;
  					}
  	
				log("<span style='color: green'><strong>Congratulations! You made it out with " + formatMoney(player.getMoney()) + "!</strong></span>");
				player.youWin();
  			}
  

    this.robBuilding = function(i, j) {
        var building = map.getBuilding(i, j);
        
        /* The more we get up to in a month, the harder it gets
        */
        var extraRisk = this.getExtraRisk();
        _actionsSoFar++;
        this.updateRiskPenalty();

				/* Give the user some feedback on how good of a choice they made
				*/
        var totalSecurity = building.security * (1 + extraRisk)
        var securityMessage = "<br><span style='color: grey;'>(" + totalSecurity + "% chance of failure)</span>"

        /* The security rating is our chance to be caught
        */
        var roll = randomPercent();
        if (roll <= totalSecurity) {
            var fine = player.getFine();
            if (fine == 0.) {
		            log("Someone spotted you, but you got away!" + securityMessage);
		            }
		        else {
		            player.spendMoney(fine);
		            if (player.isBroke()) {
				            log("You got caught and couldn't afford the " + formatMoney(fine) + " fine! You break out of jail and have to leave town." + securityMessage);
				        } else {
				            log("You got caught! You bribe the policeman " + formatMoney(fine) + " and he lets you go." + securityMessage);
				        		}
		            }
		        player.strike();
            return;
            }

        /* You get 25-100% of money
        */
        var moneyStolen = randomPercentOfValue(building.money, 25, 100);
        player.earnMoney(moneyStolen);
        log("You stole " + formatMoney(moneyStolen) + "." + securityMessage);

        building.rob(moneyStolen);
        }
        
        
    this.updateRentDisplay = function () {
				$("#rent").html("Rent: " + formatMoney(player.getRent()) + " per month");
  			}


// Private

		this.updateRiskPenalty = function() {
				var percentExtra = this.getExtraRisk() * 100
				if (percentExtra == 0.) {
						$("#penalty").html("");
						return;
						}
					
				$("#penalty").html("<span style='color: red;'>Until next month, " + percentExtra + "% additional chance of being caught due to crimes you've committed</span>");
				}				

		
		/* For every action we've taken so far this month, it's a 50% cumulative extra chance
				to get caught
		*/
		this.getExtraRisk = function() {
				return(_actionsSoFar * 0.5);
				}
				
				
		this.updateDateDisplay = function() {

				/* Error handling
				*/
				if (_month < 1) {
						_month = 1
						}
				if (_month > 12) {
						_month = 12
						}

				/* Go up a month
				*/
				if (_month == 12) {
						_month = 1;
						_year++;
						}
				else {
						_month++;
						}
				
				var monthname;
				var monthnames = ["Not a month", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
				$("#date").html(monthnames[_month] + " " + _year);
				}
				
				
		var _actionsSoFar = 0;
		
		var _month = 1;
		var _year = 1919;
		
    };
    
/* Rent never changes so only needs to be updated once
*/
game.updateRentDisplay();

/* Introduction for the player
*/
log("Welcome to Crimeburg! To leave town and start a new life in the big city, you need to have " + formatMoney(player.getTargetMoney()) + " before the end of the year.<br><br>Rob houses to get money, but don't get caught by the police. If you get caught 3 times, you'll be run out of town!<br><br>Mouse over a building to see information about it. Click a house to be able to rob it. Rent is paid automatically every month.");