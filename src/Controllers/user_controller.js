const User = require("../Models/user");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require("dotenv").config();
const mailer = require("../middleware/email");


exports.register= (req, res) => {
  console.log(req.body)
   User.findOne({ email: req.body.email }, (err, user) => {
      if (user) {
        res.status(302).json({
           "msg":"already exist"
        });
      }
      else {
   
  req.body["activate"]= false;
      
        let newUser = new User(req.body);
        let password = bcrypt.hashSync(req.body.password, 10);
        newUser.password = password;
        newUser.save((err, user) => {
          if (err) {
            res.send(err);
          } else {

            const message = {
                from: process.env.EMAIL_USER, // Sender address
                to: newUser.email, // List of recipients
                subject: "Activer votre compte", // Subject line
                html: ` 
                <p>Bonjour<strong> ${newUser.fullName} </strong>!<br>
                Merci beaucoup d'avoir rejoint notre plateforme ! <br>
        afin pour valider  votre Email : <br>
         Activer votre compte en  utilisant ce lien <a class="btn btn-light" href= "${
                              process.env.SERVER_FRONTEND_ADDRESS ||
                              "http://localhost:4200"
                            }/Activer-Compte/${newUser._id}">Activer</a>  </p>  `,
               
              };
              mailer.send(message);

            res.json({
              "code": "200", "msg": " added successfully"
            })
          }
        })
      }
    })
  };
  exports.login = (req, res) => {
    var password = req.body.password;
    var email = req.body.email;
   User.findOne({ email: email }, function (err, user) {
      if (err) {
        console.log(err)
        res.sendStatus(400);
      }
      if (user) {
          
        if (!user.activate) {
            const message = {
                from: process.env.EMAIL_USER, // Sender address
                to: newUser.email, // List of recipients
                subject: "Activer votre compte", // Subject line
                html: ` 
                <p>Bonjour<strong> ${newUser.fullName} </strong>!<br>
                Merci beaucoup d'avoir rejoint notre plateforme ! <br>
        afin pour valider  votre Email : <br>
         Activer votre compte en  utilisant ce lien <a class="btn btn-light" href= "${
                              process.env.SERVER_FRONTEND_ADDRESS ||
                              "http://localhost:4200"
                            }/Activer-Compte/${newUser._id}">Activer</a>  </p>  `,
               
              };
              mailer.send(message);
            return res
              .status(401)
              .json({ error: "you must  confirm your !" });
          } else{
        if (bcrypt.compareSync(password, user.password)) {
       
        
          res.status(200).json({
     user,
            token: jwt.sign(
              {
                user: user,
             
              },
              "secretkey",
              { expiresIn: "24h" }
            ),
          });
       
        } else {
          res.status(204).json({ "msg": "password incorrect" });
        }
      } }
      else {
        res.status(404).json({ "msg": "user not found" });
      }
    });
  };
  exports.confirmAccount = (req, res, next) => {
    User.findById(req.params.id)
      .then((user) => {
        if (user.activate) res.status(404).json({ message: "already confirmed user" });
        else {
          user.activate= true;
          user
            .save()
            .then(() => res.status(200).json({ message: "confirmed user!" }))
            .catch((error) => res.status(500).json({ error }));
        }
      })
      .catch((error) => res.status(500).json({ error }));
  };
  