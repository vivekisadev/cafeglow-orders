const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const conn = require('./config/connection.js')
const cors = require('cors');
const Path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const routes = require('./routes/index.js'); // Import the new consolidated routes


app.set('view engine', 'ejs');
app.use(cors({
    origin: true, // Allow all origins in development
    credentials: true // Allow credentials (cookies)
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(Path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET || 'supersecret',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));
app.use(flash());

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});


// Use the consolidated routes
app.use('/', routes);

const tableOrderRoutes = require('./routes/table-order.routes');
app.use('/api', tableOrderRoutes);



app.listen(process.env.PORT || 4000, () => {
    console.log(`Server is running on port ${process.env.PORT || 4000}`);
});