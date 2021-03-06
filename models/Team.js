"use strict";

const mongoose = require( 'mongoose' );
const uniqueValidator = require( 'mongoose-unique-validator' );

let TeamSchema = new mongoose.Schema( {
    name: String,
    teamName: String,
    country: String,
    iso: String,
    owner: String,
    openGold: String,
    openSilver: String,
    openBronze: String,
    openIndGold: String,
    womenGold: String,
    womenSilver: String,
    womenBronze: String,
    womenIndGold: String,
    score: Object,
    bonusScore: Object,
    roundRank: Array,
    playerIds: Array,
    players: [ {
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
        teamName: this.teamName,
        players: this.players
    }
};

mongoose.model( 'Team', TeamSchema );
mongoose.model( 'TeamW2S', TeamSchema );
