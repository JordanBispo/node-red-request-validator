
const { validator } = require('./lib/validator')

const isBadRequest = (schema = {}, input = {}) => {
    const schemaKeys = Object.keys(schema)
    if (schemaKeys.length < 1) return false
    for (let key of schemaKeys) {
        if (Object.keys(input)?.includes(key)) {
            if (typeof input[key] !== schema[key].type) {
                return `${key} must be a ${schema[key].type}`
            }
        } else if (!!schema[key].required) {
            return `${key} are required`
        }
    }
    return false
}

const next = (msg) => {
    if (msg['_payload']) msg['payload'] = msg['_payload']
    return ([msg, null])
}

const reject = (msg, payload, httpStatus = 400) => {
    msg['payload'] = payload
    msg['statusCode'] = httpStatus
    return [null, msg]
}

module.exports = function (RED) {
    function RequestValidator(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        node.on('input', function (msg) {

            try {

                if (msg['payload']) msg['_payload'] = msg['payload']

                if (config.method && config.method !== msg.req?.method) {
                    node.send(reject(msg, { error: `Request method must be a ${config.method}` }))
                    return
                }

                if (config.query) {

                    let querySchema = JSON.parse(config.query);
                    const validatorResult = Validator(querySchema, msg.req?.query || {})

                    if (!!validatorResult) {
                        node.send(reject(msg, { error: validatorResult + ' in query' }))
                        return
                    }

                }

                if (config.reqbody) {

                    let bodySchema = JSON.parse(config.reqbody);
                    const hasInvalidPropriety = validate(msg.req?.body || {}, bodySchema)

                    if (!!hasInvalidPropriety) {
                        node.send(reject(msg, { error: hasInvalidPropriety + ', in body' }))
                        return
                    }

                }

                node.send(next(msg))
                return

            } catch (error) {
                node.error("\nERROR on request-validation Node:");
                node.error(error)
                node.trace("\nError Trace")
                node.send(reject(msg, { error: error }, 500))
            }

        });

    }
    RED.nodes.registerType("request-validator", RequestValidator, {
        settings: {
            sampleNodeColour: {
                value: "red",
                exportable: true
            }
        }
    });
}