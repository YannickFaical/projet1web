const express=require("express");
const bodyParser =require ("body-parser");
const request =require("request");
const https =require("https");
const mongoose = require("mongoose");


const app= express();
//pour que le serveur puisse prendre en compte les fichier statique comme le css et bootstrapp on le smet dans un fichier appele public
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));

mongoose.connect("mongodb://localhost:27017/user2DB",{useNewUrlParser:true});

const userSchema ={
  email: String,
  password:String
};

const User =new mongoose.model("User",userSchema);


app.get("/login.html",function(req,res){
    res.sendFile(__dirname+"/login.html");
})
app.get("/inscription.html",function(req,res){
    res.sendFile(__dirname+"/inscription.html");
})

app.get("/",function(req,res){
    res.sendFile(__dirname+"/site.html");
})
app.get("/commandeShortNike.html",function(req,res){
    res.sendFile(__dirname+"/commandeShortNike.html");
})
app.get("/checkout.html",function(req,res){
    res.sendFile(__dirname+"/checkout.html");
})
app.get("/Apropos.html",function(req,res){
    res.sendFile(__dirname+"/Apropos.html");
})


///
app.get("/contact.html",function(req,res){
    res.sendFile(__dirname+"/contact.html");
})
app.post('/envoyer-message', function(req, res){
  const nom = req.body.nom;
  const email = req.body.email;
  const message = req.body.message;

  // Envoi du message par email, sauvegarde en base de données, etc.

  res.send('Merci de nous avoir contactés !'); // Affiche un message de confirmation
});

////


app.post("/checkout.html",function(req,res){
    const firstName = req.body.fName;
    const lastName =req.body.lName;
    const username= req.body.usr;
    const email =req.body.email;
    const address= req.body.address;
    const country =req.body.country;
    const state =req.body.state;
    const nameOnCard =req.body.nameOnCard;
    const creditCardNumber =req.body.creditCardNumber;
    const paymentMethod =req.body.paymentMethod;



    //afficher dans le terminal
   // console.log(firstName,lastName,email);


   const data ={
    members: [
       {
        email_address: email ,
        status: "subscribed" ,
        merge_fields:{
            FNAME: firstName,
            LNAME: lastName,
            USR:username,
            ADDRESS:address,
            COUNTRY:country,
            STATE:state,
            NAMEONCARD:nameOnCard,
            CREDITCARDNUMBER:creditCardNumber,
            PAYMENTMETHOD:paymentMethod
        }
       }
    ]
   } ;

   const jsonData =JSON.stringify(data);

   const url="https://us21.api.mailchimp.com/3.0/lists/086832be20";
   const options ={
    method: "POST",
    auth: "yannick:2bae0ce0d99eba11fd0a9a7362290e82-us21"
   }
   const request =https.request(url,options,function(response){
    if(response.statusCode===200){
        res.sendFile(__dirname+"/success.html");
    }else{
        //console.log(response.statusCode);
       res.sendFile(__dirname+"/failure.html");
    }



    response.on("data'",function(data){
        console.log(JSON.parse(data));
    })

   })
   request.write(jsonData);
   request.end();

});

app.post("/failure",function(req,res){
    res.redirect("/");
})




/*app.post("/inscription",function(req,res){
    res.redirect("/")
})*/




app.post("/inscription",function(req,res){
  const newUser = new User({
    email:req.body.username,
    password:req.body.password
  });
  //nouvelle methode
  newUser.save().then(()=>{
       res.sendFile(__dirname+"/successInscription.html");
   }).catch((err)=>{
       console.log(err);
   });


});

////
app.post("/login",function(req,res){
const username= req.body.username;
const password =req.body.password;

//nouvelle metthode
    User.findOne({email:username})
    .then((foundUser) => {
        if(foundUser){
            if(foundUser.password === password){
                res.sendFile(__dirname+"/ProfileUtilisateurConnecte.html");
            }
        }
   })
   .catch((error) => {
       //When there are errors We handle them here

console.log(err);
       res.send(400, "Bad Request");

   });
});


///////////////////////////////////////////////////////////////////


  app.get("/ProfileUtilisateurConnecte.html", function(req, res){
    // Vérifier si l'utilisateur est connecté
    if (!req.session.user) {
      // Rediriger l'utilisateur vers la page de connexion
      res.sendFile("/login.html");
      return;
    }

    // Récupérer les informations du profil utilisateur à partir de la base de données
    const userId = req.session.user.id;
    const collection = db.collection('users');
    collection.findOne({ _id: ObjectId(userId) }, (err, email) => {
      if (err) {
        console.log(err);
        res.sendFile("error", { message: 'Une erreur est survenue.' });
        return;
      }

      // Récupérer l'historique des commandes de l'utilisateur à partir de la base de données
      const ordersCollection = db.collection('orders');
      ordersCollection.find({ userId: ObjectId(userId) }).toArray((err, orders) => {
        if (err) {
          console.log(err);
          res.sendFile("error", { message: 'Une erreur est survenue.' });
          return;
        }

        // Afficher les informations du profil utilisateur sur la page
        res.sendFile("/ProfileUtilisateurConnecte.html", { email, orders });
      });
    });
  });

//////////////////////////////


app.listen(process.env.PORT || 3000,function(){
    console.log("your server running on port 3000");
});


// API key
// 3c710c3cd387a62347e52305262a341c-us21
// bb2ede86a5c383cc66f525ee963176bc-us21
// 2bae0ce0d99eba11fd0a9a7362290e82-us21

//liste id
// 086832be20





// 1a298088f6265ca133431b946b0e575a-us21
