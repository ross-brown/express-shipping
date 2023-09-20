"use strict";

const SHIPIT_SHIP_URL = "http://localhost:3001/ship";
const SHIPIT_API_KEY = "SUPER-DUPER-SECRET";

/** Ship a single product through the shipit API.
 *
 * Returns shipId from shipit.
 */

async function shipProduct({ productId, name, addr, zip }) {
  console.warn("Called our real shipProduct function");

  const response = await fetch(SHIPIT_SHIP_URL, {
    method: "POST",
    body: JSON.stringify({
      itemId: productId,
      name,
      addr,
      zip,
      key: SHIPIT_API_KEY,
    }),
    headers: {
      "content-type": "application/json"
    }
  });

  const shipData = await response.json();

  return shipData.receipt.shipId;
}


/** Ship multiple products through the shipit API.
 *
 * Returns an array of shipIds from shipit.
 */

async function shipProducts({ productIds, name, addr, zip }) {
  const shipPromises = productIds.map(productId =>
    shipProduct({ productId, name, addr, zip }));

  return await Promise.all(shipPromises);
}

module.exports = { shipProduct, shipProducts };
