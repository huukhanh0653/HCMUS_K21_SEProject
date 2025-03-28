import CryptoJS from "crypto-js";

const SECRET_KEY = import.meta.env.VITE_SECRET_KEY;

export const updateUsedUserList = (user, username, password) => {
  const usedUserList = JSON.parse(localStorage.getItem("used_user")) || [];

  // Mã hóa password với AES
  const encryptedPassword = CryptoJS.AES.encrypt(password, SECRET_KEY).toString();

  const newUser = {
    username: username || user.displayName || "Unknown",
    email: user.email,
    accessToken: user.accessToken,
    photoURL: user.photoURL || user.avatar || "",
    encryptedPassword: encryptedPassword,
  };

  const exists = usedUserList.some((u) => u.email === newUser.email);
  if (!exists) {
    usedUserList.push(newUser);
    localStorage.setItem("used_user", JSON.stringify(usedUserList));
  }
};
