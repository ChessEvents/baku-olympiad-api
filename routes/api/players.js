"use strict";

let router = require( 'express' ).Router();
let mongoose = require( 'mongoose' );
let Player = mongoose.model( 'Player' );

// return a player by ID:
router.get( '/:id', ( req, res, next ) => {

    let id = parseInt( req.params.id, 10 );

    if ( id ) {
        Player.find( {
            id: id
        } )
        .then( player => {
            return res.json( player );
        } ).catch( next );
    } else {
        return res.status( 404 );
    }

} );

router.get( '/', ( req, res, next ) => {

    let eventType = req.query.event;

    Player.find( {
        event: eventType
    } ).sort( {
        country: 1,
        rating: -1
    } ).exec( ( err, model ) => {
        if ( !err ) {
            res.json( model );
        }
    } );

} );

// at a round result record.
router.put( '/result/:id', ( req, res, next ) => {

    let result = req.body;

    console.log( result );

    Player.findOneAndUpdate({ id: req.params.id },
        {$push: {"roundResults": result }},
        {safe: true, upsert: true, new : true},
        function(err, player) {
            if( ! err ) {
                res.json( player );
            } else {
                res.json( err );
            }

        }
    );

} );

// create a new player:
router.post( '/', ( req, res, next ) => {

    let player = new Player( req.body.player );

    return player.save().then( player => {
        return res.json( player );
    } ).catch( next );

} );

module.exports = router;
