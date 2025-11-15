const express = require('express');
const router = express.Router();

const kauani = require('./kauani');
const joao = require('./joao');
const pedro = require('./pedro');
const duda = require('./duda');

router.use('/', kauani);
router.use('/', joao);
router.use('/', pedro);
router.use('/', duda);

module.exports = router;