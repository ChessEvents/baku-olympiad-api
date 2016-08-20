"use strict";

var router = require( 'express' ).Router();
var mongoose = require( 'mongoose' );
var Team = mongoose.model( 'Team' );

// return a list of tags
router.get( '/teams', function ( req, res, next ) {
    Team.find().then( function ( teams ) {
        return res.json( teams );
    } ).catch( next );
} );

module.exports = router;
