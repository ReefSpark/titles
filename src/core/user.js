const controller = require('./controller')
const config = require('config');
const jwt = require('jsonwebtoken');
const users = () => {
    return {
        async login(req, res) {
            try {
                let data = req.body;
                let sql = await controller.conectionAndQuery();
                const check = await sql.query`select * from STG_LEDGERDETAILS where AlterId=${data.userId}`;
                console.log('Check:',check)
                if (check.recordset.length == 0) {
                    return res.status(200).send(controller.errorMsgFormat("Please register this User ID"));
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
                    user: user.recordset[0].AlterId,
                    ledger:user.recordset[0].LEDGER
                });
                let tokens = await jwt.sign(tokenAccess, config.get('secrete.key'), jwtOptions);
                let sql = await controller.conectionAndQuery();
                await sql.query`DELETE FROM user_token WHERE UserId=${user.recordset[0].AlterId}`;
                await sql.query`INSERT INTO user_token (UserId, token, is_active) VALUES (${user.recordset[0].AlterId}, ${tokens},${1})`
                return tokens;
            } catch (err) {
                return res.status(400).send(controller.errorMsgFormat(err.message));
            }

        },

        async forgetPassword(req, res) {

            try {
                let data = req.body;
                let sql = await controller.conectionAndQuery();
                const check = await sql.query`select * from STG_LEDGERDETAILS where AlterId=${data.userId}`;
                if (check.recordset.length == 0) {
                    return res.status(200).send(controller.errorMsgFormat("Please register this User ID"));
                }
                //SMS INTEGERATION
                return res.status(200).send(controller.successFormat("Successfully",
                    {
                        password: check.recordset[0].UserPassword
                    }));

            } catch (err) {
                return res.status(400).send(controller.errorMsgFormat(err.message));
            }

        },

        async logout(req, res) {

            try {
                let sql = await controller.conectionAndQuery();
                await sql.query`DELETE FROM user_token  WHERE UserId=${req.user.user};`;
                return res.status(200).send(controller.successFormat("Logout successfully"));

            } catch (err) {
                return res.status(400).send(controller.errorMsgFormat(err.message));
            }

        },

        async getLedgerHistory(req, res) {
            try {
                let sql = await controller.conectionAndQuery()
                let check = await sql.query`select * from stg_bill_details where Ledger=${req.user.ledger}`;
                if (check.recordset.length == 0) {
                    return res.status(200).send(controller.successFormat("Data Successfully", {
                        result: []
                    }));
                }
                return res.status(200).send(controller.successFormat("Data Successfully", {
                    result: check.recordset
                }));
            }
            catch (err) {
                return res.status(400).send(controller.errorMsgFormat(err.message));
            }
        }
    }
}

module.exports = users()