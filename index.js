const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const routes_user= require("./src/Routes/user_routes");
const routes_url= require("./src/Routes/url_routes");


const app = express();
const cors = require('cors');
const PORT = 8080;
var serveStatic = require('serve-static');
var path = require('path');
const _ = require('lodash');
const fs = require("fs") 





//connection mongoose :DB
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/testTechnique', {
  useUnifiedTopology: true,
  useNewUrlParser: true
}).then(() => {
  console.log('Database sucessfully connected')
},
  error => {
    console.log('Database could not be connected: ' + error)
  }
)
app.use(serveStatic(path.join(__dirname, 'testTechnique'), {
  maxAge: '1d',
  // setHeaders: setCustomCacheControl
}));
//bodyparser :midlleware pour passer les informations à la base de données
app.use(express.urlencoded({ extended: true }));

var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204 
}
app.use(cors(corsOptions));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  next();
});


app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(bodyParser.json());
app.use("/api/user", routes_user);
;
app.use('/api/url', routes_url)

//app.use(express.static(__dirname + '../../views'));
global.__basedir = __dirname;



//Port
app.get('/', (req, res) =>
  res.send(`serveur node et express sur port ${PORT} `)
);

app.listen(PORT, () =>
  console.log(`votre serveur est sur le port ${PORT} `)
);




module.exports = app
