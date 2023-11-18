const axios = require("axios");

function isHoliday(day, month, year) {
  axios
    .get(
      `https://holidays.abstractapi.com/v1/?api_key=${process.env.HOLIDAY_API_KEY}&country=DZ&year=${year}&month=${month}&day=${day}`
    )
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.log("Can't check if the day is a holiday !", error);
    });
}

module.exports = { isHoliday };
