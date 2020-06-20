import axios from "axios";

const api = ((url) => {
  return {
    async getTokens() {
      const response = await axios.get(`${url}/tokens`);

      return response.data;
    },
  };
})(process.env.REACT_APP_API);

export default api;
