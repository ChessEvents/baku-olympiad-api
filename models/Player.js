"use strict";

const mongoose = require( 'mongoose' );
const uniqueValidator = require( 'mongoose-unique-validator' );

let PlayerSchema = new mongoose.Schema( {
    id: Number,
    rank: Number,
    name: String,
    rating: Number,
    title: String,
    country: String,
    team: String,
    fed: String,
    board: Number,
    eventType: String,
    total: Number,
    currentRank: Number,
    roundResults: Array
} );


PlayerSchema.plugin( uniqueValidator, {
    message: 'is already taken'
} );

PlayerSchema.methods.toJSONFor = function () {
    return {
        id: this.id,
        name: this.name,
        rating: this.rating,
        country: this.country,
        eventType: this.eventType,
        board: this.board
    }
};

mongoose.model( 'Player', PlayerSchema );
