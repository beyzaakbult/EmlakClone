var express = require('express');
var router = express.Router();

const { applySearch } = require("./helpers/search")

const sql = require("msnodesqlv8") //sql bağlama kodu modül için
const connectionString = "Driver={ODBC Driver 17 for SQL Server};Server=DESKTOP-L5VUKV4;Database=EmlakClone;Trusted_Connection=Yes;"

router.get('/', function(req, res, next) {
  const { content, skip = 0, limit = 100, q = "", ...params } = req?.query || {};
  const query = `SELECT * FROM ${content==="haber"?"TBLEmlakHaber":"TBLIlanlar LEFT JOIN TBLIrtibatlar ON TBLIlanlar.contactID = TBLIrtibatlar.contactID"}`
  
  sql.query(connectionString, query, (err, rows) => {
    let data = [];
    if (rows?.length) {
      rows.forEach(row=>{
        if (!(params && Object.entries(params).find(([k,v]) => `${row?.[k]}`!==`${v}`))) {
          const newData = {contentType: content, ...row}
          data.push(newData)
        }
      })
    }
    let responseData = {
      results:[]
    };
    if (params?.ID) {
      const item = data?.find(item => `${item?.ID}`===`${params.ID}`);
      if (item) {
        responseData.results.push(item)
      }
    }
    else {
      const searchKeys = `${q}`.toLowerCase().split(" ").filter(v => v);
      const allResults = applySearch(data, searchKeys)
      const start = parseInt(skip);
      const count = parseInt(limit)
      const offset = start < allResults?.length ?
        (0 <= start ? start : 0) : allResults?.length
      responseData.skip = offset;
      responseData.limit = count;
      responseData.totalResults = allResults?.length || 0
      responseData.results = allResults.slice(offset, offset + count);
    }
   
    res.send({ 
      message: 'Content router is on', 
      data: responseData
    });
  })
});

module.exports = router;