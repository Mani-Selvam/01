const express = require('express');
const app = express();
const cors = require('cors')
const port = process.env.PORT || 3005;  
const config = require('./config/config.js');
const middleware = require('./middleware/middleware.js');
const connectDb = require('./config/db.js');
const dotenv = require("dotenv");
//database connection
connectDb();
dotenv.config();
app.use(cors());
app.use(middleware);

app.listen(port, () => console.log(`url-shortener listening on port ${config.port}!`));