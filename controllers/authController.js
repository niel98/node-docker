const User = require('../models/userModel')
const bcrypt = require ('bcryptjs')

exports.signUp = async(req, res, next) => {
    try {
        const { username, password } = req.body
        const hashPassword = await bcrypt.hash(password, 12)
        const user = await User.create({
            username,
            password: hashPassword
        })
        req.session.user = user
        res.status(201).json({
            status: 'success',
            results: user.length,
            data: {
                user
            }
        })
    } catch (err) {
        console.log(err.message)
        res.status(500).json({
            status: 'fail'
        })
    }
}

exports.login = async(req, res, next) => {
    try {
        const { username, password } = req.body
        const user = await User.findOne({username})
        if (!user) {
            return res.status(404).json({
                status: 'fail',
                message: 'User does not exist on the DB'
            })
        }

        const validUser = await bcrypt.compare(password, user.password)
        if (!validUser) {
            return res.status(400).json({
                status: 'fail',
                message: 'Invalid credentials'
            })
        } else {
            req.session.user = user
            return res.status(200).json({
                status: 'success',
                message: 'User signed in successfully'
            })
        }

    } catch (err) {
        console.log(err.message)
        res.status(500).json({
            status: 'fail'
        })
    }
}
