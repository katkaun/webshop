const Order = require('../models/order');
const express = require('express');
const router = express.Router();
const OrderItem = require('../models/orderItem');

router.get(`/`, async (req, res) => {
    const orderList = await Order.find();

    if(!orderList) {
        res.status(500).json({success: false})
    }
    res.send(orderList);
})

router.post('/', async (req, res) => {
    const orderItemsIds = Promise.all(req.body.orderItems.map(async orderItem => {
        let newOrderItem = new OrderItem({
            quantity: orderItem.quantity,
            product: orderItem.product
        })

        newOrderItem = await newOrderItem.save();
        return newOrderItem._id;
    }))
    const savedOrderItemIds = await orderItemsIds;
    

    let order = new Order({
        orderItems: savedOrderItemIds,
        shippingAdress1: req.body.shippingAdress1,
        shippingAdress2: req.body.shippingAdress2,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        phone: req.body.phone,
        status: req.body.status,
        totalPrice: req.body.totalPrice,
        user: req.body.user,
    })
    order = await order.save();

    if(!order)
    return res.status(404).send('Order cannot be placed')

    res.send(order);
})

module.exports = router;