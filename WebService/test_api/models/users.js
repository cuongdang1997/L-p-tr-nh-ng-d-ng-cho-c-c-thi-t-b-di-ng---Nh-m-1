var mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
var Schema = mongoose.Schema;

// create a schema
var userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: String,
    admin: Boolean,
    created_at: Number,
    updated_at: Number
});

// the schema is useless so far
// we need to create a model using it
var User = mongoose.model('Users', userSchema);

// make this available to our users in our Node applications
module.exports = User;

//registerUser
User.AddUser = function (data, callback) {
    if (!data) return callback(-1);
    if (!data.uname || data.uname.length < 3) return callback(-2);
    if (!data.pass || data.pass.length < 6) return callback(-3);
    
    User.findOne({ email: data.email }, function (err, _doc) {
        if (err) 
			return callback(-101);
        
        if (_doc) {
            console.log(_doc.email + 'Email already exists!');
            return callback(-4);
        }
        var new_user = new User;
        new_user.username = data.uname;
		const salt = bcrypt.genSaltSync(10);
		const hash = bcrypt.hashSync(data.pass, salt);
        new_user.password = hash;
        new_user.email = data.email != null ? data.email : '';
        new_user.admin = 0;
        new_user.save(function (err) {
            if (err) {
				return callback(-101);
            } else {
                console.log('User saved successfully!'); 
                return callback(1);
            }       
        });        
    }); 
}

//Login
User.loginUser = function (email, password, callback) {
  User.findOne({ email: email })
    .exec(function (err, user) {
	  if (err) {
		return callback(err)
	  } else if (!user) {
		return callback(-1);
	  } else {
		if (bcrypt.compareSync(password, user.password)) {
		  console.log('Logged in successfully!');
		  return callback(user);
		} else {
		  return callback(-1);
		}
	  }
    });
}

//get profile
User.getProfile = function (email, callback) {
	User.findOne({ email: email })
    .exec(function (err, user) {
      if (err) {
        return callback(err)
      } else if (!user) {
        console.log('User not found!');
        return callback(-1);
      }
	  return callback(user);
    });
}

//change Password
User.changePassword = function (email, password, newPassword, callback) {
	User.findOne({ email: email })
    .exec(function (err, user) {
		if (err) {
			return callback(err)
		} else if (!user) {
			return callback(-1);
		}
		//change pass
		if (bcrypt.compareSync(password, user.password)) {
			const salt = bcrypt.genSaltSync(10);
			const hash = bcrypt.hashSync(newPassword, salt);
			user.password = hash;
			user.save(function (err) {
				if (err) {
					return callback(-101);
				} else {
					console.log('User updated successfully!');
					return callback(1);
				}     
			});
		} else {
			return callback(-1);
		}
    });
}