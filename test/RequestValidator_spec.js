var helper = require("node-red-node-test-helper");
var requestValidator = require("../RequestValidator.js");

helper.init(require.resolve('node-red'));

describe('RequestValidator Node', function () {

  beforeEach(function (done) {
      helper.startServer(done);
  });

  afterEach(function (done) {
      helper.unload();
      helper.stopServer(done);
  });

  it('should be loaded', function (done) {
    var flow = [{ id: "n1", type: "RequestValidator", name: "reqVal" }];
    helper.load(requestValidator, flow, function () {
      var n1 = helper.getNode("n1");
      try {
        n1.should.have.property('name', 'reqVal');
        done();
      } catch(err) {
        done(err);
      }
    });
  });

  it('should accept empty body on empty schema', function (done) {
    var flow = [
      { id: "n1", type: "RequestValidator", name: "lower-case",wires:[["n2"],["n2"]]},
      { id: "n2", type: "helper" }
    ];
    helper.load(requestValidator, flow, function () {
      var n2 = helper.getNode("n2");
      var n1 = helper.getNode("n1");
      n2.on("input", function (msg) {
        try {
          msg.should.have.property('payload', {});
          done();
        } catch(err) {
          done(err);
        }
      });
      n1.receive({ payload: {} });
    });
  });
  it('should reject if property is missing', function (done) {
    var flow = [
      { id: "n1", type: "RequestValidator", name: "lower-case",wires:[["n2"],["n2"]],reqbody: "{\"id\":{\"type\":\"any\",\"required\":\"true\"}}"},
      { id: "n2", type: "helper" }
    ];
    helper.load(requestValidator, flow, function () {
      var n2 = helper.getNode("n2");
      var n1 = helper.getNode("n1");
      n2.on("input", function (msg) {
        try {
          msg.should.have.property('statusCode', 400);
          msg.should.have.property('payload');
          msg.payload.should.have.property('error');
          done();
        } catch(err) {
          done(err);
        }
      });
      n1.receive({ req : {body: {} }, payload: {} });
    });
  });
  it('should accept number on number schema', function (done) {
    var flow = [
      { id: "n1", type: "RequestValidator", name: "lower-case",wires:[["n2"],["n2"]],reqbody: "{\"id\":{\"type\":\"number\",\"required\":\"true\"}}"},
      { id: "n2", type: "helper" }
    ];
    helper.load(requestValidator, flow, function () {
      var n2 = helper.getNode("n2");
      var n1 = helper.getNode("n1");
      n2.on("input", function (msg) {
        try {
          msg.should.have.property('payload', {"id": "5"});
          done();
        } catch(err) {
          done(err);
        }
      });
      n1.receive({ req : {body: {"id": "5"} }, payload: {"id":"5"} });
    });
  });
  it('should not accept non number on number schema', function (done) {
    var flow = [
      { id: "n1", type: "RequestValidator", name: "lower-case",wires:[["n2"],["n2"]],reqbody: "{\"id\":{\"type\":\"number\",\"required\":\"true\"}}"},
      { id: "n2", type: "helper" }
    ];
    helper.load(requestValidator, flow, function () {
      var n2 = helper.getNode("n2");
      var n1 = helper.getNode("n1");
      n2.on("input", function (msg) {
        try {
          msg.should.have.property('statusCode', 400);
          msg.should.have.property('payload');
          msg.payload.should.have.property('error');
          done();
        } catch(err) {
          done(err);
        }
      });
      n1.receive({ req : {body: {"id": "a"} }, payload: {"id":"a"} });
    });
  });
});