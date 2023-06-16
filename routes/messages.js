


/** POST / - post message.
 *
 * {to_username, body} =>
 *   {message: {id, from_username, to_username, body, sent_at}}
 *
 **/


/** POST/:id/read - mark message as read:
 *
 *  => {message: {id, read_at}}
 *
 * Make sure that the only the intended recipient can mark as read.
 *
 **/

const Router = require('express').Router;
const router = new Router();

const User = require('../models/user');
const Message = require('../models/message')
const {SECRET_KEY} = require('../config')
const ExpressError = require('../expressError')
const {ensureLoggedIn} = require('../middleware/auth')

/** GET /:id - get detail of message.
 *
 * => {message: {id,
 *               body,
 *               sent_at,
 *               read_at,
 *               from_user: {username, first_name, last_name, phone},
 *               to_user: {username, first_name, last_name, phone}}
 *
 * Make sure that the currently-logged-in users is either the to or from user.
 *
 **/

router.get('/:id', ensureLoggedIn, async (req, res, next) => {
    try {
        let username = req.user.username;
        let message = await Message.get(req.params.id)

        if(msg.to_username === username || msg.from_username === username){
            return res.json({message: message});
        } else {
            throw new ExpressError('You do not have permission to view this message', 401)
        }
    }
    catch(err) {
        return next(err);
    }
});

/** POST / - post message.
 *
 * {to_username, body} =>
 *   {message: {id, from_username, to_username, body, sent_at}}
 *
 **/

router.post('/', ensureLoggedIn, async (req, res, next) => {
    try {
        let message = await Message.create({
            from_username: req.user.username,
            to_username: req.body.to_username,
            body: req.body.body
        })
        return res.json({message: message})
    }
        catch (err) {
            return next(err)

        }
})

router.post('/:id/read', ensureLoggedIn, async (req, res, next) => {
    try {
        let username = req.user.username;
        let msg = await Message.get(req.params.id);

        if (msg.to_user.username == username ) {
            return res.json({message});
        } else {
            throw new ExpressError('Permission Denied!')
        }


    }
    catch (err) {
        return next(err)
    }
})
