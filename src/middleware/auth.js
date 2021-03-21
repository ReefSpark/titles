const jwt = require('jsonwebtoken');
const config = require('config');
const controller = require('../core/controller');
let verifyOptions = {
    issuer: config.get('secrete.issuer'),
    subject: 'Authentication',
    audience: config.get('secrete.domain'),
    expiresIn: config.get('secrete.expiry')
};

module.exports = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        const dataUser = await jwt.verify(token, config.get('secrete.key'), verifyOptions);
        console.log("DataUser:",dataUser)
        let sql = await controller.conectionAndQuery();
        const checkToken = await sql.query`SELECT * FROM user_token WHERE mobile = ${dataUser.mobile} AND token=${token}`;
        console.log("Token:",checkToken)
        if (checkToken.recordset.length == 0 ) {
            console.log("Hello")
            throw new Error('Authentication failed. Your request could not be authenticated.');
        }
        const checkUser = await sql.query`SELECT * FROM user_info WHERE mobile = ${dataUser.mobile}`;
        if (checkUser.recordset.length == 0) {
            throw new Error('Authentication failed. Your request could not be authenticated."');
        }
        else {
            req.user = dataUser;
            next();
        }
    }
    catch (error) {
        return res.status(401).send(controller.errorMsgFormat(error.message));
    }
};
