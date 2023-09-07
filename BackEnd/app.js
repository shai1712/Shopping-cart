const express  = require('express');

require('./db/mongoose')
const userRouter = require('./routes/user')
const itemRouter = require('./routes/item')
const shoppingCartRouter = require('./routes/shoppingCart')
const orderRouter = require('./routes/order')
const categoryRouter = require('./routes/category')
const bodyParser = require('body-parser')
const app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(userRouter)
app.use(itemRouter)
app.use(shoppingCartRouter)
app.use(orderRouter)
app.use(categoryRouter)

app.get("/api", (req, res) => {
res.json({"users": ["userOne", "userTwo"]})

})

const port  = 3000
app.listen(port, () => {
    console.log(`server started on port ${port}`)
});



