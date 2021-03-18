
const sql = require('mssql')
const controller = () => {
    return {
        errorMsgFormat(error, type = 'service', code = 400) {
            return Object.assign({
                "code": code,
                "errors": true,
                "data": {
                    error
                }
            });
        },

        errorFormat(error) {
            let errors = {};
            if (error.details) {
                error.details.forEach((detail) => {
                    errors[detail.path] = detail.message;

                });
            } else {
                errors = error;
            }
            return this.errorMsgFormat({ message: errors }, 'service', 400);
        },

        successFormat(res, id = null, type = 'service', code = 200) {
            return Object.assign({
                "code": code,
                "errors": false,
                "data": {
                    res
                }
            });
        },

        async conectionAndQuery() {
            const config = {
                user: 'admin',
                password: 'Deva1234',
                server: 'tally.cmkrmmjaj82j.us-east-2.rds.amazonaws.com', // You can use 'localhost\\instance' to connect to named instance
                database: 'Tally',
            }
            // make sure that any items are correctly URL encoded in the connection string
            return await sql.connect(config)
            // console.log('Query:', query)
            // const result = await sql.query`${query}`;
            // console.log("Result:",result);
            // return result;
        }

    }
};

module.exports = controller()