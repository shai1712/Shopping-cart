const express = require('express');
const User = require('./models/user')
const Item  = require('./models/item')

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

// const main = async () => {

//     const item = await Item.findById('64f8a92a9d8e95397faef6c6').populate('userId')
//     console.log(item.userId)

//     const user = await User.findById('64fdaba6eb966a64cae56903').populate('items')
//     console.log(user.items)
// }
// main()

