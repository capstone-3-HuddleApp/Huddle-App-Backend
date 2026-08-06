const express = require("express");
const router = express.Router();

//upon getting hit this endpoint fetches data from the facilities database
router.post("/", async (req, res, next) => {
  try {
    const { optype, facgroup, facsubgrp } = req.body;

    //converts comma separated values or arrays into arrays
    function toList(param) {
      if (!param) return [];
      return Array.isArray(param)
        ? param
        : param.split(",").map((v) => v.trim());
    }

    //Builds the Where clause from the request body
    function inClause(field, values) {
      const quoted = values.map((v) => `'${v}'`).join(", ");
      return `${field} IN (${quoted})`;
    }

    const optypeList = toList(optype);
    const facgroupList = toList(facgroup);
    const facsubgrpList = toList(facsubgrp);

    const conditions = [];
    // if (boro) conditions.push(eq("boro", boro));
    if (optypeList.length) conditions.push(inClause("optype", optypeList));

    if (facgroupList.length)
      conditions.push(inClause("facgroup", facgroupList));
    if (facsubgrpList.length)
      conditions.push(inClause("facsubgrp", facsubgrpList));

    //Check if conditions, then add string
    const SELECT_FIELDS =
      "uid, facname, address, city, boro, zipcode, latitude, longitude, xcoord, ycoord, facgroup, facsubgrp, factype, capacity, optype, opname, overagency, facdomain, geometry";
    const whereClause = conditions.length
      ? ` WHERE ${conditions.join(" AND ")}`
      : "";
    const query = `SELECT ${SELECT_FIELDS}${whereClause}`;
    console.log(query);
    const response = await fetch(
      "https://data.cityofnewyork.us/api/v3/views/ji82-xba5/query.json",
      {
        //SodaApi prefers a post request for fetching data
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-App-Token": process.env.NYC_OPEN_DATA_APP_TOKEN,
        },
        body: JSON.stringify({
          query, //our defined query with filter
          page: {
            pageNumber: 1,
            pageSize: 500,
          },
          includeSynthetic: false,
        }),
      },
    );

    if (!response.ok) {
      const text = await response.text();
      throw Object.assign(new Error(`Facilities API error: ${text}`), {
        status: response.status,
      });
    }

    const data = await response.json();
    res.json({ count: data.length, records: data });
  } catch (err) {
    next(err); // hands off tto existing error handler in app.js
  }
});

module.exports = router;
