const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const userSchema = mongoose.Schema(
     {
    fullName: {
        type: String,

    },
    email: {
        type: String,
        unique: true 
    },
    password: { type: String, required: true },

    phone: {
        type: Number
    },
 

    address: {
        type: String,

    },
 
   
   activate : {
        type: Boolean , default: "false"
    },
   
},
    { timestamps: true }

)

userSchema.plugin(uniqueValidator);
module.exports = mongoose.model("User", userSchema);