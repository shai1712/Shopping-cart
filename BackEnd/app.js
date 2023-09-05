const express  = require('express');

require('./db/mongoose')
const userRouter = require('./routes/user')
const itemRouter = require('./routes/item')
const bodyParser = require('body-parser')
const app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(userRouter)
app.use(itemRouter)

app.get("/api", (req, res) => {
res.json({"users": ["userOne", "userTwo"]})

})

const port  = 3000
app.listen(port, () => {
    console.log(`server started on port ${port}`)
});



