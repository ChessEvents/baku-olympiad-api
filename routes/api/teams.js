"use strict";
let async = require( 'async' );
let router = require( 'express' ).Router();
let mongoose = require( 'mongoose' );
let Team = mongoose.model( 'Team' );
let Player = mongoose.model( 'Player' );

// return a list of teams:
router.get( '/', ( req, res, next ) => {

    Team.find( {}, {
        teamName: 1,
        score: 1,
        country: 1,
        iso: 1
    } ).then( teams => {
        return res.json( teams );
    } ).catch( next );

} );

// return a list of teams:
router.get( '/detail', ( req, res, next ) => {

    Team.find( {}, {
        name: 0
    } ).populate( 'players' ).then( teams => {
        return res.json( teams );
    } ).catch( next );

} );

// return a list of teams:
router.get( '/players', ( req, res, next ) => {

    Team.find( {}, {
        teamName: 1,
        players: 1
    } ).populate( 'players' ).then( teams => {
        return res.json( teams );
    } ).catch( next );

} );


// get team by teamName with all player data:
router.get( '/:teamName', ( req, res, next ) => {

    Team.find( {
        teamName: req.params.teamName
    } ).populate( 'players' ).then( team => {
        return res.json( team );
    } ).catch( next );
} );

router.get( '/all/countries', ( req, res, next ) => {

    console.log( 'HIT ME!' );
    Team.aggregate( {
        "$group": {
            "_id": {
                "country": "$country"
            },
            "iso": {
                "$first": '$iso'
            },
            "countryCount": {
                "$sum": 1
            }
        }
    }, {
        "$sort": {
            "countryCount": -1
        }
    }, ( err, result ) => {
        if ( err ) res.json( err );
        res.json( result );
    } );

} );

// update the ISO of the teams:
router.put( '/iso/:_id', ( req, res, next ) => {

    let iso = req.body.iso;

    Team.findByIdAndUpdate( req.params._id, {
            "iso": iso
        }, {
            safe: true,
            upsert: true,
            new: true
        },
        ( err, team ) => {
            if ( !err ) {
                res.json( team );
            } else {
                res.json( err );
            }

        } );

} );

// add a round result record.
router.put( '/subtotal/:_id', ( req, res, next ) => {

    let score = req.body;

    Team.findByIdAndUpdate( req.params._id, {
            $push: {
                "score": score
            }
        }, {
            safe: true,
            upsert: true,
            new: true
        },
        ( err, team ) => {
            if ( !err ) {
                res.json( team );
            } else {
                res.json( err );
            }

        }
    );

} );

// create a new team:
router.post( '/', ( req, res, next ) => {

    let data = req.body.team;
    let team = new Team( req.body.team );
    let players = [];

    data.players.forEach( playerId => {
        players.push( callback => {
            Player.find( {
                id: playerId
            } ).then( player => {

                if ( Object.keys( player ).length > 0 ) {
                    callback( null, player[ 0 ] );
                } else {
                    callback( null, null );
                }

            } ).catch( next );
        } );
    } );

    async.parallel( players, ( err, playersArray ) => {

        if ( err ) return console.log( err );

        // assign player ids to the player array:
        team.players = playersArray;

        team.save().then( () => {
            return res.json( {
                team: team.toJSONFor()
            } );
        }, error => {
            console.log( error );
        } );
    } );

} );

module.exports = router;
