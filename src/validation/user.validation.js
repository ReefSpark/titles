const Joi = require('joi');
class validation {

    async login(req) {
        let schema = Joi.object().keys({
            mobile: Joi.string().min(10).max(10).required(),
            password:Joi.string().required()
        });

        return schema.validate(req, { abortEarly: false });
    }

    async forgetPassword(req) {
        let schema = Joi.object().keys({
            mobile: Joi.string().min(10).max(10).required()
        });

        return schema.validate(req, { abortEarly: false });
    }

}

module.exports = new validation;