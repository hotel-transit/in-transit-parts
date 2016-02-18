var socket = io();

jQuery(document).ready(function ($) {
    if ($(window).width() > 800)
        $('#sketchpad').attr("width", "600px");
    else if ($(window).width() > 600)
        $('#sketchpad').attr("width", "300px");
    else
        $('#sketchpad').attr("width", "250px");

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

    // display chat content
    socket.on('display chat', function (msg) {
        $('#messages').html(msg);
    });
});
