const { QueryValidator, BodyValidator } = require('./lib/validator')

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

                    const querySchema = JSON.parse(config.query);
                    const inputQuery = msg.req?.query || {}
                    const hasInvalidPropriety = QueryValidator(inputQuery, querySchema)

                    if (!!hasInvalidPropriety) {
                        node.send(reject(msg, { error: hasInvalidPropriety }))
                        return
                    }

                }

                if (config.reqbody) {

                    const bodySchema = JSON.parse(config.reqbody);
                    const inputBody = msg.req?.body || {}
                    const hasInvalidPropriety = BodyValidator(inputBody, bodySchema)

                    if (!!hasInvalidPropriety) {
                        node.send(reject(msg, { error: hasInvalidPropriety }))
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
                return
            }

        });

    }
    RED.nodes.registerType("request validator", RequestValidator, {
        settings: {
            sampleNodeColour: {
                value: "red",
                exportable: true
            }
        }
    });
}