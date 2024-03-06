const mongoose = require('mongoose');
const connect=mongoose.connect('mongodb://localhost:27017/Login');
// mongoose.Promise = require('bluebird');

connect.then(()=>{
    console.log('connected to database');
})
.catch(()=>{
    console.log('error connecting to database');
});

const Loginschema = new mongoose.Schema({
    name: {
        type:String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

const collection = new mongoose.model("users", Loginschema);

module.exports = collection;