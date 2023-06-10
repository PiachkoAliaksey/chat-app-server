import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';
import userModel from '../userModel.js'

export const signUp = async (req, res) => {
    try {
        const{fullName} = req.body;
        const userCheck = await userModel.findOne({fullName})
        const errors = validationResult(req);
        if(userCheck){
            return res.status(400).json({msg:'Username already used'})
        }
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }

        const doc = new userModel({
            fullName: req.body.fullName,
        });

        const user = await doc.save();
        const token = jwt.sign({
            _id: user._id
        }, 'secretPass', { expiresIn: '30d' });

        const {...userData } = user._doc;

        res.json({ ...userData, token })

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Failed to register'
        })
    }
}

export const login = async (req, res) => {
    try {
        const user = await userModel.findOne({ fullName: req.body.fullName });
        if (!user) {
            return res.status(404).json({
                message: 'Not found'
            })
        }
        const isValidName = req.body.fullName === user._doc.fullName
        if (!isValidName) {
            return res.status(403).json({
                message: 'Else fullName'
            })
        }
        const token = jwt.sign({
            _id: user._id
        }, 'secretPass', { expiresIn: '30d' });

        const {...userData} = user._doc;

        res.json({ ...userData, token })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to login'
        })
    }
}

export const getMe = async (req, res) => {
    try {
        const user = await userModel.findById(req.userId);
        if (!user) {
            return res.status(404).json({
                message: 'not found'
            })
        }
        const {...userData } = user._doc;
        res.json({ ...userData })
    } catch (err) {
        res.status(500).json({
            message: "not access"
        })
    }
}

export const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find({_id:{$ne:req.params.id}});
        res.json(users)
    } catch (err) {
        res.status(500).json({
            message: 'wrong request'
        })

    }
}

export const getNewUser = async (req, res) => {
    try {
        const users = await userModel.findOne({fullName:req.body.fullName});
        res.json(users)
    } catch (err) {
        res.status(500).json({
            message: 'wrong request'
        })

    }
}


