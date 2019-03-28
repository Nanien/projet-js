const http = require('http');
const express = require('express');
const mysql = require('mysql');
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan')
const app = require("express")();
const expressHbs = require('express-handlebars');
const mongoose = require('mongoose');
const server = http.createServer(app);
const port = 8090

// declaration chemin de routes //
var routes = require("./routes/produit");
var inscription = require("./routes/inscription");
var cereals = require("./routes/cereals");
var legumes = require("./routes/legumes");
var gouter = require("./routes/gouter");
var menudumidi = require("./routes/menudumidi");
var menudusoir = require("./routes/menudusoir");
var fruitsetdeserts = require("./routes/fruitsetdeserts");


let inputI =
{
    "nom": "",
	"prenom":"",
	"email":"",
	"mdp":"",   
}
let errors = 
{
	"nom": "",
	"prenom":"",
	"email":"",
	"mdp":"",
};
  // connexion a la base de donée //

const db = mysql.createConnection({
	'host': 'localhost',
	'database': 'alimentation',
	'user': 'root',
	'password': ''
})

db.connect((err) =>{
	if (err)
		console.log(err)
})


app.set('view engine', 'hbs');

app.set('views', path.join(__dirname, 'views'));


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
/* appel des routes */
app.use('/', routes);
// app.use('/', inscription);
app.use('/', cereals);
app.use('/', legumes);
app.use('/', gouter);
app.use('/', menudumidi);
app.use('/', menudusoir);
app.use('/', fruitsetdeserts);


app.get('/produit', (req, res) => {
	
     res.render('produit', {errors, inputI})
})

app.get('/cereals', (req, res) =>
{
	 res.render('cereals', {errors, inputI})
})
app.get('/legumes', (req, res) =>
{
	 res.render('legumes', {errors, inputI})
})
app.get('/gouter', (req, res) =>
{
	 res.render('gouter', {errors, inputI})
})
app.get('/menudumidi', (req, res) =>
{
	 res.render('menudumidi', {errors, inputI})
})
app.get('/menudusoir', (req, res) =>
{
	 res.render('menudusoir', {errors, inputI})
})
app.get('/fruitsetdeserts', (req, res) =>
{
	 res.render('fruitsetdeserts', {errors, inputI})
})

app.get ('/', (req, res)=>{
	res.end("bienvevue sur notre page d'accueil")
})
app.get('/inscription', (req, res) => {
	errors.nom = ''
	errors.prenom = ''
	errors.email = ''
	errors.mdp = ''
     res.render('inscription', {errors, inputI})
})

.post('/inscription',(req, res)=>{
	let success = 
	{
		"nom": 1,
		"prenom": 1,
		"email": 1,
		"mdp": 1,
	}

	
	inputI.nom = req.body.nom
	inputI.prenom = req.body.prenom
	inputI.email = req.body.email
	inputI.mdp = req.body.pass0
	
	if (req.body.nom == "") 
	{
	   errors.nom = "veuillez remplir ce champ svp!!"
	   success.nom = 0	
	}
    
    if (req.body.prenom == "")
    {
    	errors.prenom = "veuillez remplir ce champ svp!!"
    	success.prenom = 0
    }
    
    if (req.body.email == "")
    {
    	errors.email = "veuillez remplir ce champ svp!!"
    	success.email = 0
    }
    
    if (req.body.pass0 != req.body.pass1)
    {
       errors.mdp = "mot de pase incorrect"
       success.mdp = 0
    }

    if(success.nom==success.prenom==success.email==success.mdp==1)
    {
    	let values = [req.body.nom, req.body.prenom, req.body.email, req.body.mdp]
    	let user = req.body.email
    	db.query('INSERT INTO user(nom, prenom, email, pass) VALUES(?, ?, ?, ?)', values,(err, result)=>
    	{
    		if(!err) 
    			res.redirect('/produit')
    		else
    			console.log(err.message)

    	})
    	
    }
    else
   		res.render('inscription',{errors,inputI})

})


app.get('/connexion', (req, res) => {
	errors.email = ''
	errors.mdp = ''
     res.render('connexion', {errors, inputI})
})

.post('/connexion',(req, res)=>{
	let success = 
	{
		"email": 1,
		"mdp": 1,
	}
	inputI.email = req.body.email
	inputI.mdp = req.body.pass0
    
    if (req.body.email == "")
    {
    	errors.email = "veuillez remplir ce champ svp!!"
    	success.email = 0
    }
    
    if (req.body.pass0 =="")
    {
       errors.mdp = "veuillez remplir ce champ svp!!"
       success.mdp = 0
    }
     if(success.email==success.mdp==1)
    {
    	let user = req.body.email
    	let pass = req.body.pass0
    	db.query('SELECT * FROM user WHERE email = ?', [user], (err, result)=>
    	{
    		if(result)
    		{
    			//let info = result
    			if (result.length > 0)
    			{
    				if(pass!= result.pass )
    				{
    				    errors.mdp = "mot de pase incorrect"
                        success.mdp = 0
    				}
    			} 
    			else
    			{
    				errors.mail ="email introuvable veuillez renseigner un mail valide"
    				success.mail = 0
    			}

    			if(success.email==success.mdp==1)
    			{
    				res.redirect('/produit')
    			}
    			else
    			{
    				res.render('connexion')
    			}	
        	} 
    		else
    			console.log(err.message)

		})

}
})





server.listen(port, (err) =>{
    if (!err)
    	console.log('connecter au server')
    else
    	console.log(err.message)
})

