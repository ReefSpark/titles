require('dotenv').config()
const sql = require('mssql')
const controller = () => {
    return {
        errorMsgFormat(message) {
            return Object.assign({
                "status":false,
                "message": message
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
            return this.errorMsgFormat(errors);
        },

        successFormat(message,res) {
            return Object.assign({
                "status":true,
                "message": message,
                "data":res
            });
        },

        async conectionAndQuery() {
            const config = {
                user: process.env.USER,
                password: process.env.PASSWORD,
                server: process.env.SERVER, // You can use 'localhost\\instance' to connect to named instance
                database: process.env.DATABASE,
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