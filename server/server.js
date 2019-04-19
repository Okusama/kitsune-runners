//Modules
const app = require("express")();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const bodyParser = require("body-parser");
const mongoose = require("./server/config/mongoose");

//DB connexion
mongoose.connect();

//Body Parser
let urlencodedParser = bodyParser.urlencoded({
    extended: true
});
app.use(urlencodedParser);
app.use(bodyParser.json());

//CORS
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    res.header("Access-Control-Allow-Credentials", true);
    next();
});

io.on("connection", socket => {

    socket.on("adminStartTimer", () => {
        io.sockets.emit("startPlayerTimer");
    });

    socket.on("adminStopPlayerTimer", (time, playerId) => {
       io.sockets.emit("adminStopPlayerTimer", time, playerId);
    });

    socket.on("playerStopPlayerTimer", (time, playerId) => {
        io.sockets.emit("playerStopPlayerTimer", time, playerId);
    });

});

//Routes
let user = require(__dirname + "/server/controllers/user/userController");
app.use("/user", user);

let tournament = require(__dirname + "/server/controllers/tournament/tournamentController");
app.use("/tournament", tournament);

let championShip = require(__dirname + "/server/controllers/championship/championshipController");
app.use("/championship", championShip);

//Port d"écoute
let port = process.env.PORT || 8000;
server.listen(port, () => console.log("Listening on port" + port));