const express = require('express');
const router = express.Router();

const kauani = require('./kauani');
const joao = require('./joao');
const pedro = require('./pedro');
const duda = require('./duda');
const login = require('./login');

router.use('/', kauani);
router.use('/', joao);
router.use('/', pedro);
router.use('/', duda);
router.use('/', login);

module.exports = router;