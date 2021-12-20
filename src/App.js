//import express
const express = require('express');
var cors = require('cors');
const app = express();

app.use(cors());

//setting port
app.listen(process.env.PORT || 3000, function () {
  console.log(
    'Express server listening on port %d in %s mode',
    this.address().port,
    app.settings.env
  );
});

//Middlewares
app.use(express.json());

//configurasi cros json
// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
//     res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
//     res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
//     next();
// });

const categoriesRouters = require('./routes/CategoriesRoute');
app.use('/categories', categoriesRouters);

const networkRouters = require('./routes/NetworkRoute');
app.use('/network', networkRouters);

const starshipRouters = require('./routes/StarshipRoute');
app.use('/starship', starshipRouters);

const missionRouters = require('./routes/MissionRoute');
app.use('/mission', missionRouters);

const awsRouters = require('./routes/AwsFileRoute');
app.use('/aws', awsRouters);

const emailRouters = require('./routes/EmailRoute');
app.use('/email', emailRouters);

//static file Images
app.use('/Images', express.static('./Images'));

app.use('/', (req, res) => {
  res.send('Opps API Cannot Found !!');
});

app.listen(app.get('port'), () => {
  console.log('Starting server Node Js');
});
