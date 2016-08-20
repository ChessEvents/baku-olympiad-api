"use strict";

const mongoose = require( 'mongoose' );
const uniqueValidator = require( 'mongoose-unique-validator' );
const slug = require( 'slug' );

let TeamSchema = new mongoose.Schema( {
    slug: {
        type: String,
        lowercase: true,
        unique: true
    },
    name: String,
    description: String,
    owner: String,
    openPlayers: [ {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player'
    } ],
    womenPlayers: [ {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player'
    } ]
}, {
    timestamps: true
} );

TeamSchema.plugin( uniqueValidator, {
    message: 'is already taken'
} );

TeamSchema.pre( 'validate', function ( next ) {
    this.slugify();
    next();
} );

TeamSchema.methods.toJSONFor = function () {
    return {
        slug: this.slug,
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
