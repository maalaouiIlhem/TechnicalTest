const mongoose = require("mongoose");
const urlSchema = mongoose.Schema(
     {
    urlCode: {
            type: String,
    
        },
    longUrl: {
        type: String,
        required: true,
    },
    shortUrl: {
        type: String,

    },
    views: {
        type: Number,
        default: 0,
      },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
},
    { timestamps: true }

)


module.exports = mongoose.model("Url", urlSchema);