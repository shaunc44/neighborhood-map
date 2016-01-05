//Credit: https://jqueryui.com/toggle/

$(function() {
    //run the currently selected effect
    function runEffect() {
        //get effect type from
        var selectedEffect = $("#effectTypes").val();

        //most effect types need no options passed by default
        var options = {};
        //some effects have required parameters
        if (selectedEffect === "slide") {
            options = {
                percent: 0
            };
        } else if (selectedEffect === "size") {
            options = {
                to: {
                    width: 200,
                    height: 60
                }
            };
        }

        //run the effect
        //$("#effect").toggle(selectedEffect, options, 1000);
        $(".container").toggle('slide',250);
    };

    //set effect from select menu value
    $("#button").click(function() {
      runEffect();
    });
});