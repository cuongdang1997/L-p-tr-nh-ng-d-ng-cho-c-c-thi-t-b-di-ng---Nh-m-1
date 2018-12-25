//Api for User - author: Cuong
var users = require('../models/users');
const jwt = require('jsonwebtoken');
const auth = require('basic-auth');
const config = require('../config/config.json');

/**
*Router
**/
var appRouter = function (app) {

  app.get("/", function (req, res) {
    res.status(200).send("Welcome to RESTFUL API - NODEJS - TINK39");
  });

	/**
	*Login
	**/
    app.post("/authenticate", function (req, res) {
		const credentials = auth(req);
		console.log('Tai khoan: ' + credentials.name);
        console.log('Mat khau: ' + credentials.pass);
		if (!credentials) {
			res.status(400).json({ message: 'Invalid Request !' });
		} else {
			users.loginUser(credentials.name, credentials.pass, function (ret) {
				console.log(ret.email);
				if(ret === -1){
					res.status(401).json({ message: 'Incorrect email or password!' });
				} else {
					const token = jwt.sign({status: 200, message:ret.email}, config.secret, { expiresIn: 1440 });
				    res.status(200).json({ message: ret.email, token: token });
				}
			});
		}		
    });

	/**
	*Register
	**/
    app.post("/register", function (req, res) {
		console.log("register");
        var data = {
            uname: req.body.username,
            pass: req.body.password,
            email: req.body.email
        }
		if (!data.uname || !data.email || !data.pass || !data.uname.trim() || !data.email.trim() || !data.pass.trim()) {
			res.status(400).json({message: 'Invalid Request !'});
		} else {
			users.AddUser(data, function (ret) {
				console.log('AddUser() => ' + ret);
				if (ret === 1){
					const token = jwt.sign({status: 200, message:data.email}, config.secret, { expiresIn: 1440 });
				    res.status(201).json({ message: data.email , token: token });
				} else if(ret === -4){
					res.status(409).json({ message: 'User Already Registered !' });
				}else {
					res.status(500).json({ message: 'Internal Server Error !' });
				}
			});
		}
    });

	/**
	*get profile
	**/
    app.get("/getProfile/:email", function (req, res) {
		if (checkToken(req)) {
			users.getProfile(req.params.email, function (ret){
				if(ret === -1){
					res.status(404).json({ message: 'User not found!' });
				} else {
					console.log(ret.toString());
				    res.status(200).json(ret);
				}
			});
		} else {
			res.status(401).json({ message: 'Invalid Token !' });
		}
    });
	
	/**
	*change password
	**/
	app.put("/changePassword/:email", function(req, res) {
		if (checkToken(req)) {
			const oldPassword = req.body.password;
			const newPassword = req.body.newPassword;
			if (!oldPassword || !newPassword || !oldPassword.trim() || !newPassword.trim()) {
				res.status(400).json({ message: 'Invalid Request !' });
			} else {
				users.changePassword(req.params.email, oldPassword, newPassword, function(ret){
					if(ret === 1) {
						res.status(200).json({ message: 'Password Updated Sucessfully !' });
					} else if(ret === -1){
						res.status(401).json({ message: 'Invalid Old Password !' });
					}
				});
			}
		} else {
			res.status(401).json({ message: 'Invalid Token !' });
		}
	});
	
	/**
	*Check Token
	**/
	function checkToken(req) {
		const token = req.headers['x-access-token'];
		if (token) {
			try {
  				var decoded = jwt.verify(token, config.secret);
  				return decoded.message === req.params.email;
			} catch(err) {
				return false;
			}
		} else {
			return false;
		}
	}
}

module.exports = appRouter;