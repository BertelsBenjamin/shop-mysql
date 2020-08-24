const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const sequelize = require('./util/database');
const Product = require('./models/product')
const User = require('./models/user')
const Cart = require('./models/cart')
const CartItem = require('./models/cart-item')
const Order = require('./models/order');
const OrderItem = require('./models/order-item');
Order.belongsToMany(Product, { through: OrderItem })

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

// AUTO_GENERATE a User (Sequelized) on start application
app.use((req, res, next) => {
    User
    .findByPk(1)
    .then(user => {
        req.user = user;
        next()
    }) // the received user is a Sequelize object including all of sequelize methods. So it's not a regular user retrieved from the database.
    .catch(err => console.log(err))
})


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

// ASSOCIATIONS
Product.belongsTo(User, {
    constraints: true,
    onDelete: 'CASCADE'
});
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem});
Product.belongsToMany(Cart, { through: CartItem});
Order.belongsTo(User);
User.hasMany(Order);


sequelize
.sync()
.then(result => {
    return User.findByPk(1)
})
.then(user => {
    if (!user) {
        return User.create({ name: "Benjamin", email: "test@test.com"})
    }
    return user
})
.then(user => {
    return user.createCart();
})
.then(() => app.listen(3000))
.catch(err => console.log(err))