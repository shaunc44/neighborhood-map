//Credit: http://codepen.io/nikhil/pen/qcyGF

//Use ready() to make a function available after the document is loaded
$(document).ready(function() {
    var submitIcon = $('.searchbox-icon');
    var inputBox = $('.searchbox-input');
    var searchBox = $('.searchbox');
    // ** My Addition **
    var listBox = $('.list-view');
    var isOpen = false;
    //Run function when submitIcon is clicked
    submitIcon.click(function() {
        if (isOpen == false){
            //Add a class name to the first p element of searchbox
            searchBox.addClass('searchbox-open');
            listBox.addClass('list-holder-open');
            inputBox.focus();
            listBox.focus();
            isOpen = true;
        } else {
            //Removes searchbox-open class from all p elements
            searchBox.removeClass('searchbox-open');
            listBox.removeClass('list-holder-open');
            inputBox.focusout();
            listBox.focusout();
            isOpen = false;
        }
    });

    //Release the mouse button over submit icon and searchbox???
    submitIcon.mouseup(function() {
        return false;
    });
    searchBox.mouseup(function() {
        return false;
    });
    listBox.mouseup(function() {
        return false;
    });

    $(document).mouseup(function() {
        if (isOpen == true){
            $('.searchbox-icon').css('display','block');
            submitIcon.click();
            $('.list-holder-open').css('display','block');
            submitIcon.click();
        }
    });
});

function buttonUp() {
    //Return the value of searchbox-input
    var inputVal = $('.searchbox-input').val();
    //.trim() removes whitespace from both sides of the string
    inputVal = $.trim(inputVal).length;
    if (inputVal !== 0){
        $('.searchbox-icon').css('display','none');
    } else {
        $('.searchbox-input').val('');
        $('.searchbox-icon').css('display','block');
    }
}

function buttonUp2() {
    //Return the value of searchbox-input
    var listVal = $('.list-view').val();
    //.trim() removes whitespace from both sides of the string
    listVal = $.trim(listVal).length;
    if (listVal !== 0){
        $('.searchbox-icon').css('display','none');
    } else {
        $('.list-view').val('');
        $('.searchbox-icon').css('display','block');
    }
}
