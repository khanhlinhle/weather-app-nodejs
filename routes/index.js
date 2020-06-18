var express = require('express');
var router = express.Router();
const getGeocode = require('../utils/getGeocode');
const getForecast = require('../utils/getForecast');

/* GET home page. */
router.get('/', async function (req, res, next) {
  try {
    const { city } = req.query;
    console.log(city);
    if (!city) return res.render('index', { title: 'Linh Weather App' });

    // Get the coordinates from the city name.
    const location = await getGeocode(city);
    console.log("location: ", location);
    // Use the location coords to get forecast.
    // Get coords from location.geometry.coordinates.
    const forecast = await getForecast(location.geometry.coordinates);
    forecast.hourly = forecast.hourly.filter((item, index) => {
      if (index % 2 === 0 && index < 24) {
        return item;
      }
    });
    console.log(forecast.hourly.length);

    forecast.hourly.dt = forecast.hourly.map(item => {
      eachHour = new Date(item.dt * 1000);
      item.dt = eachHour.getHours();
      return item.dt;
    });

    return res.render('index', {
      title: 'Linh Weather App',
      forecast: forecast.current,
      city: city,
      weatherByHour: forecast.hourly
    });
  } catch (err) {
    next(err);
  }

});

router.get("/weather-by-coords", async (req, res, next) => {
  try {
    const { lon, lat } = req.query;
    if (!lon || !lat) {
      return res.json({ status: "Failed", message: "Requires longitude and latitude" });
    }
    const forecast = await getForecast([lon, lat]);
    return res.json({ status: "Okay", data: forecast.current });
  } catch (err) {
      next(err);
  }
});

module.exports = router;
