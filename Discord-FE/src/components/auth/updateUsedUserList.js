export const updateUsedUserList = (user, username) => {
    const usedUserList = JSON.parse(localStorage.getItem("used_user")) || [];
  
    const newUser = {
      username: username || user.displayName || "Unknown",
      email: user.email,
      accessToken: user.accessToken,
      photoURL: user.photoURL || user.avatar || "",
    };
  
    const exists = usedUserList.some((u) => u.email === newUser.email);
    if (!exists) {
      usedUserList.push(newUser);
      localStorage.setItem("used_user", JSON.stringify(usedUserList));
    }
  };
  