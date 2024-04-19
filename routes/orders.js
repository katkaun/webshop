const Order = require('../models/order');
const express = require('express');
const router = express.Router();
const OrderItem = require('../models/orderItem');
const order = require('../models/order');
const orderItem = require('../models/orderItem');

router.get(`/`, async (req, res) => {
    try {
        const orderList = await Order.find().populate('user', 'name').sort({'dateOrdered': -1});

        if(orderList.length === 0) {
            return res.status(404).json({success: false})
        }
        res.send(orderList);
    } catch (error) {
        console.error(error);
        res.status(500).json({success: false});
    }
})

router.get('/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
        .populate('user', 'name')
        .populate({path: 'orderItems', populate: 'product'});

        if(!order) {
            return res.status(500).json({success: false})
        }
        res.send(order);
    } catch{
        res.status(500).json({success: false})
    }
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

    const totalOrderPrice = await Promise.all(savedOrderItemIds.map(async (orderItemId) => {
        const orderItem = await OrderItem.findById(orderItemId).populate('product', 'price');
        const totalOrderPrice = orderItem.product.price * orderItem.quantity;
        return totalOrderPrice
    }))

    const totalPrice = totalOrderPrice.reduce((a,b) => a + b, 0);
    
    let order = new Order({
        orderItems: savedOrderItemIds,
        shippingAddress1: req.body.shippingAddress1,
        shippingAddress2: req.body.shippingAddress2,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        phone: req.body.phone,
        status: req.body.status,
        totalPrice: totalPrice,
        user: req.body.user,
    })
    order = await order.save();

    if(!order) 
    return res.status(404).send('Order cannot be placed')
    

    res.send(order);
})

    router.put('/:id', async (req, res) => {
        const order = await Order.findByIdAndUpdate(req.params.id,
            {
                status: req.body.status
            },
            { new: true } 
        )
    
        if (!order) {
            return res.status(404).send('The order cannot be found');
        }
    
        res.send(order);
})

router.delete('/:id', (req, res) => {
    Order.findByIdAndDelete(req.params.id).then(async order => {
        if(order) {
            await order.orderItems.map(async orderItem => {
                await OrderItem.findByIdAndDelete(orderItem)
            })
            return res.status(200).json({success: true, message: 'The order is deleted'})
        } else {
            return res.status(404).json({success: false, message: 'order not found'})
        }
    }).catch(error => {
        return res.status(400).json({success: false, error: error})
    })
})

//For admin to see the total sales
router.get('/get/totalsales', async (req,res) => {
    const totalSales = await Order.aggregate([
        {$group: {_id:null, totalsales: {$sum: '$totalPrice'}}}
    ])

    if(!totalSales) {
        return res.status(400).send('The sales cannot be generated')
    }
    res.send({totalsales: totalSales.pop().totalsales})
})

router.get('/get/count', async (req, res) =>{
    try {
        const orderCount = await Order.countDocuments();

        res.send({
            orderCount: orderCount
        });
    } catch(error) {
        res.status(500).json({success: false})
    }
})

//order history for user
router.get('/get/orderhistory/:userid', async (req, res) => {
    try {
        const userOrderList = await Order.find({user: req.params.userid}).populate({
            path: 'orderItems', 
            populate: {
                path: 'product', 
                populate: 'category' 
            }
        }).sort({'dateOrdered': -1});

        if(userOrderList.length === 0) {
            return res.status(404).json({success: false})
        }
        
        res.send(userOrderList);
    } catch (error) {
        console.error(error);
        res.status(500).json({success: false});
    }
})

module.exports = router;