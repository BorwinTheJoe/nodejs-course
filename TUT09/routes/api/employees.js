const express = require('express');
const router = express.Router();
const path = require ('path');
const data = {};

//in future learning on how to connect to databases.
data.employees = require('../../data/employees.json');

router.route('/')
    //requesting the employees
    .get((req,res) => {
        res.json(data.employees);
    })
    //posting a new employee
    .post((req,res) => {
        res.json({
            "firstname": req.body.firstname,
            "lastname": req.body.lastname
        });
    })
    //updating an existing employee
    .put((req,res) => {
        res.json({
            "firstname": req.body.firstname,
            "lastname": req.body.lastname
        });
    })
    .delete((req,res) => {
        res.json({ "id": req.body.id })
    });

router.route('/:id')
    .get((req,res) => {
        res.json({ "id": req.params.id })
    });


module.exports = router;