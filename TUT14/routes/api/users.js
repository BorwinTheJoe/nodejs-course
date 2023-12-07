const express = require('express');
const router = express.Router();
const usersController = require('../../controllers/usersController');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');

router
    .route('/')
    //requesting the Users
    .get(verifyRoles(ROLES_LIST.Admin), usersController.getAllUsers)
    //deleting an existing User
    .delete(verifyRoles(ROLES_LIST.Admin), usersController.deleteUser);

router.route('/:id').get(verifyRoles(ROLES_LIST.Admin), usersController.getUser);

module.exports = router;
