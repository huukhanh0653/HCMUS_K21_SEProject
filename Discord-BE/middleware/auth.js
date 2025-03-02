const { sql, poolPromise } = require("../model/dbConfig");

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ message: "Unauthorized" });
}

function isEmployee(req, res, next) {
  if (!req.isAuthenticated())
    return res.status(401).json({ message: "Unauthorized" });

  if (req.user.MaNV) return next;
  return res.status(401).json({ message: "Unauthorized" });
}

// This function is used to check if the user is a manager

function isManager(user)
{
  if (user.MaNV && user.MaBP == 1) return true; // 1 is the code for the manager department
  return false;
}

function isManager(req, res, next) {
  if (!req.isAuthenticated())
    return res.status(401).json({ message: "Unauthorized" });

  if (req.user.MaNV && req.user.MaBP == 1) return next; // 1 is the code for the manager department

  return res.status(401).json({ message: "Unauthorized" });
}

// This function is used to check if the user is an administrator

function _isAdministrator(user)
{
  if (user.MaNV && user.MaBP == 6) return true; // 6 is the code for the administrator department
  return false;
}

function isAdministrator(req, res, next) {
  if (!req.isAuthenticated())
    return res.status(401).json({ message: "Unauthorized" });

  if (req.user.MaNV && req.user.MaBP == 6) return next; // 6 is the code for the administrator department

  return res.status(401).json({ message: "Unauthorized" });
}

module.exports = {
  isAuthenticated,
  isEmployee,
  isManager,
  _isAdministrator
};
