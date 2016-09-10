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
        iso: 1,
        roundRank: 1
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

// get team list by country:
router.get( '/country/:country', ( req, res, next ) => {

    Team.find( {
        country: req.params.country
    }, {
        teamName: 1,
        score: 1,
        country: 1,
        iso: 1,
        roundRank: 1
    } ).then( team => {
        return res.json( team );
    } ).catch( next );
} );

router.get( '/all/countries', ( req, res, next ) => {

    Team.aggregate( {
        $group : {
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
         $sort : {
            "countryCount": -1
        }
    }, ( err, result ) => {
        if ( err ) res.json( err );
        return res.json( result );
    } ).catch( next );

} );

// get list of teams by their round rank & country!
router.get( '/rank/:round/:country', ( req, res, next ) => {

    let sort = "score.0.r" + req.params.round + ".total";
    let country = req.params.country;
    let query = {
        [ sort ]: -1
    };

    Team.find( { country: country } )
        .sort( query )
        .then( teams => {
            return res.json( teams );
        } );
} );

// get list of teams by their OVERALL round rank!
router.get( '/rank/:round', ( req, res, next ) => {

    let sort = "score.0.r" + req.params.round + ".total";
    let query = {
        [ sort ]: -1
    };

    Team.find( {}, {
        _id : 1,
        score: 1
    } )
        .sort( query )
        .then( teams => {
            return res.json( teams );
        } );
} );

// update teams with their rank per round!
router.put( '/rank/:_id', ( req, res ) => {

    console.log( typeof req.body.rank );

    Team.findByIdAndUpdate( req.params._id, {
        $push: {
            roundRank: req.body.rank
        }
    }, {
        safe: true,
        upsert: true,
        new: true
    }, ( err, team ) => {
        if ( !err ) return res.json( team );

        return res.json( err );

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
