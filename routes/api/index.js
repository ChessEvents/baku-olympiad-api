"use strict";

let router = require( 'express' ).Router();

router.use( '/teams', require( './teams' ) );
router.use( '/teams-w2s', require( './teams-w2s' ) );

router.use( '/players', require( './players') );


router.use( function ( err, req, res, next ) {
    if ( err.name === 'ValidationError' ) {
        return res.status( 422 ).json( {
            errors: Object.keys( err.errors ).reduce( function ( errors, key ) {
                errors[ key ] = err.errors[ key ].message;

                return errors;
            }, {} )
        } );
    }

    return next( err );
} );

module.exports = router;
