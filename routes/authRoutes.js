const router = require('express').Router();
const passport = require('passport');

// Auth Login
router.get('/login', (req, res) => {
  res.render('login');
});

// Auth Logout
router.get('/logout', (req, res) => {
  // Handle with Passport
  req.logout();
  res.redirect('/');
});

// Auth with Third Party
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile'],
    accessType: 'offline',
    prompt: 'consent',
  }),
);

// router.get(
//   '/twitter',
//   passport.authenticate('twitter', {
//     scope: ['profile'],
//   }),
// );

// router.get(
//   '/facebook',
//   passport.authenticate('facebook', {
//     scope: ['email'],
//   }),
// );

// Callback for Third-Party Redirects
router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
  // res.send(req.user);
  res.redirect('/');
});

// router.get('/twitter/redirect', passport.authenticate('twitter'), (req, res) => {
//   // res.send(req.user);
//   res.redirect('/user/');
// });

// router.get('/facebook/redirect', passport.authenticate('facebook'), (req, res) => {
//   // res.send(req.user);
//   res.redirect('/user/');
// });

module.exports = router;
