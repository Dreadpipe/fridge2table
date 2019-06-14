const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
// const TwitterStrategy = require('passport-twitter').Strategy;
// const FacebookStrategy = require('passport-facebook').Strategy;
const db = require('../models');

const { User } = db;

passport.use(
  new GoogleStrategy(
    {
      // options for the strategy
      callbackURL: `/auth/google/redirect`,
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      proxy: true,
    },
    (accessToken, refreshToken, profile, done) => {
      // Check for existence of user in database
      User.findOne({ thirdPartyId: profile.id }).then((currentUser) => {
        if (currentUser) {
          // User already registered
          console.log(`User is: ${currentUser}`);
          done(null, currentUser);
        } else {
          // Create user
          new User({
            username: profile.displayName,
            thirdPartyId: profile.id,
            thirdPartyAccessToken: accessToken,
            thirdPartyRefreshToken: refreshToken,
          })
            .save()
            .then((newUser) => {
              console.log(`User added! Details: ${newUser}`);
              done(null, newUser);
            });
        }
      });
    },
  ),
);

// passport.use(
//   new FacebookStrategy(
//     {
//       clientID: process.env.FACEBOOK_APP_ID,
//       clientSecret: process.env.FACEBOOK_APP_SECRET,
//       callbackURL: '/auth/facebook/redirect',
//       proxy: true,
//     },
//     (accessToken, refreshToken, profile, done) => {
//       User.findOne({ thirdPartyId: profile.id }).then((currentUser) => {
//         if (currentUser) {
//           // User already registered
//           console.log(`User is: ${currentUser}`);
//           done(null, currentUser);
//         } else {
//           // Create user
//           new User({
//             username: profile.displayName,
//             thirdPartyId: profile.id,
//           })
//             .save()
//             .then((newUser) => {
//               console.log(`User added! Details: ${newUser}`);
//               done(null, newUser);
//             });
//         }
//       });
//     },
//   ),
// );

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});
