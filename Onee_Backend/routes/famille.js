const express = require('express');
const connection = require('../connection');
const router = express.Router();
var auth =require('../services/authentication');
var checkRole = require('../services/checkRole');

router.post('/add',(req,res,next)=>{
    let famille = req.body;
    query = "insert into famille (name) values(?)";
    connection.query(query,[famille.name],(err,results)=>{
        if(!err){
            return res.status(200).json({message:"famille added succefully"});
        }
        else{
            return res.status(500).json(err);
        }
    })
})
router.get('/get',(req,res,next)=>{
    var query = "select *from famille order by name";
    connection.query(query,(err,results)=>{
        if(!err){
            return res.status(200).json(results);
        }
        else{
            return res.status(500).json(err);
        }
    })
})
router.patch('/update',(req,res,next)=>{
    let material = req.body;
    var query ="update famille set name=? where id=?";
    connection.query(query,[material.name,material.id],(err,results)=>{
        if(!err){
            if(results.affectedRows == 0){
                return res.status(404).json({message:"famille id does not found"});
            }
            return res.status(200).json({message:"famille updated succefully"});
        }
        else{
            return res.status(500).json(err);
        }
    })
})
module.exports = router;