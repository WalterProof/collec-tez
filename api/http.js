const axios = require("axios");

const http = {
  async performGetRequest(server, command) {
    const url = `${server}/${command}`;

    const response = await axios.get(url);

    if (response.status !== 200) {
      throw new Error(
        `HTTP error: ${response.status} for ${command} on ${server}`
      );
    }

    return response.data;
  },
};

module.exports = http;
