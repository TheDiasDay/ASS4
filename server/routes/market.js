// market.js
const express = require('express');
const router = express.Router();

// GET /market route
router.get('/', (req, res) => {
    res.render('market'); // Render the market EJS page
});

module.exports = router;
