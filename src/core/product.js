const controller = require('./controller')


const productDetail = () => {
    return {
        async searchProduct(req, res) {
            try {
                //WHERE ledger REGEXP ${req.params.item}   
                let data = req.params.item;
                if (data.length < 3) {
                    return res.status(200).send(controller.successFormat("Data Successfully", {
                        result: []
                    }));
                }
                let sql = await controller.conectionAndQuery()
                let check = await sql.query`SELECT * FROM stg_item_details WHERE Name LIKE ${data}+'%'`;
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
        },
        async getProduct(req, res) {
            try {
                let query = req.query;
                if (query.from == null || undefined && query.to == null || undefined) {
                    return res.status(400).json(controller.errorMsgFormat("From and To must be defined"));
                }
                let sql = await controller.conectionAndQuery()
                let check = await sql.query`select * from stg_item_details`;
                if (check.recordset.length == 0) {
                    return res.status(200).send(controller.successFormat("Data Successfully", {
                        result: []
                    }));
                }
                let result = [];
                let i = query.from;
                while (i < query.to) {
                    result.push(check.recordset[i]);
                    i++;
                }
                return res.status(200).send(controller.successFormat("Data Successfully", {
                    result: result
                }));
            }
            catch (err) {
                return res.status(400).send(controller.errorMsgFormat(err.message));
            }
        },
        async productHistory(req, res) {
            try {
                let query = `SELECT * FROM product`;
                let check = controller.conectionAndQuery(query)
                if (!check.status) {
                    return res.status(400).send(controller.errorMsgFormat({
                        "message": check.error
                    }, 'product-details', 400));
                }
                if (check.status && check.result.length == 0) {
                    return res.status(200).send(controller.successFormat({
                        result: []
                    }, 'product-details', 200));
                }
                return res.status(200).send(controller.successFormat({
                    result: check.result
                }, 'product-details', 200));
            }
            catch (err) {
                return res.status(400).send(controller.errorMsgFormat(err.message));
            }
        }
    }
}
module.exports = productDetail()