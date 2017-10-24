const express = require('express');
const exphbs  = require('express-handlebars');
const bodyParser = require( 'body-parser' );
const passport = require('passport');
const strategy = require('passport-local').Strategy;
const flash = require('connect-flash');
const bcrypt = require("bcrypt-nodejs");
const api=require("./api.js");
const app = express();

passport.use(new strategy(
  function(username, password, done) {
      api.findByUsername(username, function(err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false,{ message: 'Incorrect username.' }); }
      let ismatch;
      bcrypt.compare(password,user.password,(err,res)=>{
            if (res === true) {
                ismatch=true;
            }
            else ismatch=false;
            if (!ismatch) { return done(null, false,{ message: 'Incorrect password.' }); }
            return done(null, user);
      });
    });
  })
);

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(_id, done) {
    api.findById(_id, function (err, user) {
    if (err) { return done(err); }
    done(null, user);
  });
});

app.use(bodyParser.urlencoded({ extended: true }) );
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.engine('handlebars', exphbs({defaultLayout: 'home'}));
app.set('view engine', 'handlebars');

app.get('/',(req,res)=>{
    res.render('body/cover',{});  
});

app.get('/signin',(req,res)=>{
    res.render('body/signin',{message: req.flash('error')});  
});

app.get('/signup',(req,res)=>{
    res.render('body/signup',{});  
});

app.post('/signup',(req,res)=>{
    if(req.body.password1!=req.body.password2) res.redirect('/signup_err');
    else{
        api.GetUserByUsername(req.body.username).then((user) => {
            if(user) res.redirect('/signup_err');
            else{
                api.CreateUser(req.body.username,req.body.password1);
                res.redirect('/signup_suc');
            }
        });
    }
});

app.get('/signup_err',(req,res)=>{
    res.render('body/signup_err',{});  
});

app.get('/signup_suc',(req,res)=>{
    res.render('body/signup_suc',{});  
});

app.post('/signin',passport.authenticate('local',{ failureRedirect: '/signin' ,failureFlash: true}),(req,res)=>{
    res.redirect('/private');
});

app.get('/private',(req,res)=>{
    if(req.user) res.render('body/private', { user: req.user });
    else res.redirect('/signin');
});

app.get('/search',(req,res)=>{
    if(req.user) res.render('body/search',{});  
    else res.redirect('/signin');
});

app.get('/profile',(req,res)=>{
    if(req.user) res.render('body/profile',{user: req.user});  
    else res.redirect('/signin');
});

app.post('/result',(req,res)=>{
    if(req.body.filter=="Name") {
        api.GetFilmByName(req.body.keyword).then((film)=>{
            if(film.length!=0) res.render('body/result',{film:film});
            else res.render('body/result_err',{});           
        });
    }
    else if(req.body.filter=="Director") {
        api.GetFilmByDirector(req.body.keyword).then((film)=>{
            if(film.length!=0) res.render('body/result',{film:film});
            else res.render('body/result_err',{}); 
        });
    }
    else if(req.body.filter=="Release Year") {
        api.GetFilmByReleaseYear(req.body.keyword).then((film)=>{
            if(film.length!=0) res.render('body/result',{film:film});
            else res.render('body/result_err',{}); 
        });
    }
    else if(req.body.filter=="Score") {
        api.GetFilmByScore(req.body.keyword).then((film)=>{
            if(film.length!=0) res.render('body/result',{film:film});
            else res.render('body/result_err',{}); 
        });
    }
    else if(req.body.filter=="Actor") {
        api.GetFilmByActor(req.body.keyword).then((film)=>{
            if(film.length!=0) res.render('body/result',{film:film});
            else res.render('body/result_err',{}); 
        });
    }
    else if(req.body.filter=="Film Type") {
        api.GetFilmByFilmType(req.body.keyword).then((film)=>{
            if(film.length!=0) res.render('body/result',{film:film});
            else res.render('body/result_err',{}); 
        });
    }
});

app.post('/comment',(req,res)=>{
    api.GetFilmByNo(req.body.index).then((film)=>{
        res.render('body/comment',{film:film,user: req.user});
    });  
});

app.post('/comment_submit',(req,res)=>{
    api.AddComment(req.body.film_name,req.user.username,req.body.content).then((film)=>{
        res.render('body/comment',{film:film, user:req.user});
    });
});

app.post('/score_submit',(req,res)=>{
    api.GiveScore(req.body.film_name,req.body.score).then((film)=>{
        res.json(film);
    });
});

app.post('/add_to_fav',(req,res)=>{
    api.AddtoFav(req.user.username,req.body.film_name).then((film)=>{
        res.render('body/comment',{film:film, user:req.user});
    });
});

app.get('/delete',(req,res)=>{
    if(req.user){
        if(req.user.username=="admin"){
            api.ListAllComments().then((list)=>{
                res.render('body/delete',{list:list});
            });
        }
        else res.redirect('/signin');
    }
    else res.redirect('/signin');
});

app.post('/delete_comment',(req,res)=>{
    api.DeleteComment(req.body._id).then((list)=>{
        if(list) res.render('body/delete',{list:list});
        else{
            api.ListAllComments().then((list)=>{
                res.render('body/delete',{list:list});
            });
        }
    });
});

app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log("Your routes will be running on http://localhost:3000");
});