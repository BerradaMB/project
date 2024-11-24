const express = require('express');
const connection = require('../connection');
const router = express.Router();
var auth = require('../services/authentication');


router.get('/details',(resq,res,next)=>{
    var familleCount;
    var materialCount;
    var ticketCount;
    var query = "select count(id) as familleCount from famille";
    connection.query(query,(err,results)=>{
        if(!err){
            familleCount = results[0].familleCount;
        }
        else{
            return res.status(500).json(err);
        }
    })
    var query ="select count(id) as materialCount from material";
    connection.query(query,(err,results)=>{
        if(!err){
            materialCount = results[0].materialCount;
        }
        else{
            return res.status(500).json(err);
        }
    })
    var query ="select count(id) as ticketCount from ticket";
    connection.query(query,(err,results)=>{
        if(!err){
            ticketCount = results[0].ticketCount;
            var data = {
                famille:familleCount,
                material:materialCount,
                ticket:ticketCount
            };
            res.status(200).json(data);
        }
        else{
            return res.status(500).json(err);
        }
    })
})


module.exports = router;