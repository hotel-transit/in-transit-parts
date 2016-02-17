fs = require('fs');

exports.http = 2131;

exports.uploadFolder = process.cwd() + '/public/user-chat-uploads';

exports.chatfile = process.cwd() + '/public/chat.html';

// Make a chat entry
exports.makeEntry = function (color, message) {
    var pos = Math.floor(Math.random()*60);
    var entry = "<span style='color:" + color + ";margin-left:" + pos + "%;'>" + message + "</span>";
    return entry;
};

// Function to check if a file exists -- replaces the deprecated existsSync from fs
exports.existsSync = function (filename) {
    try {
        fs.accessSync(filename);
        return true;
    } catch(ex) {
        return false;
    }
};
