"use strict";

let router = require( 'express' ).Router();
let mongoose = require( 'mongoose' );
let Player = mongoose.model( 'Player' );

// return a player by ID:
router.get( '/:id', ( req, res, next ) => {

    Player.findById( req.params.id ).then( () => {
        return res.json( {
            player: player.toJSONFor()
        } );
    } ).catch( next );

} );

//
router.post( '/', ( req, res, next ) => {

    let player = new Player( req.body.player );
    
    return player.save().then( () => {
        return res.json( {
            player: player.toJSONFor()
        } );
    } ).catch( next );

} );

module.exports = router;
