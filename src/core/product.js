const controller = require('./controller')


const productDetail = () => {
    return {
        async searchProduct(req, res) {
            try {
                //WHERE ledger REGEXP ${req.params.item}   
                let data = req.params.item;
                if (data.length < 3) {
                    return res.status(200).send(controller.successFormat({
                        result: []
                    }, 'product-details', 200));
                }
                let sql = await controller.conectionAndQuery()
                let check = await sql.query`SELECT * FROM stg_item_details WHERE Name LIKE ${data}+'%'`;
                console.log("Check:", check)
                if (check.recordset.length == 0) {
                    return res.status(200).send(controller.successFormat({
                        result: []
                    }, 'product-details', 200));
                }
                return res.status(200).send(controller.successFormat({
                    result: check.recordset
                }, 'product-details', 200));
            }
            catch (err) {
                return res.status(400).send(controller.errorMsgFormat({
                    "message": err.message
                }, 'product-details', 400));
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
                return res.status(400).send(controller.errorMsgFormat({
                    "message": err
                }, 'product-details', 400));
            }
        }
    }
}
module.exports = productDetail()