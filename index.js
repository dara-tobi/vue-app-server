const express = require('express');
const app = express();
const api = require('./api');
const morgan = require('morgan');
const mongoose = require('mongoose');

app.use(express.json())
app.use(express.urlencoded({extended: true}));
app.set('port',  (process.env.PORT || 8081));
app.use('/api', api);
app.use(express.static('static'))
app.use(morgan('dev'))
app.use((req, res, next) => {
	const err = new Error('not found');
	err.status = 404;
	res.json(err);
});


mongoose.connect(process.env.DB_CONNECTION_STRING || 'mongodb://localhost:27017/venom');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
	console.log('connected to db');
	app.listen(app.get('port'), () => {
		console.log('APP listening on PORT', app.get('port')); 
	});
});
