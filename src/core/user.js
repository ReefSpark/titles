const controller = require('./controller')
const config = require('config');
const jwt = require('jsonwebtoken');
const users = () => {
    return {
        async login(req, res) {
            try {   
                let data = req.body;
                let sql = await controller.conectionAndQuery();
                const check = await sql.query`select * from user_info where mobile=${data.mobile}`;
                if (check.recordset.length == 0) {
                    return res.status(200).send(controller.errorMsgFormat("Please register this mobile number"));
                }
                //let passwordCompare = await bcrypt.compareSync(data.password, check.password);
                // if (!passwordCompare) {
                //     return res.status(400).send(controller.errorMsgFormat({
                //         "message": "Your password is incorrect"
                //     }, 'user', 400));
                // }
                if (check.recordset[0].UserPassword != data.password) {
                    return res.status(200).send(controller.errorMsgFormat("Your password is incorrect"));
                }
                delete check.recordset[0].UserPassword;
                let user = check.recordset[0];
                return res.status(200).send(controller.successFormat("Login successfully",
                    { 
                        user,
                        access_token: await this.createToken(check, res) 
                    }));
            }
            catch (err) {
                return res.status(400).send(controller.errorMsgFormat(err.message));
            }
        },

        async createToken(user, res) {
            try {
                let jwtOptions = Object.assign({}, {
                    issuer: config.get('secrete.issuer'),
                    subject: 'Authentication',
                    audience: config.get('secrete.domain'),
                    expiresIn: config.get('secrete.expiry')
                });
                let tokenAccess = Object.assign({}, {
                    user: user.recordset[0].UserId,
                    mobile: user.recordset[0].mobile
                });
                let tokens = await jwt.sign(tokenAccess, config.get('secrete.key'), jwtOptions);
                let sql = await controller.conectionAndQuery();
                await sql.query`DELETE FROM user_token WHERE mobile=${user.recordset[0].mobile};`;
                await sql.query`INSERT INTO user_token (mobile, token) VALUES (${user.recordset[0].mobile}, ${tokens})`
                return tokens;
            } catch (err) {
                return res.status(400).send(controller.errorMsgFormat(err.message));
            }

        },
        async logout(req, res) {

            try {
                let sql = await controller.conectionAndQuery();
                await sql.query`DELETE FROM user_token WHERE mobile=${req.user.mobile};`;
                return res.status(200).send(controller.successFormat("Logout successfully"));

            } catch (err) {
                return res.status(400).send(controller.errorMsgFormat(err.message));
            }

        }
    }
}

module.exports = users()