const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const config = require('../config/database');

const Schema = mongoose.Schema;
//User schema
const UserSchema = mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
     }
     ,
    movies:[{
        type: Schema.Types.ObjectId,
        ref:'Movie',
        required:false
        
    }]
});

//Movie Schema
const MovieSchema = mongoose.Schema({   
    moviename:{
        type:String
    },
    director:{
        type:String
    }
});

const User = module.exports = mongoose.model('User', UserSchema);

//const Movie = module.exports = mongoose.model('Movie', MovieSchema);

//functions for getting user by id/name

module.exports.getUserById = function(id, callback){
    User.findById(id, callback);
}

module.exports.getUserByName = function(username, callback){
    const query = {username: username}
    User.findOne(query, callback);
}

module.exports.addUser = function(newUser, callback){
    bcrypt.genSalt(10, (err, salt) => {
        console.log('newUser.password',newUser.password);
        bcrypt.hash(newUser.password, salt, (err, hash)=>{
            if(err) throw err;
            newUser.password = hash;
            newUser.save(callback);
        })
    })
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
    bcrypt.compare(candidatePassword, hash, (err, isMatch)=>{
        if(err) throw err;
        callback(null, isMatch);
    });
}

module.exports.addMovie = function(username,newMovie, callback){
    const query = {username: username}
    console.log('In addMovie()');
    const newmovie = new Movie({
        moviename: newMovie.moviename,
        director: newMovie.director
    });
    newmovie.save(err=>{
        if(err) throw err;
    console.log(newmovie);
    User.findOneAndUpdate(query,
        {
            $push:{movies:[
                            newmovie._id    //            
            ]}
        },
         callback);
    
});
    
}




