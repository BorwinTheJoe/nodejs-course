const express = require('express');
const router = express.Router();
const employeesController = require('../../controllers/employeesController');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');


router.route('/')
    //requesting the employees
    .get(employeesController.getAllEmployees)
    //posting a new employee
    .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), employeesController.createNewEmployee)
    //updating an existing employee
    .put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), employeesController.updateEmployee)
    //deleting an existing employee
    .delete(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), employeesController.deleteEmployee);

router.route('/:id')
    .get(employeesController.getEmployee);


module.exports = router;