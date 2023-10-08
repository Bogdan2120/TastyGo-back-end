const { HttpError, ctrlWrapper } = require("../hellpers");
const { UserModal } = require("../models/User");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const {SECRET_KEY} = process.env;


const registerUser = async (req, res) => {
    const {email, password} = req.body;
    const user = await UserModal.findOne({email});
    if(user) {
        throw HttpError(409, 'User already exist')
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await UserModal.create({
        email, 
        password: hashPassword
    })

    const payload = { 
        id: newUser._id
    }

    const token =  jwt.sign(payload, SECRET_KEY, {expiresIn: '24h'});

    const createUser = await UserModal.findByIdAndUpdate(newUser._id, {token}, {new: true})

    res.status(201).json(createUser)
}

const loginUser = async (req, res) => {
    const {email, password} = req.body
const user = await UserModal.findOne({email})
if(!email){
throw HttpError(401, 'Not authorized')
}
const hashPassword = await bcrypt.compare(password, user.password);

if(!hashPassword){
    throw HttpError(401, 'Email or password is wrong')
}

const payload = {
    id: user.id
}

const token = jwt.sign(payload, SECRET_KEY, {expiresIn: '24h'})

const updateUser = await UserModal.findByIdAndUpdate(user._id, {token}, {new: true})

res.json(updateUser)
}

const logoutUser = async (req, res) => {
    const {id} = req.userId;
    await UserModal.findByIdAndUpdate(id, {token: ''})

    res.json({
        message: 'Succes logout'
    })
}

const currentUser = async (req, res) => {
const {id} = req.userId;
const user = await UserModal.findById(id);
if(!user){
    throw HttpError(404, 'User not found')
}

res.json(user)
}

module.exports = {
    registerUser: ctrlWrapper(registerUser),
    loginUser: ctrlWrapper(loginUser),
    logoutUser: ctrlWrapper(logoutUser),
    currentUser: ctrlWrapper(currentUser)
}