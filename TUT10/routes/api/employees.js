const express = require('express');
const router = express.Router();
const employeesController = require('../../controllers/employeesController');


router.route('/')
    //requesting the employees
    .get(employeesController.getAllEmployees)
    //posting a new employee
    .post(employeesController.createNewEmployee)
    //updating an existing employee
    .put(employeesController.updateEmployee)
    //deleting an existing employee
    .delete(employeesController.deleteEmployee);

router.route('/:id')
    .get(employeesController.getEmployee);


module.exports = router;