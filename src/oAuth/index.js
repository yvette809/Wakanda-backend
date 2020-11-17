const passport = require("passport");
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const UserModel = require("../routes/users/UserSchema");
const { generateTokens } = require("../middleware/utils");
const { auth } = require("../middleware/auth");

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: "http://localhost:4000/users/auth/facebook/callback",
      enableProof: true,
    },
    async (accessToken, refreshToken, profile, cb) => {
      console.log(profile);
      console.log(accessToken);
      const newUser = {
        facebookId: profile.id,
        name: profile.name.givenName,
        email: profile.email,
        username:
          profile.name.givenName.toLocaleLowerCase() +
          profile.name.familyName.toLocaleLowerCase().slice(0, 1),
      };
      try {
        const existingUser = await UserModel.findOne({ googleId: profile.id });

        if (existingUser) {
          const token = await generateTokens(existingUser);
          done(null, { token: token.token, username: existingUser.username });
        } else {
          const createUser = new UserModel(newUser);
          const user = await createUser.save();
          const token = await generateTokens(user);
          done(null, { token: token.token, username: user.username });
        }
      } catch (error) {
        console.log(error);
      }
    }
  )
);

// gogle oAuth
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: "http://localhost:4000/users/auth/google/redirect",
      enableProof: true,
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log(profile);
      const newUser = {
        googleId: profile.id,
        name: profile.name.givenName,
        surname: profile.name.familyName,
        email: profile.emails[0].value,
      };

      try {
        const existingUser = await UserModel.findOne({ googleId: profile.id });

        if (existingUser) {
          const token = await generateTokens(existingUser);
          done(null, { token: token.token, username: existingUser.username });
        } else {
          const createUser = new UserModel(newUser);
          const user = await createUser.save();
          const token = await generateTokens(user);
          done(null, { token: token.token, username: user.username });
        }
      } catch (error) {
        console.log(error);
      }
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user);
});


passport.deserializeUser((id, done) => {
  UserModel.findById(id).then((user) => {
    done(null, user);
  });
});
