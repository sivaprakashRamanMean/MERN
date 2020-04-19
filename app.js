const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const customerTransaction = require('./routes/customerTransactionRoute');
const users = require('./routes/customersRoute');
const products = require('./routes/productsRoute');
const config = require('./config.js');

const MONGODB_URI = config.mongodburi;
const PORT = process.env.PORT || 5000;

mongoose.set('useCreateIndex', true);
mongoose.connect(MONGODB_URI, { 
    useNewUrlParser: true,
    useUnifiedTopology: true, 
});
mongoose.connection.on('connected', () => {
    console.log('//***************** Database Connected ****************//');
});
mongoose.connection.on('error', (error) => {
    console.log(error);
});
mongoose.connection.on('disconnected', function(){
    console.log('//############## Database disconnected ###################//');
});


let app = express();

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'client/build')));
// For Cross origin 
app.use(cors());
// Router Match
app.use('/api/articles', customerTransaction);
app.use('/api/users', users);
app.use('/api/products', products);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
//   res.render('error');
});

app.listen(PORT, () => {
    console.log('Server started on port', PORT);
});
