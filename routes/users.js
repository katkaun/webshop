const User = require('../models/user');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//Get list of users
router.get(`/`, async (req, res) => {                               // .select('name phone email') to show only ex. name email phone
    const userList = await User.find().select('-passwordHash');   // .select('-passwordHash') to exclude password when getting users

    if(!userList) {
        res.status(500).json({success: false})
    }
    res.send(userList);
})

//Get a single user
router.get('/:id', async(req, res) => {
    const user = await User.findById(req.params.id).select('-passwordHash');
    if(!user) {
        res.status(500).json({message: 'The user with the given ID was not found.'})
    }
    res.status(200).send(user);
})

//For admin who wants to remove or add users
router.post('/', async (req, res) => {
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        adress: req.body.adress,
        apartment: req.body.apartment,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
    })
    user = await user.save();

    if(!user)
    return res.status(404).send('The user cannot be created')

    res.send(user);
})

//A single user login
router.post('/login', async (req, res) => {
    const user = await User.findOne({email: req.body.email})
    const secret = process.env.secret;

    if (!user) {
        return res.status(400).send('No user found');
    }

    if(user && bcrypt.compareSync(req.body.password, user.passwordHash)){
        const token = jwt.sign(
            {
                userId: user.id,              //pass the data you want to with the token
                isAdmin: user.isAdmin 
            },          
            secret,                           //pass a secret ex password which is used to create your tokens
            {expiresIn: '1d'}                           
        )

        res.status(200).send({user: user.email, token: token})
    } else {
        res.status(400).send('Password is incorrect')
    }
});

    //User registration
    router.post('/register', async (req, res) => {
        let user = new User({
            name: req.body.name,
            email: req.body.email,
            passwordHash: bcrypt.hashSync(req.body.password, 10),
            phone: req.body.phone,
            isAdmin: req.body.isAdmin,
            adress: req.body.adress,
            apartment: req.body.apartment,
            city: req.body.city,
            zip: req.body.zip,
            country: req.body.country,
        });
        user = await user.save();
    
        if(!user)
        return res.status(404).send('The user cannot be created')
    
        res.send(user);
    })

    router.delete('/:id', (req, res) => {
        User.findByIdAndDelete(req.params.id).then(user => {
            if(user) {
                return res.status(200).json({success: true, message: 'The user is deleted'})
            } else {
                return res.status(404).json({success: false, message: 'user not found'})
            }
        }).catch(error => {
            return res.status(400).json({success: false, error: error})
        })
    })

    router.get(`/get/count`, async (req, res) => {
        try {
            const userCount = await User.countDocuments();
    
            if (userCount === 0) {
                res.status(404).json({ success: false, message: 'No users found' });
                return;
            }
    
            res.json({ success: true, count: userCount });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

module.exports = router;