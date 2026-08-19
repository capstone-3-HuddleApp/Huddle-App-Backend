async function searchFacilities({ optype, facgroup, facsubgrp, search }) {
  //escape characters
  function escapeSoql(value) {
    return value.replace(/'/g, "''");
  }

  //converts comma separated values or arrays into arrays
  function toList(param) {
    if (!param) return [];
    return Array.isArray(param)
      ? param
      : param.split(",").map((v) => v.trim());
  }

  //Builds the Where clause from the request body
  function inClause(field, values) {
    const quoted = values.map((v) => `'${escapeSoql(v)}'`).join(", ");
    return `${field} IN (${quoted})`;
  }

  // Builds a free-text search clause matching either the facility name or
  // the address, case-insensitive, partial match on both sides (%term%).
  function searchClause(term) {
    const safeTerm = escapeSoql(term.trim());
    return `(UPPER(facname) LIKE UPPER('%${safeTerm}%') OR UPPER(address) LIKE UPPER('%${safeTerm}%') OR UPPER(city) LIKE UPPER('%${safeTerm}%'))`;
  }

  const optypeList = toList(optype);
  const facgroupList = toList(facgroup);
  const facsubgrpList = toList(facsubgrp);

  const conditions = [];
  if (optypeList.length) conditions.push(inClause("optype", optypeList));
  if (facgroupList.length)
    conditions.push(inClause("facgroup", facgroupList));
  if (facsubgrpList.length)
    conditions.push(inClause("facsubgrp", facsubgrpList));

  if (search && search.trim().length >= 4) {
    conditions.push(searchClause(search));
  }

  const SELECT_FIELDS =
    "uid, facname, address, city, boro, zipcode, latitude, longitude, xcoord, ycoord, facgroup, facsubgrp, factype, capacity, optype, opname, overagency, facdomain, geometry";
  const whereClause = conditions.length
    ? ` WHERE ${conditions.join(" AND ")}`
    : "";
  const query = `SELECT ${SELECT_FIELDS}${whereClause}`;
  console.log(query);

  const pageSize = search ? 10 : 2000;
  const response = await fetch(
    "https://data.cityofnewyork.us/api/v3/views/ji82-xba5/query.json",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-App-Token": process.env.NYC_OPEN_DATA_APP_TOKEN,
      },
      body: JSON.stringify({
        query,
        page: {
          pageNumber: 1,
          pageSize: pageSize,
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
  return { count: data.length, records: data };
}
async function getFacilityById(facilityId) {
  if (!facilityId) {
    throw new Error("Facility ID is required");
  }

  const SELECT_FIELDS =
    "uid, facname, address, city, boro, zipcode, latitude, longitude, xcoord, ycoord, facgroup, facsubgrp, factype, capacity, optype, opname, overagency, facdomain, geometry";
  
  const query = `SELECT ${SELECT_FIELDS} WHERE uid = '${facilityId}'`;
  console.log(query);

  const response = await fetch(
    "https://data.cityofnewyork.us/api/v3/views/ji82-xba5/query.json",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-App-Token": process.env.NYC_OPEN_DATA_APP_TOKEN,
      },
      body: JSON.stringify({
        query,
        page: {
          pageNumber: 1,
          pageSize: 1,
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
  
  if (!data || data.length === 0) {
    throw new Error(`Facility with ID ${facilityId} not found`);
  }

  return data[0]; // Return single facility object
}

module.exports = {
  searchFacilities,
  getFacilityById,
};
