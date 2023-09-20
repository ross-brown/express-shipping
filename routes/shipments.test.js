"use strict";

const shipItApi = require("../shipItApi");
shipItApi.shipProduct = jest.fn();

const request = require("supertest");
const app = require("../app");


describe("POST /", function () {
  test("valid", async function () {
    shipItApi.shipProduct.mockReturnValue(1234);

    const resp = await request(app).post("/shipments").send({
      productId: 1000,
      name: "Test Tester",
      addr: "100 Test St",
      zip: "12345-6789",
    });

    expect(resp.body).toEqual({ shipped: 1234 });
  });

  test("throws error if empty request body", async function () {
    const resp = await request(app)
      .post("/shipments")
      .send();
    expect(resp.statusCode).toEqual(400);
  });

  test("throws error if invalid input is sent", async function () {
    const resp = await request(app)
      .post("/shipments")
      .send({
        productId: "1004",
        name: 1234,
        addr: false,
        discount: 100000,
        zip: "NOT VALID"
      });
    expect(resp.statusCode).toEqual(400);
    expect(resp.body).toEqual({
      "error": {
        "message": [
          "instance.productId is not of a type(s) number",
          "instance.name is not of a type(s) string",
          "instance.addr is not of a type(s) string",
          "instance.zip does not match pattern \"^\\\\d{5}(?:[-\\\\s]\\\\d{4})?$\"",
          "instance is not allowed to have the additional property \"discount\""
        ],
        "status": 400
      }
    });
  });
});



describe("POST /multi", function () {
  test("valid", async function () {
    shipItApi.shipProduct.mockReturnValue(1234);

    const resp = await request(app).post("/shipments/multi").send({
      productIds: [1000, 1002, 1003, 1004],
      name: "Test Tester",
      addr: "1234 Davis Lane",
      zip: "12345"
    });

    expect(resp.statusCode).toEqual(200);
    expect(resp.body).toEqual({ shipped: [1234, 1234, 1234, 1234] });
  });

  test("throws error if empty request body", async function () {
    const resp = await request(app)
      .post("/shipments/multi")
      .send();
    expect(resp.statusCode).toEqual(400);
  });

  test("throws error if invalid input is sent", async function () {
    const resp = await request(app)
      .post("/shipments/multi")
      .send({
        productIds: ['1234', '1234', 'WRONG'],
        name: 1234,
        addr: false,
        discount: 100000,
        zip: "NOT VALID"
      });
    expect(resp.statusCode).toEqual(400);
    expect(resp.body).toEqual({
      "error": {
        "message": [
          "instance.productIds[0] is not of a type(s) number",
          "instance.productIds[1] is not of a type(s) number",
          "instance.productIds[2] is not of a type(s) number",
          "instance.name is not of a type(s) string",
          "instance.addr is not of a type(s) string",
          "instance.zip does not match pattern \"^\\\\d{5}(?:[-\\\\s]\\\\d{4})?$\"",
          "instance is not allowed to have the additional property \"discount\""
        ],
        "status": 400
      }
    });
  });
});
