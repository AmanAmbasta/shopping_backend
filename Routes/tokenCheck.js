const jwt = require('jsonwebtoken');

module.exports = function (req,res,next){
    const token = req.header('auth-token');
    if(!token) return res.status(401).send('ACCESS DENIED');

    try {
        const verify = jwt.verify(token,process.env.TOKEN_KEY);
        req.user = verify;
        next();
    } catch (error) {
        res.status(400).send('INVALID TOKEN');
    }
}