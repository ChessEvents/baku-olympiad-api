"use strict";
let async = require( 'async' );
let router = require( 'express' ).Router();
let mongoose = require( 'mongoose' );
let Team = mongoose.model( 'Team' );
let Player = mongoose.model( 'Player' );

// return a list of teams:
router.get( '/', ( req, res, next ) => {

    Team.find({}, { teamName: 1 }).then( teams => {
        return res.json( teams );
    } ).catch( next );

} );

// get team by teamName with all player data:
router.get('/:teamName', (req, res, next ) => {

    Team.find({ teamName: req.params.teamName }).populate('players').then( team => {
        return res.json( team );
    }).catch( next );
});

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
                callback( null,  player[0] );
            } ).catch( next );
        } )
    } );

    async.parallel( players , ( err, playerIds ) => {

        if ( err ) return console.log( err );

        // assign player ids to the player array:
        team.players = playerIds;

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
