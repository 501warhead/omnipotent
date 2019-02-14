import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';

const app = express();

mongoose.connect(process.env.NODE_ENV === 'Production' ? process.env.DATABASE_URI : 'mongodb://localhost:27017/omnipotent', (err) => {
  if (err) throw err;
  console.log('successfully connected to database');
});

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('dist'));

// error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, _next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
