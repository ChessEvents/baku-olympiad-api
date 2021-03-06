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

    Player.find( {} ).sort( {
        country: 1,
        rating: -1
    } ).exec( ( err, players ) => {
        if ( !err ) {
            res.json( players );
        }
    } );

} );

router.get( '/playerIds', ( req, res, next ) => {

    console.log( 'end point hit!' );

    Player.find( {}, {
        name: 1
    } ).then( players => {
        res.json( players );
    } ).catch( next );

} );

router.get( '/top/check', ( req, res, next ) => {

    let eventType = req.query.eventType;
    let limit = parseInt( req.query.limit, 10 );
    //let board = req.query.board;

    Player.find( {
        eventType: eventType
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

router.get( '/most-picked/check', ( req, res, next ) => {

    let limit = parseInt( req.query.limit, 10 );

    Player.find( {
        eventType: req.query.eventType
    }, {
        players: 0,
        roundResults: 0
    } ).sort( {
        picked: -1
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

    let result = req.body;

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

// update the player picked value:
router.put( '/player-picked/:_id', ( req, res ) => {

    let picked = req.body.picked;

    Player.findByIdAndUpdate( req.params._id, {
        "picked": picked
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
