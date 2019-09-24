//code for record events goes here

function log(req, res, next){
    console.log("Logging....");
    next();
}

module.exports = log; //export the funtion log