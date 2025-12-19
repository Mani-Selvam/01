"use strict";

const mongoose = require("mongoose");
let userSchema = new mongoose.Schema({

    user_name: {
        type: String,
        required: [true, 'user_name is required']
    },
    gst_no: {
        type: String,
        required: false,

    },
    company_name: {
        type: String,
        required: [true, 'company_name is required'],
    },
    emailId: {
        type: String,
        required: [true, "email is required"]
    },
    mobile_no: {
        type: String,
        required: [true, "mobile_no is required"],
        validate: {
            validator: function (v) {
                // Validate that the mobile_no is a 10-digit number
                return /^[0-9]{10}$/.test(v);
            },
            message: props => `${props.value} is not a valid 10-digit mobile number!`
        }
    },
    password: {
        type: String,
        required: [true, "password is required"]
    },
    original_password: {
        type: String,
        required: false,
    },
    is_deleted: {
        type: Boolean,
        required: [true, "is_deleted is required"],
        default: false
    },
    token: {
        type: String,
        required: false,
    },
    userId: {
        type: String,
        required: false,
    },
    email_verified: {
        type: Boolean,
        required: [true, 'email_verified is required'],
        default: true,
    },
    company_no: {
        type: String,
        required: [false,],
    },
    user_type: {
        type: String, enum: ['Admin', 'Staff'],
        required: [true, 'user_type is required'],
    },
    profile_image: {
        type: String,
        required: [false,],
    },
    firebase_usertoken: {
        type: Array,
        required: [false],
    },
    planId: {
        type: String,
        required: [false,],
    },
    orderId: {
        type: String,
        required: [false,],
    },
    userPaymentDetails: {
        type: Object,
        required: [false],
    },
    freeTrail: {
        type: Boolean, default: true,
        required: [true],
    },
    havePlan: {
        type: Boolean,
        default: function () {
            return this.user_type === 'Staff'; // Default value depends on user_type
        }
    },
    status: {
        type: String, enum: ['Active', 'Inactive'],
        required: false,
    },
    guidance: {
        type: Boolean, default: false,
        required: [false],
    },
    enquiry_guidance: {
        type: Boolean, default: false,
        required: [false],
    },
    followup_guidance: {
        type: Boolean, default: false,
        required: [false],
    },
    staff_guidance: {
        type: Boolean, default: false,
        required: [false],
    },
    loginStatus: {
        type: Boolean,
        required: false,
        default: false
    },
},
    {
        timestamps: true,
    }
);
module.exports = mongoose.model("users", userSchema);