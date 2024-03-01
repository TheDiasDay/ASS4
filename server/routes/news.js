const express = require("express");
const router = express.Router();
const axios = require("axios");

const adminLayout = '../views/layouts/admin';

router.get("/news",  async (req, res) => {
    const car = req.query.car;
    const newsApiKey = "24b8e41ecc3e4618a1a77387786243d3";
  
    let newsData;
    let error = null;
  
    try {
      const newsResponse = await axios.get(`https://newsapi.org/v2/everything?q=${encodeURIComponent(car)}&apiKey=${newsApiKey}`);
      newsData = newsResponse.data;

      const locals = {
        title: 'News',
        description: 'Portfolio platform',
      }
  
  
    res.render('admin/news', {
        locals,
        newsData,
        layout: adminLayout
    });
    } catch (error) {
      newsData = null;
      error = error.message || "Error, please try again";
    }
  });

  module.exports = router;