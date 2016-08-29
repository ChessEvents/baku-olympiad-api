"use strict";

const mongoose = require( 'mongoose' );
const uniqueValidator = require( 'mongoose-unique-validator' );

let PlayerSchema = new mongoose.Schema( {
    id: Number,
    name: String,
    nameOfficial: String,
    rating: Number,
    ratingOfficial: Number,
    title: String,
    country: String,
    isoCountry: String,
    board: Number,
    eventType: String
});


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

mongoose.model( 'Player', PlayerSchema );
