const facilitiesService = require("../services/facilities.service");

async function searchFacilities(req, res, next) {
  try {
    const { optype, facgroup, facsubgrp, search } = req.body || {};
    const result = await facilitiesService.searchFacilities({
      optype,
      facgroup,
      facsubgrp,
      search,
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  searchFacilities,
};

