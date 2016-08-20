let router = require( 'express' ).Router();
let api = require( './api' );

router.use( '/api', api );

module.exports = router;
