const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Set up middleware for parsing JSON bodies
app.use(express.json()); // This should come before any routes are handled

// View Engine Setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Static Files
app.use(express.static(path.join(__dirname, 'public')));

// Routing
const indexRouter = require('./routes/index');
app.use('/', indexRouter);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  // You need to define createError or import it if you haven't already
  const createError = require('http-errors');
  next(createError(404));
});

// Error Handler
app.use((err, req, res, next) => {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
