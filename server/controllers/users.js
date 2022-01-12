const bcrypt = require('bcryptjs');

const { catchAsync } = require('../utils/errorHandlers');
const User = require('../models/users');


exports.getUsers = catchAsync( async (req, res, next) =>
    {
        let users = await User.findAll();

        users = users.map( u => ({ ...u.dataValues, password: undefined }) );

        res.status(200).json(
            {
                status: 'success',
                data: users
            });
    },
    "getUsers");

exports.getUser = catchAsync( async (req, res, next) =>
    {
        let user = await User.findByPk(req.params.id);

        if (user)
        {
            user = user.dataValues;
            user.password = undefined;
        }

        res.status(200).json(
            {
                status: user? 'success' : 'resource not found',
                data: user ?? undefined
            });
    },
    "getUser");

const filterRequestBody = (body, ...allowedFields) => Object.keys(body).reduce( (res, key) =>
    {
        if (allowedFields.includes(key))
            res[key] = body[key];

        return res;
    },
    {} );

exports.createUser = catchAsync( async (req, res, next) =>
    {
        const filteredBody = filterRequestBody(req.body, 'name', 'surname', 'birth_date', 'email', 'password', 'phone', 'identity', 'passport_number');
        
        filteredBody.password = await bcrypt.hash(filteredBody.password, 12);
        
        let user = await User.create({ ...filteredBody });

        user = user.dataValues;
        user.password = undefined;

        res.status(201).json(
            {
                status: 'success',
                data: user
            });
    },
    "createUser");

exports.updateUser = catchAsync( async (req, res, next) =>
    {
        const filteredBody = filterRequestBody(req.body, 'name', 'surname', 'birth_date', 'email', 'password', 'phone', 'identity', 'passport_number');

        if (filteredBody.password)
            filteredBody.password = await bcrypt.hash(filteredBody.password, 12);
            
        const result = await User.update(
            { ...filteredBody },
            {
                where: { id: req.params.id },
                returning: true,
                plain: true
            });

        res.status(200).json(
            {
                status: (result[0] || result.length > 1)? 'success' : 'resource not found',
                data: { ...result[1].dataValues, password: undefined }
            });
    },
    "updateUser");

exports.deleteUser = catchAsync( async (req, res, next) =>
    {
        await User.destroy({ where: { id: req.params.id } });

        res.status(204).json(
            {
                status: 'success',
            });
    },
    "deleteUser");

