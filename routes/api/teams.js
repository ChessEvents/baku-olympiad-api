"use strict";

let router = require( 'express' ).Router();
let mongoose = require( 'mongoose' );
let Team = mongoose.model( 'Team' );

// return a list of teams:
router.get( '/', ( req, res, next ) => {

    Team.find().then( teams => {
        return res.json( teams );
    } ).catch( next );

} );

// create a new team:
router.post( '/', ( req, res, next ) => {

    let team = new Team( req.body.team );

    return team.save().then( () => {
        return res.json( {
            team: team.toJSONFor()
        } );
    } ).catch( next );

} );

module.exports = router;
