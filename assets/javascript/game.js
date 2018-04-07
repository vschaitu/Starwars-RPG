$(document).ready(function () {

    var restartflag = false;
    var selectflag = false;
    var defenceflag = false;
    var counterattackrate;
    var attackrate = getRandomIntInclusive(10, 24);
    var netrate = attackrate;

    function getRandomIntInclusive(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    // On selecting a hero 
    //   - Move the selcted hero Selection row
    //   - Move the rest of heroes to enemy row
    //   - Emptry the selection row
    $('.menu-row').on('click', '.heroes', function () {
        var i = $('.heroes').length;
        while (i > 0) {
            $('.ene-row').append($('.heroes')[0]);
            i--;
        };
        $('.sel-row').append(this);
        $('.menu-row').empty();
        selectflag = true;
    });
    // On slecting a defender, 
    //   - Move the selcted hero defender row.
    //   - Generate random conunter attack rate for defender & save the defender name & counter attackrate.
    //   - set flight flag to true & reset the previous defeat success msg.
    $('.ene-row').on('click', '.heroes', function () {
        if ($('.def-row .heroes').length < 1) {
            $('.def-row').append(this);
            defenceflag = true;
            counterattackrate = getRandomIntInclusive(16, 24);
            $('.stats-row #counter-attack').text(counterattackrate);
            $('.container').find('.def-hero').text($('.def-row .heroes .hero-name').text());
            $('.defeat-success').css({ display: "none" });
        };
    });
    // On fight
    $('.fight-row').on('click', '.btn', function () {
        // check game is already over - If so alert user.
        if (restartflag) {
            alert(" Game over! Please restart");
            return false;
        }
        // check if player is selected - If not alert user.
        if (!selectflag) {
            alert(" Please select player to fight");
            return false;
        };
        // check if defender is selected - If not alert user.
        if (!defenceflag) {
            alert(" Please select defender to fight");
            return false;
        };

        // get the defender & player HP.
        var playerhp = parseInt($('.sel-row .heroes .hero-hp').text());
        var defenderhp = parseInt($('.def-row .heroes .hero-hp').text());

        // calculate new hp after fight for player & defender and set them back.
        playerhp -= counterattackrate;
        defenderhp -= netrate;
        $('.sel-row .heroes .hero-hp').text(playerhp);
        $('.def-row .heroes .hero-hp').text(defenderhp);

        //display stats row
        $('.stats-row #attack-rate').text(netrate);
        $('.stats-row').css({ display: "block" });

        // calculate net attackrate = current attackrate + initial attackrate at begining of game.
        netrate += attackrate;

        // check if player HP lost and if so display game over & display restart row.
        if (playerhp <= 0) {
            $('.sel-row .heroes .hero-hp').text("0");
            $('.restart-row h4').text("OOPS!!! YOU LOST, Please try again");
            $('.restart-row').css({ display: "block" });
            restartflag = true;
            defenceflag = false;
            selectflag = false;
            return false;
        };
        
        // check if oppenent HP lost - remove from defender row and clear stats row.
        if (defenderhp <= 0) {
            defenceflag = false;
            $('.stats-row').css({ display: "none" });
            $('.def-row .heroes').remove();

            // if other enemies still exist , display successful attack.
            if ($('.ene-row .heroes').length > 0) {
                $('.defeat-success').css({ display: "block" });
            } else {
                // if all enemies defeated , display You won msg & reset row.  
                restartflag = true;
                defenceflag = false;
                selectflag = false;
                $('.restart-row h4').text("GREAT VICTORY! YOU WON!!!");
                $('.restart-row').css({ display: "block" });
            }
            return false;
        };
    });
    
    // on clicking restarts, reload the page.
    $('.restart-row').on('click','.btn', function() {
        location.reload();
    });

});