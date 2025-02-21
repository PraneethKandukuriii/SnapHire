const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const captainSchema = new mongoose.Schema({
    fullname: {
        firstname: {
            type: String,
            required: true,
            minlength: [3, 'First name must be at least 3 characters long.']
        },
        lastname: {
            type: String,
            minlength: [3, 'Last name must be at least 3 characters long.']
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    socketId: {
        type: String
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'inactive'
    },
    camera: {
        cameraType: {
            type: String,
            required: true,
            enum: ['Flagship Smart Phone', 'Dlsr Camera', 'Mirrorless Camera']
        }
    },
    location: {
        city: { type: String },
        state: { type: String },
        country: { type: String },
        lat: { type: Number },
        lng: { type: Number }
    },
    skills: {
        type: [String],
        default: []
    },
    socialLinks: {
        instagram: { type: String },
        vsco: { type: String },
        portfolio: { type: String }
    },
    mediaUploads: {
        images: [{ type: String }],
        videos: [{ type: String }]
    }
});


captainSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});


captainSchema.methods.generateAuthToken = function () {
    return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
};

captainSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

captainSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password, 10);
};

const captainModel = mongoose.model('Captain', captainSchema);

module.exports = captainModel;
