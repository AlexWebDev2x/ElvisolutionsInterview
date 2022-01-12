const express = require('express');

const userController = require('../controllers/users');

const router = express.Router({ strict: true });

router
    .route('/')
    .get(userController.getUsers)
    .post(userController.createUser);
    
router
    .route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);

module.exports = router;
