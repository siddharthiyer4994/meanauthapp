const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");

const config = require("../config/database");
const User = require("../models/user");
const Post = require("../models/replies");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.post('/:postID/addReply', (req, res, next) => {
  console.log(req.params.postID);
  let reply = {
    message: req.body.message
  };

  Post.addReply(req.params.postID, reply, (err, posts) => {
    if (err) {
      res.json({
        success: false,
        msg: "Failed to register reply"
      });
    } else {
      res.json({
        success: true,
        msg: "Reply registered "
      });
    }
  })

})

router.get('/getPosts', (req, res) => {
  Post.getPosts((err, posts) => {
    console.log(posts)
    res.json(posts);
  })

})
//Post for comments and replies
router.post("/addPost", (req, res, next) => {
  let newPost = new Post({
    text: req.body.text,
    replies: req.body.replies
  });

  Post.addPost(newPost, (err, ok) => {
    if (err) {
      res.json({
        success: false,
        msg: "Failed to register Post"
      });
    } else {
      res.json({
        success: true,
        msg: "Post registered "
      });
    }
  });
});

// Register
router.post("/register", (req, res, next) => {
  console.log("req.body.password", req.body.password);
  let newUser = new User({
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password
  });
  console.log("newUser.name", newUser.name);

  User.addUser(newUser, (err, user) => {
    if (err) {
      res.json({
        success: false,
        msg: "Failed to register User"
      });
    } else {
      res.json({
        success: true,
        msg: "User registered "
      });
    }
  });
});

// Authenticate
router.post("/authenticate", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  User.getUserByName(username, (err, user) => {
    if (err) throw err;
    if (!user) {
      return res.json({
        success: false,
        msg: "User not found"
      });
    }

    User.comparePassword(password, user.password, (err, isMatch) => {
      if (err) throw err;
      if (isMatch) {
        const token = jwt.sign(user.toJSON(), config.secret, {
          expiresIn: 604800 //1 week in seconds
        });

        res.json({
          success: true,
          token: "bearer " + token,
          user: {
            id: user._id,
            name: user.name,
            username: user.username,
            email: user.email
          }
        });
      } else {
        return res.json({ success: false, msg: "Wrong Password" });
      }
    });
  });
});

// Profile
router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    console.log("Checking url for user authentication!");
    res.json({
      user: req.user
    });
  }
);

//Movie
router.put(
  "/addmovie",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    let username = req.body.username;
    let newMovie = {
      moviename: req.body.moviename,
      director: req.body.director
    };
    console.log("Params: ", username, newMovie);
    User.addMovie(username, newMovie, (err, user) => {
      if (err) {
        res.json({
          success: false,
          msg: "Failed to add Movie"
        });
      } else {
        res.json({
          success: true,
          msg: "Movie Added "
        });
      }
    });
  }
);

// Validate
router.get("/validate", (req, res, next) => {
  res.send("Validate");
});

module.exports = router;
