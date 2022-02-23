module.exports = function (RED) {
    function RequestValidator(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        this.editor = RED.editor.createEditor({
            id: 'node-input-json-editor',
            mode: 'ace/mode/text',
            value: this.text
        });

        node.on('input', function (msg) {
            msg.payload = msg.payload.toLowerCase();
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