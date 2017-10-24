const MongoClient = require('mongodb').MongoClient;
const settings = require('./config.js');
const uuidV1 = require('uuid/v1');
const bcrypt = require("bcrypt-nodejs");

let fullMongoUrl = settings.mongoConfig.serverUrl + settings.mongoConfig.database;

function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + date.getHours() + seperator2 + date.getMinutes()
            + seperator2 + date.getSeconds();
    return currentdate;
}


MongoClient.connect(fullMongoUrl).then(function(db) {
    let col_user = db.collection("user");
    let col_film = db.collection("film");

    let index=0;


//initial database
    let adminhash = bcrypt.hashSync("admin");
    let admin={
         _id: uuidV1(),
         username: "admin",
         password:adminhash,
         user_type:1,
         favorite_film:[],
         comments: []
    };
    col_user.insertOne(admin);
    let actor1=["Chris Evans","Robert Downey Jr.","Chris Hemsworth","Tom Hiddleston","Scarlett Johansson","Mark Ruffalo","Jeremy Renner"];
    let type1=["action","science-fiction"];
    let film1={
         _id: uuidV1(),
         no:++index,
         name:"The Avengers",
         info:"Earth's mightiest heroes must come together and learn to fight as a team if they are to stop the mischievous Loki and his alien army from enslaving humanity.",
         actor_list:actor1,
         director:"Joss Whedon",
         film_type:type1,
         release_year:2012,
         score:0,
         num_of_person:0,
         comments: []
    };
    col_film.insertOne(film1);
    actor1=["Daniel Radcliffe","Rupert Grint","Emma Watson","John Cleese","Robbie Coltrane","Warwick Davis","Richard Griffiths"];
    type1=["family","adventure","fantasy"];
    film1={
         _id: uuidV1(),
         no:++index,
         name:"Harry Potter and the Philosopher's Stone",
         info:"Rescued from the outrageous neglect of his aunt and uncle, a young boy with a great destiny proves his worth while attending Hogwarts School of Witchcraft and Wizardry.",
         actor_list:actor1,
         director:"Chris Columbus",
         film_type:type1,
         release_year:2001,
         score:0,
         num_of_person:0,
         comments: []
    };
    col_film.insertOne(film1);
    actor1=["Tobey Maguire","Willem Dafoe","Kirsten Dunst","James Franco","Cliff Robertson","Rosemary Harris"];
    type1=["action","adventure"];
    film1={
         _id: uuidV1(),
         no:++index,
         name:"Spider-Man",
         info:"When bitten by a genetically modified spider, a nerdy, shy, and awkward high school student gains spider-like abilities that he eventually must use to fight evil as a superhero after tragedy befalls his family.",
         actor_list:actor1,
         director:"Sam Raimi",
         film_type:type1,
         release_year:2002,
         score:0,
         num_of_person:0,
         comments: []
    };
    col_film.insertOne(film1);
    actor1=["Leonardo DiCaprio","Ellen Page","Joseph Gordon-Levitt","Marion Cotillard","Ken Watanabe","Tom Hardy"];
    type1=["action","adventure","science-fiction"];
    film1={
         _id: uuidV1(),
         no:++index,
         name:"Inception",
         info:"A thief, who steals corporate secrets through use of dream-sharing technology, is given the inverse task of planting an idea into the mind of a CEO.",
         actor_list:actor1,
         director:"Christopher Nolan",
         film_type:type1,
         release_year:2010,
         score:0,
         num_of_person:0,
         comments: []
    };
    col_film.insertOne(film1);
    actor1=["Matthew McConaughey","Anne Hathaway","Jessica Chastain","Bill Irwin","Ellen Burstyn","Michael Caine"];
    type1=["drama","adventure","science-fiction"];
    film1={
         _id: uuidV1(),
         no:++index,
         name:"Interstellar",
         info:"A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
         actor_list:actor1,
         director:"Christopher Nolan",
         film_type:type1,
         release_year:2014,
         score:0,
         num_of_person:0,
         comments: []
    };
    col_film.insertOne(film1);
    actor1=["Johnny Depp","Geoffrey Rush","Orlando Bloom","Keira Knightley","Jack Davenport","Jonathan Pryce"];
    type1=["action","adventure","fantasy"];
    film1={
         _id: uuidV1(),
         no:++index,
         name:"Pirates of the Caribbean: The Curse of the Black Pearl",
         info:"Blacksmith Will Turner teams up with eccentric pirate \"Captain\" Jack Sparrow to save his love, the governor's daughter, from Jack's former pirate allies, who are now undead.",
         actor_list:actor1,
         director:"Gore Verbinski",
         film_type:type1,
         release_year:2003,
         score:0,
         num_of_person:0,
         comments: []
    };
    col_film.insertOne(film1);
//initial end



//2 functions used by passport 
exports.findByUsername = function(username, done) {
    return col_user.findOne({username:username}).then((user)=>{
        if(user) return done(null, user);
        else return done(null, null);
    }); 
};

exports.findById = function(_id, done) {
    return col_user.findOne({_id:_id}).then((user)=>{
        if(user) return done(null, user);
        else return done(new Error('User ' + _id + ' does not exist'));
    }); 
};



//api
exports.GetUserByUsername = function(username) {
    return col_user.findOne({username:username}).then((user)=>{
        return user;
    }); 
};

exports.CreateUser=function(username,password){
    let hash = bcrypt.hashSync(password);
    let user={
         _id: uuidV1(),
         username: username,
         password:hash,
         user_type:0,
         favorite_film:[],
         comments: []
    };
    return col_user.insertOne(user);
};

exports.GetFilmByName = function(name) {
    return col_film.find({name:name}).toArray().then((film)=>{
        return film;
    }); 
};

exports.GetFilmByDirector = function(director) {
    return col_film.find({director:director}).toArray().then((film)=>{
        return film;
    }); 
};

exports.GetFilmByReleaseYear = function(year) {
    let t=parseInt(year);
    return col_film.find({release_year:t}).toArray().then((film)=>{
        return film;
    }); 
};

exports.GetFilmByScore = function(score) {
    let t=parseInt(score);
    return col_film.find({score:t}).toArray().then((film)=>{
        return film;
    }); 
};

exports.GetFilmByActor = function(actor) {
    return col_film.find({actor_list:actor}).toArray().then((film)=>{
        return film;
    }); 
};

exports.GetFilmByFilmType = function(film_type) {
    return col_film.find({film_type:film_type}).toArray().then((film)=>{
        return film;
    }); 
};

exports.GetFilmByNo = function(index) {
    let t=parseInt(index);
    return col_film.findOne({no:t}).then((film)=>{
        return film;
    }); 
};

exports.AddComment = function(film_name,username,comment){
    let newComment={
        _id: uuidV1(),
        film_name:film_name,
        username:username,
        comment:comment,
        time:getNowFormatDate()
    };
    return col_user.updateOne({username:username},{$push:{comments:newComment}}).then(()=>{
        return col_film.updateOne({name:film_name},{$push:{comments:newComment}}).then(()=>{
            return col_film.findOne({name:film_name}).then((film)=>{
                return film;
            }); 
        });
    });
};

exports.GiveScore=function(film_name,score){
    let t=parseInt(score);
    return col_film.findOne({name:film_name}).then((film)=>{
        let average_score=((film.score)*(film.num_of_person)+t)/(film.num_of_person+1);
        let obj={
            score:average_score.toFixed(1),
            num_of_person:film.num_of_person+1
        };
        return col_film.updateOne({name:film_name},{$set:obj}).then(()=>{
            return col_film.findOne({name:film_name}).then((film1)=>{
                return film1;
            }); 
        });
    });
};

exports.AddtoFav=function(username,film_name){
    return col_user.updateOne({username:username},{$push:{favorite_film:film_name}}).then(()=>{
        return col_film.findOne({name:film_name}).then((film)=>{
            return film;
        });
    });
};

exports.ListAllComments = function() {
    return col_film.find().toArray().then((film)=>{
        let allcomments=[];
        for(let i=0;i<film.length;i++){
            for(let j=0;j<film[i].comments.length;j++){
                allcomments.push((film[i].comments)[j]);
            }
        }
        return allcomments;
    });
};

exports.DeleteComment= function(_id){
    return col_user.findOne({'comments._id':_id}).then((user)=>{
        if(!user) return null;
        return col_user.updateOne({username:user.username},{$pull:{comments:{_id:_id}}}).then(()=>{
            return col_film.findOne({'comments._id':_id}).then((film)=>{
            return col_film.updateOne({name:film.name},{$pull:{comments:{_id:_id}}}).then(()=>{
                return col_film.find().toArray().then((film)=>{
                    let allcomments=[];
                    for(let i=0;i<film.length;i++){
                        for(let j=0;j<film[i].comments.length;j++){
                            allcomments.push((film[i].comments)[j]);
                        }
                    }
                    return allcomments;
                });
            });
        });
        });
    });
};



});
