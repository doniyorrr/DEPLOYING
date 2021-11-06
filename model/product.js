const mongoose = require('mongoose');
const schema = mongoose.Schema

const productSchema = new schema({

    title : {
        type: String,
        required: true
    },
    price :{
        type: Number,
        default: 0
    },
    photo:{
        type: String
    },
    like:{
        type: Number,
        default: 0
    },
    dateNow : {
        type: Date,
        default: Date.now()
    },
    category:{
        type: String
    },
    comments:{
        type: String,
        // minlength: 15,
        required: true
    }, 
    sale : Number,
    dirUser: String

})

module.exports = mongoose.model( "product" , productSchema)






















