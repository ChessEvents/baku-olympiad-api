const mongoose = require( 'mongoose' );
const uniqueValidator = require( 'mongoose-unique-validator' );
const slug = require( 'slug' );

let PlayerSchema = new mongoose.Schema( {
    name: String,
    rating: Number,
    country: String,
    board: Number
}, {
    timestamps: true
} );

PlayerSchema.plugin( uniqueValidator, {
    message: 'is already taken'
} );

PlayerSchema.methods.toJSONFor = () => {
    return {
        name: this.name,
        rating: this.rating,
        country: this.country,
        board: this.board,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt
    }
};

mongoose.model( 'Player', PlayerSchema );
