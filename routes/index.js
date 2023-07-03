var express = require('express');
var router = express.Router();
var passport = require('passport');
var config = require('../config/config');
var jwt = require('jwt-simple');

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', { title: 'Timesheet Management App' });
});

function genToken(user) {
    var expires = new Date();
    expires.setFullYear(expires.getFullYear() + 1); // Set expiry to 1 year

    var payload = {
        uname: user.displayName,
        uemail: user.upn,
        exp: expires.getTime() // Expiry timestamp in milliseconds
    };

    var token = jwt.encode(payload, config.secretkey);

    return {
        token: token,
        expires: expires,
        username: user.upn,
        userid: user.oid
    };
}

router.get('/auth/login', function(req, res, next) {
    passport.authenticate('azuread-openidconnect', {
        response: res,                      // required
        resourceURL: config.resourceURL,    // optional. Provide a value if you want to specify the resource.
        customState: 'my_state',            // optional. Provide a value if you want to provide custom state value.
        failureRedirect: '/'
    })(req, res, next);
}, function(req, res) {
    console.log('Login was called in the Sample');
    res.redirect('/login');
});

router.get('/auth/openid/return', function(req, res, next) {
    passport.authenticate('azuread-openidconnect', {
        response: res,                      // required
        failureRedirect: '/'
    })(req, res, next);
}, function(req, res) {
    console.log('We received a return from AzureAD.');
    res.redirect('/');
});

router.post('/auth/openid/return', function(req, res, next) {
    passport.authenticate('azuread-openidconnect', {
        response: res,                      // required
        failureRedirect: '/'
    })(req, res, next);
}, function(req, res) {
    if (req.user && req.user.oid) {
        console.log('*---------------------------------');
        var token = genToken(req.user);
        res.cookie('token',  token.token);
        res.cookie('key', req.user.upn);

        res.redirect(config.clientUrl + "/login");
      //  res.redirect(config.clientUrl + "/login?token=" + token.token + "&key=" + req.user.upn);
    }
});

module.exports = router;
