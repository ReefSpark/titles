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
        let sql = await controller.conectionAndQuery();
        const checkToken = await sql.query`SELECT * FROM user_token WHERE UserId = ${dataUser.user} AND token=${token}`;
        if (checkToken.recordset.length == 0 ) {
            throw new Error('Authentication failed. Your request could not be authenticated.');
        }
        const checkUser = await sql.query`SELECT * FROM STG_LEDGERDETAILS WHERE AlterId = ${dataUser.user}`;
        if (checkUser.recordset.length == 0) {
            throw new Error('Authentication failed. Your request could not be authenticated."');
        }
        else {
            req.user ={
                user:dataUser.user,
                ledger:dataUser.ledger
            };
            next();
        }
    }
    catch (error) {
        return res.status(401).send(controller.errorMsgFormat(error.message));
    }
};
