require('dotenv').config();

function checkRole(req,res,next) {
    console.log('Role from token:', res.locals.role); // Debugging log
    console.log('Expected role:', process.env.USER);
    if(res.locals.role == process.env.USER){
        res.sendStatus(401)
    }
        else{
       next()
        }
}

module.exports= {checkRole: checkRole};