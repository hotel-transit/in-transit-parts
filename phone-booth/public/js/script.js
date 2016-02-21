var socket = io();

jQuery(document).ready(function ($) {
    if ($(window).width() > 800) {
        $('#sketchpad').attr("width", "600px");
        $('#scale').val(40);
    }
    else if ($(window).width() > 600) {
        $('#sketchpad').attr("width", "300px");
        $('#scale').val(20);
    }
    else {
        $('#sketchpad').attr("width", "250px");
        $('#scale').val(17);
    }

    // chat form handling
    $('#chat-form').submit(function (event) {
        // Get canvas information
        var sketchdata = document.getElementById("sketchpad").toDataURL();
        var empty = document.getElementById("emptycanvas").toDataURL();
        if (sketchdata != empty)
            $('#sketch').val(sketchdata);
        var x = document.getElementById("file-upload");
        var s = $(this).serializeArray();
        var msg = s[0].value;
        var sketch = s[2].value;
        if (x.files.length == 0 && msg == "" && sketch == "") {
            event.preventDefault();
        }
    });

    $('#clearcanvas').on('click', function(event) {
        event.preventDefault();
    });

    // display chat content
    socket.on('display chat', function (msg) {
        $('#messages').html(msg);
    });
});
