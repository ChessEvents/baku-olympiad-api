"use strict";

var router = require( 'express' ).Router();
var mongoose = require( 'mongoose' );
var Team = mongoose.model( 'Team' );

// return a list of tags
router.get( '/', function ( req, res, next ) {

    Team.find().then( function ( teams ) {
        return res.json( teams );
    } ).catch( next );

} );

router.post( '/', function( req, res, next ) {

    let team = new Team( req.body.team );

    return team.save().then(function() {
        console.log('Saving team...');
        return res.json({ team: team.toJSONFor() });
    }).catch( next );

} )

module.exports = router;
