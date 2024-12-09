const userModel = require('../models/user.model');

module.exports.createUser = async ({ //anonymous function
    firstname,lastname,email,password
}) => {
    if(!firstname || ! email || !password) {
        throw new Error('all Fields are required to be sent');
    }
    const user = userModel.create({ //here we are populating the DB model
        fullname: {
            firstname, //we can also do double declaration, as the key and value are same
            lastname
        },
        email,
        password
    })

    return user
}