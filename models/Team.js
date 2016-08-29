"use strict";

const mongoose = require( 'mongoose' );
const uniqueValidator = require( 'mongoose-unique-validator' );

let TeamSchema = new mongoose.Schema( {
    name: {
        type: String,
        unique: true
    },
    owner: String,
    openPlayers: [ {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player'
    } ],
    womenPlayers: [ {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player'
    } ]
});

TeamSchema.plugin( uniqueValidator, {
    message: 'is already taken'
} );


TeamSchema.methods.toJSONFor = () => {
    return {
        name: this.name,
        description: this.description,
        owner: this.owner,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
        openPlayers: this.openPlayers,
        womensPlayers: this.womensPlayers
    }
};

mongoose.model( 'Team', TeamSchema );
