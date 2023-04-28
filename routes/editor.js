const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const { authentication } = require('../services/auth')
const crypto = require('crypto')

router.post('/', (req, res) => {
    let { name, room } = req.body

    // create new room when undefined
    if (!room)
        // hash md5 current time and take first 8 characters
        room = crypto
            .createHash('md5')
            .update(Date.now().toString())
            .digest('hex')
            .slice(0, 8)

    // set jwt to keep user logged in
    const token = jwt.sign({ name }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    })
    // set cookie
    res.cookie('token', `Bearer ${token}`, {
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
    })

    // redirect to editor
    res.redirect(`/editor/${room}`)
})

router.get('/:room', authentication, (req, res) => {
    const room = req.params.room
    const user = req.user.name
    res.render('editor', { room, user })
})

module.exports = router
