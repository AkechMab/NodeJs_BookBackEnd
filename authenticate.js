//code for authentication

function authenticate(req, res, next){
    console.log('Authenticating...');
    next();
}

module.exports = authenticate; //export the function authenticate