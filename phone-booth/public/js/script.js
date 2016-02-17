var socket = io();

jQuery(document).ready(function ($) {

    // chat form handling
    $('#chat-form').submit(function (event) {
        var x = document.getElementById("file-upload");
        var s = $(this).serializeArray();
        var msg = s[0].value;
        var clr = s[1].value;
        if (x.files.length == 0 && msg == "") {
            event.preventDefault();
        }
    });

    // display chat content
    socket.on('display chat', function (msg) {
        $('#messages').html(msg);
    });
});
