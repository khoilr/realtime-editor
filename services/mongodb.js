const mongoose = require('mongoose')

const client = mongoose
    .connect('mongodb://localhost:27017/realtime-editor', {})
    .then(async () => {
        console.log('Connected')
    })
    .catch((err) => {
        console.error(err)
    })
