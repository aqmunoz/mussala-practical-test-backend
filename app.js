let express = require('express'),
path = require('path'),
mongoose = require('mongoose'),
cors = require('cors'),
bodyParser = require('body-parser'),
hateoasLinker = require('express-hateoas-links'),
dataBaseConfig = require('./database/db');
const createError = require('http-errors');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

// Connecting mongoDB
mongoose.Promise = global.Promise;
mongoose.connect(dataBaseConfig.db, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
}).then(() => {
    console.log('Database connected sucessfully ');
  },
  error => {
    console.log('Could not connected to database : ' + error);
  }
)


// Set up express js port
const gatewayRoute = require('./routes/gateway.route');
const peripheralRoute = require('./routes/peripheral.route');
const mainRoute = require('./routes/main.route');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cors());

//Hateoas
app.use(hateoasLinker);

// Setting up static directory
app.use(express.static(path.join(__dirname, 'dist/frontend')));


// RESTful API root
app.use('/', mainRoute);
app.use('/api', gatewayRoute);
app.use('/api', peripheralRoute);

// PORT
const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log('Connected to port ' + port);
})

// Find 404 and hand over to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// Index Route
app.get('/', (req, res) => {
  res.send('invaild endpoint');
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/frontend/index.html'));
});

// error handler
app.use(function (err, req, res, next) {
  console.error(err.message);
  if (!err.statusCode) err.statusCode = 500;
  res.status(err.statusCode).send(err.message);
});