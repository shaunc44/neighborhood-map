//Credit: https://jqueryui.com/toggle/

$(function() {
    //run the currently selected effect
    function runEffect() {
        //most effect types need no options passed by default
        var options = {};

        //run the effect
        //$("#effect").toggle(selectedEffect, options, 1000);
        $(".container").toggle('slide',250);
    };

    //set effect from select menu value
    $("#button").click(function() {
      runEffect();
    });
});