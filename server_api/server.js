import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import cors from 'cors';
import db from './db';
require('dotenv').config()

import User from './controller/User';
import Categories from './controller/Categories';
import Words from './controller/Words';
import Auth from './middleware/auth';


const app = express();

//Middlewares
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(cors());


app.post('/api/user/register', User.create);
app.post('/api/user/login', User.login);
app.post('/api/user/loginG', User.loginG);
app.get('/api/user/data', User.getData);

app.get('/api/categories', Categories.getAll);

app.post('/api/words/getvotes', Words.getVotes);

app.use(Auth.verifyToken);

app.get('/api/user/info', User.getInfo);
app.post('/api/user/info', User.setInfo);

app.listen(3030);

console.log("nasluchuje na 3030");