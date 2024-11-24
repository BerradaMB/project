const express =require('express');
const connection = require('../connection');
const router = express.Router();
var auth = require('../services/authentication');
var checkRole = require('../services/checkRole');

router.post('/add' ,(req,res)=>{
    let material = req.body;
    var query = "insert into material (name,familleId,N_serie,Code_onee,Mark,activite,status) values(?,?,?,?,?,?,'true')";
    connection.query(query,[material.name,material.familleId,material.N_serie,material.Code_onee,material.Mark,material.activite,material.status],(err,results)=>{
        if(!err){
            return res.status(200).json({message:"material added successfully."});
        }
        else{
            return res.status(500).json(err);
        }
    })
})
router.get('/get',(req,res,next)=>{
    var query ="SELECT  m.id,m.name,m.N_serie,m.Code_onee,m.Mark,m.activite,f.id AS familleId,f.name AS familleName FROM material AS m INNER JOIN famille AS f ON m.familleId = f.id ";
    connection.query(query,(err,results)=>{
        if(!err){
            return res.status(200).json(results);
        }
        else{
            return res.status(500).json(err);
        }
    })
})
router.get('/getByfamille/:id',(req,res,next)=>{
    const id = req.params.id;
    var query ="select id,name from material where familleId= ? and status= 'true'";
    connection.query(query,[id],(err,results)=>{
        if(!err){
            return res.status(200).json(results);
        }
        else{
            return res.status(500).json(err);
        }
    })
})
router.get('/getById/:id',(req,res,next)=>{
    const id = req.params.id;
    var query = "select id,name,N_serie,Code_onee,Mark,activite from material where id = ?";
    connection.query(query,[id],(err,results)=>{
        if(!err){
            return res.status(200).json(results[0]);
        }
        else{
            return res.status(500).json(err);
        }
    })
})
router.patch("/update",(req,res,next)=>{
    let material = req.body;
    var query ="update material set name=?,familleId=?,N_serie=?,Code_onee=?,Mark=?,activite=? where id=?";
    connection.query(query,[material.name,material.familleId,material.N_serie,material.Code_onee,material.Mark,material.activite,material.id],(err,results)=>{
        if(!err){
            if(results.affectedRows == 0){
                return res.status(404).json({message:"Product id does not found"});
            }
            return res.status(200).json({message:"Product Updated Successfully"});
        }
        else{
            return res.status(500).json(err);
        }
    })
})
router.delete('/delete/:id',(req,res,next)=>{
    const id = req.params.id;
    var query ="delete from material where id=?";
    connection.query(query,[id],(err,results)=>{
        if(!err){
            if(results.affectedRows ==0){
                return res.status(404).json({message:"Product id does not found"});
            }
            return res.status(200).json({message:"Product deleted Successfully"});
        }
        else{
            return res.status(500).json(err);
        }
    })
})
router.patch('/updatestatus',(req,res,next)=>{
    let user = req.body;
    var query = "update material set status =? where id=?";
    connection.query(query,[user.status,user.id],(err,results)=>{
        if(!err){
            if(results.affectedRows == 0){
                return res.status(404).json({message:"product id does not found"});
            }
            return res.status(200).json({message:"Material Status update Successfully"});
        }
        else{
            return res.status(500).json(err);
        }
    })
})
module.exports = router;