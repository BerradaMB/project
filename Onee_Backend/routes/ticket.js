const express = require('express');
const connection = require('../connection');
const router = express.Router();
let ejs = require('ejs');
let pdf = require('html-pdf');
let path = require('path');
var fs = require('fs');
var uuid = require('uuid'); 
const fsPromises = require('fs').promises;

router.post('/generateReport', (req, res) => {
    const generateUuid = uuid.v1();
    const orderDetails = req.body;

    // Validate required fields
    if (!orderDetails.Nom_et_prenom || !orderDetails.matricule || !orderDetails.entite || !orderDetails.Adresse_du_site) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    let materialDetailsReport;

    try {
        materialDetailsReport = JSON.parse(orderDetails.materialDetails);
    } catch (error) {
        return res.status(400).json({ error: "Invalid JSON in materialDetails" });
    }

    const query = "INSERT INTO ticket (Nom_et_prenom, uuid, matricule, entite, Adresse_du_site, materialDetails) VALUES (?, ?, ?, ?, ?, ?)";
    connection.query(query, [orderDetails.Nom_et_prenom, generateUuid, orderDetails.matricule, orderDetails.entite, orderDetails.Adresse_du_site, orderDetails.materialDetails], (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json(err);
        }
        
        ejs.renderFile(path.join(__dirname, '', "report.ejs"), {
            materialDetails: materialDetailsReport,
            Nom_et_prenom: orderDetails.Nom_et_prenom,
            matricule: orderDetails.matricule,
            entite: orderDetails.entite,
            Adresse_du_site: orderDetails.Adresse_du_site
        }, (err, results) => {
            if (err) {
                console.error("EJS render error:", err);
                return res.status(500).json(err);
            } else {
                pdf.create(results).toFile('./generated_pdf/' + generateUuid + ".pdf", function (err, data) {
                    if (err) {
                        console.error("PDF creation error:", err);
                        return res.status(500).json(err);
                    } else {
                        return res.status(200).json({ uuid: generateUuid });
                    }
                });
            }
        });
    });
});

router.post('/getPdf', async function (req, res) {
    const orderDetails = req.body;
    const pdfFilePath = path.join(__dirname, '../generated_pdf/', orderDetails.uuid + '.pdf');

    // Ensure the generated_pdf directory exists
    const generatedPdfDir = path.join(__dirname, '../generated_pdf');
    try {
        await fsPromises.mkdir(generatedPdfDir, { recursive: true });
    } catch (error) {
        return res.status(500).json({ error: "Failed to create directory" });
    }

    if (fs.existsSync(pdfFilePath)) {
        res.contentType("application/pdf");
        fs.createReadStream(pdfFilePath).pipe(res);
    } else {
        let materialDetailsReport;
        try {
            materialDetailsReport = JSON.parse(orderDetails.materialDetails);
        } catch (error) {
            return res.status(400).json({ error: "Invalid JSON in materialDetails" });
        }

        ejs.renderFile(path.join(__dirname, '', "report.ejs"), {
            materialDetails: materialDetailsReport,
            Nom_et_prenom: orderDetails.Nom_et_prenom,
            matricule: orderDetails.matricule,
            entite: orderDetails.entite,
            Adresse_du_site: orderDetails.Adresse_du_site
        }, (err, results) => {
            if (err) {
                return res.status(500).json(err);
            } else {
                pdf.create(results).toFile(pdfFilePath, function (err, data) {
                    if (err) {
                        console.log(err);
                        return res.status(500).json(err);
                    } else {
                        res.contentType("application/pdf");
                        fs.createReadStream(pdfFilePath).pipe(res);
                    }
                });
            }
        });
    }
});
router.get('/getTicket',(req,res,next)=>{
    var query = "select *from ticket order by id DESC";
    connection.query(query,(err,results)=>{
        if(!err){
            return res.status(200).json(results);
        }
        else{
            return res.status(500).json(err);
        }
    })
})
router.delete('/delete/:id', (req, res, next) => {
    const id = req.params.id;
    var query = "DELETE FROM ticket WHERE id = ?";
    connection.query(query, [id], (err, results) => {
        if (!err) {
            if (results.affectedRows == 0) {
                return res.status(404).json({ message: "Ticket ID not found" });
            }
            return res.status(200).json({ message: "Ticket deleted successfully" });
        } else {
            return res.status(500).json(err);
        }
    });
});


module.exports = router;
