const Url = require("../Models/url");
const User = require("../Models/user");
const validUrl = require('valid-url')
const shortid = require('shortid')
require("dotenv").config();





exports.shorten = (req, res) => {
    console.log(req.body)
    const baseUrl = 'http:localhost:8080'
    const longUrl =req.body.longUrl ;
    let id =req.body.owner.id;
  const ObjectId = require('mongodb').ObjectID;

   if(!validUrl.isUri(baseUrl)){
    return res.status(401).json("Internal error. Please come back later.");
    }

    User.findById({ '_id': ObjectId(id)  }).then((us) => {
  if (!us) {
    return res.status(404).send({
      message: "User not found with id " + id,
    });
  } 
  else {
    
   const owner = us;
    const urlCode = shortid.generate();
    console.log(urlCode)
    if(validUrl.isUri(longUrl)){
    Url.findOne({ longUrl : longUrl })
    .then((url) => {
      if (url) { 
        console.log ('found')
        return  res.status(200).json(url);
    
       
      } else {
    
        const shortUrl = baseUrl + "/" + urlCode;
        newurl  = new Url({
            urlCode,
            longUrl,
            shortUrl,
            clicks: 0,
            owner
        });
        
        newurl.save()
        return res.status(201).json(newurl);
      }
    
    })  .catch((error) => res.status(500).json("Internal Server error "+ error )); }
    else{
        res.status(400).json("Invalid URL. Please enter a vlaid url for shortening.");
    } 
  }
   
  }) 


  };


  exports.getUrl = (req, res) => { 
    Url.findOne({ urlCode : req.params.code})
    .then((url) => {
      if (url) { 
        url.views++;
        console.log("opening statistics of each link  " + url.views)
        url.save();
            // when valid we perform a redirect
        return res.redirect(url.longUrl) 
       

       
      } else {
    
        return res.status(404).json('No URL Found')

      }
    
    })  .catch((error) => res.status(500).json("Internal Server error "+ error ));
  };

 exports.getAllStatistics = (req, res) => {
    Url.find({'owner': req.params.id}, (err, urls) => {
      if (err) {
        res.send(err);
      }
      else { var total = 0 
        urls.forEach(url => {
        total = total+url.views
});
console.log(total);
return res.status(200).json("opening statistics of all links  " + total)

}
   
    })
  };