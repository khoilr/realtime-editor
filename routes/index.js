var express = require('express')
var router = express.Router()
const { authorization } = require('../services/auth')

router.get('/', authorization, async function (req, res, next) {
    const user = req?.user?.name
    res.render('index', { user })
})

module.exports = router
