// Load basic modules
var jade = require('jade'),
    express = require('express'),
    app = express(),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    fs = require('fs'),
    multer = require('multer');

// Custom modules
var exports = require('./exports.js');

// Define upload handler
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, exports.uploadFolder);
    },
    filename: function (req, file, cb) {
        var n = file.originalname;
        n = n.substring(n.lastIndexOf("."), n.length);
        var d = new Date();
        n = exports.timestamp(d) + n;
        cb(null, n);
    }
});

var upload = multer({
    storage: storage
});

// Define template engine
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

// Define static files
app.use("/semantic", express.static(__dirname + '/semantic'));
app.use(express.static(__dirname + '/public'));

// Main request
app.get('/', function (req, res) {
    console.log("Got a main request");
    res.render('chat-in.jade');
});

// Chat output
app.get('/log-output', function (req, res) {
    res.render('chat-out.jade');
});

// Chat post request
app.post('/send', upload.any(), function (req, res) {
    // console.log("Uploading...\nFiles: ", req.files, "\nBody: ", req.body);
    var file = "",
        message = req.body.msg,
        color = req.body.color,
        sketchData = req.body.sketch,
        scale = req.body.scale;

    if (req.files.length > 0) {
        file = req.files[0].filename;
    }
    console.log("Filename is: ", file);
    console.log("Color is: ", color, "\nMessage is: ", message);
    // Function to create entry
    var c = fs.readFileSync(exports.chatfile, 'utf8');
    if (message != "") {
        message = exports.makeEntry(color, message);
    }
    if (file != "") {
        message += exports.makeEntry(color, "<img style='width:25%' src='user-chat-uploads/" + file + "' />");
    }
    if (sketchData != "") {
        sketchData = sketchData.replace(/^data:image\/png;base64,/, "");
        var d = new Date();
        var fname = exports.timestamp(d) + ".png";
        fs.writeFileSync(exports.uploadFolder + "/" + fname, sketchData, 'base64');
        message += exports.makeEntry(color, "<img style='width:" + scale + "%' src='user-chat-uploads/" + fname + "' />");        
    }
    
    var chatStream = fs.createWriteStream(exports.chatfile);
    chatStream.end(message + c, (err) => {
        if (err) throw err;
        var chat = fs.readFileSync(exports.chatfile, 'utf8');
        io.emit('display chat', chat);
    });
    res.redirect('/');
});

io.on('connection', function(socket) {
    console.log('Client connected: ', socket.id);

    // Initialize chat -- make this a function
    var chatStream, content;
    if (exports.existsSync(exports.chatfile)) {
        content = fs.readFileSync(exports.chatfile, 'utf8');
        socket.emit('display chat', content);
    } else {
        chatStream = fs.createWriteStream(exports.chatfile);
        chatStream.end("<span style='margin-left:40%;'>Welcome to in-transit</span>", (err) => {
            if (err) console.log("Chat error! =>>> ", err);
            content = fs.readFileSync(exports.chatfile, 'utf8');
            socket.emit('display chat', content);
        });
    }

    socket.on('disconnect', function() {
        console.log('Client disconnected: ', socket.id);
    });
});

http.listen(exports.http, function () {
    console.log('in-transit logbook running on port ' + exports.http);
});
