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
        eventType: eventType
    } ).sort( {
        country: 1,
        rating: -1
    } ).exec( ( err, players ) => {
        if ( !err ) {
            res.json( players );
        }
    } );

} );

router.get( '/top/check', ( req, res, next ) => {

    let eventType = req.query.eventType;
    let limit = parseInt(req.query.limit, 10);
    let board = req.query.board;


    Player.find( {
        eventType: eventType,
        board: board
    } ).sort( {
        total: -1
    } ).limit( limit ).exec( ( err, players ) => {
        if ( !err ) {
            res.json( players );
        } else {
            res.json( err );
        }
    } );

} );

// at a round result record.
router.put( '/result/:id', ( req, res, next ) => {

    let result = req.body.result;

    console.log( result );

    Player.findOneAndUpdate( {
            id: req.params.id
        }, {
            $push: {
                "roundResults": result
            }
        }, {
            safe: true,
            upsert: true,
            new: true
        },
        ( err, player ) => {
            if ( !err ) {
                res.json( player );
            } else {
                res.json( err );
            }
        }
    );
} );

// update the player rank:
router.put( '/current-rank/:id', ( req, res, next ) => {

    let rank = req.body.rank;

    Player.findOneAndUpdate( {
        id: req.params.id
    }, {
        "currentRank": rank
    }, {
        safe: true,
        upsert: true,
        new: true
    }, ( err, player ) => {
        if ( !err ) {
            res.json( player );
        } else {
            res.json( err );
        }
    } );
} );

// update the player rank:
router.put( '/current-total/:id', ( req, res, next ) => {

    let total = req.body.total;

    Player.findOneAndUpdate( {
        id: req.params.id
    }, {
        "total": total
    }, {
        safe: true,
        upsert: true,
        new: true
    }, ( err, player ) => {
        if ( !err ) {
            res.json( player );
        } else {
            res.json( err );
        }
    } );
} );

// create a new player:
router.post( '/', ( req, res, next ) => {

    let player = new Player( req.body.player );

    return player.save().then( player => {
        return res.json( player );
    } ).catch( next );

} );

module.exports = router;
