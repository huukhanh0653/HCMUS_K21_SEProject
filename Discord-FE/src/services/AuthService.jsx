import { jwtDecode } from "jwt-decode";

const authService = {
  decodeToken: async () => {
    try {
      const accessToken = JSON.parse(localStorage.getItem("used_user"))[0]
        .accessToken;
      if (accessToken) {
        const decoded = jwtDecode(accessToken);
        const userId = decoded.sub;
        return userId;
      }
      return null;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  },
};

export default authService;
