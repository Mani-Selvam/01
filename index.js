const express = require('express');
const app = express();
const cors = require('cors')
const port = process.env.PORT || 5000;  
const config = require('./config/config.js');
const middleware = require('./middleware/middleware.js');
const connectDb = require('./config/db.js');
const dotenv = require("dotenv");
dotenv.config();
//database connection
connectDb();
app.use(cors());
app.use(middleware);

app.listen(port, '0.0.0.0', () => console.log(`Enquiry API listening on port ${port}!`));