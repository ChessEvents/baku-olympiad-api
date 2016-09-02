"use strict";

const fs = require( 'fs' );
const http = require( 'http' );
const path = require( 'path' );
const methods = require( 'methods' );
const express = require( 'express' );
const bodyParser = require( 'body-parser' );
const session = require( 'express-session' );
const cors = require( 'cors' );
const passport = require( 'passport' );
const errorhandler = require( 'errorhandler' );
const mongoose = require( 'mongoose' );

let isProduction = process.env.NODE_ENV === 'production';

let app = express();

app.use( cors() );
app.use( require( 'morgan' )( 'dev' ) );
app.use( bodyParser.urlencoded( {
	extended: false
} ) );
app.use( bodyParser.json() );
app.use( require( 'method-override' )() );
app.use( express.static( __dirname + '/public' ) );
app.use( session( {
	secret: 'baku',
	cookie: {
		maxAge: 60000
	},
	resave: false,
	saveUninitialized: false
} ) );

if ( !isProduction ) {
	app.use( errorhandler() );
}

if ( isProduction ) {
	mongoose.connect( process.env.MONGODB_URI );
} else {
	mongoose.connect( 'mongodb://localhost/api-baku' );
    //mongoose.connect( 'mongodb://admin:test@ds023686-a0.mlab.com:23686,ds023686-a1.mlab.com:23686/fco-baku-2016?replicaSet=rs-ds023686')
	mongoose.set( 'debug', true );
}

require( './models/Team' );
require( './models/Player' );

app.use( require( './routes' ) );

app.use( ( req, res, next ) => {
	let err = new Error( 'Not Found!!' );
	err.status = 400;
	next( err );
} );


// development error handler
// will print stacktrace
if ( !isProduction ) {
	app.use( ( err, req, res, next ) => {
		console.log( err.stack );

		res.status( err.status || 500 );

		res.json( {
			'errors': {
				message: err.message,
				error: err
			}
		} );
	} );
}

// production error handler
// no stacktraces leaked to user
app.use( ( err, req, res, next ) => {
	res.status( err.status || 500 );
	res.json( {
		'errors': {
			message: err.message,
			error: {}
		}
	} );
} );



// finally, let's start our server...
var server = app.listen( process.env.PORT || 3000, () => {
	console.log( 'Listening on port ' + server.address().port );
} );

server.timeout = 100000;
