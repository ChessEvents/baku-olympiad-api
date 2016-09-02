"use strict";

const mongoose = require( 'mongoose' );
const uniqueValidator = require( 'mongoose-unique-validator' );

// let RoundResultSchema = new mongoose.Schema( {
//     round: Number,
//     colour: String,
//     result: String, // Here we have to be careful of default results!!
//     points: Number
// } );

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
    roundResults: Array
} );


PlayerSchema.plugin( uniqueValidator, {
    message: 'is already taken'
} );

PlayerSchema.methods.toJSONFor = function () {
    return {
        id: this.id,
        name: this.name,
        nameOfficial: this.nameOfficial,
        rating: this.rating,
        ratingOfficial: this.ratingOfficial,
        country: this.country,
        isoCountry: this.isoCountry,
        eventType: this.eventType,
        board: this.board,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt
    }
};

// mongoose.model( 'RoundResult', RoundResultSchema );
mongoose.model( 'Player', PlayerSchema );
