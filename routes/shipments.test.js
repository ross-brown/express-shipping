"use strict";

const request = require("supertest");
const app = require("../app");


describe("POST /", function () {
  test("valid", async function () {
    const resp = await request(app).post("/shipments").send({
      productId: 1000,
      name: "Test Tester",
      addr: "100 Test St",
      zip: "12345-6789",
    });

    expect(resp.body).toEqual({ shipped: expect.any(Number) });
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
        discount: 100000
      });
    expect(resp.statusCode).toEqual(400);
  });
});
