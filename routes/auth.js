/** POST /login - login: {username, password} => {token}
 *
 * Make sure to update their last-login!
 *
 **/


/** POST /register - register user: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 *
 *  Make sure to update their last-login!
 */


const jwt = require("jsonwebtoken");
const Router = require("express").Router;
const router = new Router();

const User = require("../models/user");
const {SECRET_KEY} = require("../config");
const ExpressError = require("../expressError");

router.post("/login", async function(req, res, next) {
    try {
        let {username, password} = req.body;

// Investigate User.authenticate logic.
// think server error
        if (await User.authenticate(username, password)) {
            console.log('IN THE IF *****************')
            let token = jwt.sign({username}, SECRET_KEY)
            return res.json({token})
        } else {
            console.log('*****************')
            return res.statusCode(400)
            throw new ExpressError("Invalid login attempt")
            
        }
      }
    catch(err) {
        console.log('Caught *****************')
        return next(err)
    }
});

router.post('/register', async (req, res, next) => {
    try {
        let {username} = await User.register(req.body)
    let token = jwt.sign({username}, SECRET_KEY)
    User.updateLoginTimestamp(username);
    return res.json({token})
         }
         catch (err) {
            return next(err);
         }
});

// routes work, but send 500 internal server error instead of 400
 

module.exports = router;