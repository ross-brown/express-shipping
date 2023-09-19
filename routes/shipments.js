"use strict";

const express = require("express");
const jsonschema = require("jsonschema");
const shipmentSchema = require("../schemas/shipmentSchema.json");
const { BadRequestError } = require("../expressError");
const router = new express.Router();

const { shipProduct } = require("../shipItApi");

/** POST /ship
 *
 * VShips an order coming from json body:
 *   { productId, name, addr, zip }
 *
 * Returns { shipped: shipId }
 */

router.post("/", async function (req, res, next) {
  const result = jsonschema.validate(
    req.body, shipmentSchema, { required: true });

  if (!result.valid) {
    const errs = result.errors.map(err => err.stack);
    throw new BadRequestError(errs);
  }
  
  const shipId = await shipProduct(req.body);
  return res.json({ shipped: shipId });
});


module.exports = router;
