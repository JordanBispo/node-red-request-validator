module.exports = function (RED) {
    function RequestValidator(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        node.on('input', function (msg) {
            msg['valid'] = config;
            if (config.query) {
                let query = JSON.parse(config.query);
                let queryKeys = Object.keys(query);
                let inputQuery = msg.req.query;
                let inputQueryKeys = Object.keys(inputQuery);

            }
            node.send(msg);
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