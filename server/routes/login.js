const express = require('express');
const User = require('../models/User');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;
const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const EMAIL = 'kenzhebaev032@gmail.com';
const PASSWORD = 'e7zbiMa3KWWcY';

const regLayout = '../views/layouts/signin';

const sendWelcomeEmail = (userEmail) => {
  let config = {
      host: 'smtp.office365.com', 
      port: 587,
      secure: false, 
      auth: {
          user: EMAIL,
          pass: PASSWORD
      }
  };

  let transporter = nodemailer.createTransport(config);

  let mailGenerator = new Mailgen({
      theme: "default",
      product: {
          name: "Aqshacoin", 
          link: 'https://example.com/' 
      }
  });

  let emailContent = {
      body: {
          name: "New User",
          intro: "Welcome to Our Website!",
          outro: "Thank you for joining us. If you have any questions, feel free to contact us."
      }
  };

  let emailHTML = mailGenerator.generate(emailContent);

  let message = {
      from: EMAIL, 
      to: userEmail, 
      subject: "Welcome to Our Website", 
      html: emailHTML 
  };

  transporter.sendMail(message, (error, info) => {
      if (error) {
          console.error("Error sending welcome email:", error);
      } else {
          console.log("Welcome email sent:", info.response);
      }
  });
};


passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async function (accessToken, refreshToken, profile, done) {
      const newUser = {
        googleId: profile.id,
        displayName: profile.displayName,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        profileImage: profile.photos[0].value,
      };

      try {
        let user = await User.findOne({ googleId: profile.id });
        if (user) {
          done(null, user);
        } else {
          user = await User.create(newUser);
          done(null, user);
        }
      } catch (error) {
        console.log(error);
      }
    }
  )
);

// Google Login Route
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

// Retrieve user data
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login-failure",
    successRedirect: "/admin/dashboard",
  })
);

router.get('/', async (req, res) => {
    try {
      const locals = {
        title: "Admin",
        description: "Platform portfolio"
      }
  
      res.render('admin/login', { locals, layout: regLayout });
    } catch (error) {
      console.log(error);
    }
  });
  
  
  router.post('/', async (req, res) => {
    try {
      const { username, password } = req.body;
      
      const user = await User.findOne( { username } );
  
      if(!user) {
        return res.status(401).json( { message: 'Invalid credentials' } );
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
  
      if(!isPasswordValid) {
        return res.status(401).json( { message: 'Invalid credentials' } );
      }
  
      const token = jwt.sign({ userId: user._id}, jwtSecret );
      res.cookie('token', token, { httpOnly: true });
      res.redirect('/dashboard');
  
    } catch (error) {
      console.log(error);
    }
  });
  
  router.get('/register', async (req, res) => {
    try {
  
      const locals = {
        title: "Registration",
        description: "You can registrate your account here",
      };
  
      res.render('admin/register', {
        locals,
        layout: regLayout
      })
  
    } catch (error) {
      console.log(error);
    }
  
  });


  router.post('/register', async (req, res) => {
    try {
      const { username, password, role, firstName, lastName, age, country, gender } = req.body;
      

      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const newUser = new User({ 
        username, 
        password: hashedPassword, 
        role,
        firstName, 
        lastName, 
        age, 
        country, 
        gender,
      });
      await newUser.save();
  
      await sendWelcomeEmail(username);

      res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  module.exports = router;