const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const { sql, poolPromise } = require("../model/dbConfig");

// Passport Local Strategy
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const pool = await poolPromise;
      let result = await pool
        .request()
        .input("username", username)
        .query("SELECT * FROM TAIKHOAN WHERE Username = @username");

      if (!result) {
        console.log(result);
        return done(null, false, { message: "Incorrect username." });
      }

      let user = result.recordset[0];
      console.log(user);

      // Compare passwords
      if (password !== user.Password) {
        return done(null, false, { message: "Incorrect password." });
      }

      // Check if user is active
      if (!user.IsActive) {
        return done(null, false, { message: "User is not active." });
      }

      result = await pool
        .request()
        .input("username", username)
        .query("SELECT * FROM NHANVIEN WHERE Username = @username");

      if (result.recordset.length > 0) {
        user = result.recordset[0];
        console.log("Nhan vien", user);
        user = {
          MaNV: user.MaNV,
          Username: user.Username,
          MaBP: user.MaBP,
          CN_HienTai: user.CN_Hientai
        };
      } else {
        result = await pool
          .request()
          .input("username", username)
          .query("SELECT * FROM KHACHHANG WHERE Username = @username");

        if (result.recordset.length > 0) {
          user = result.recordset[0];
          user = { MaKH: user.MaKH, Username: user.Username };
        } else {
          return done(null, false, { message: "User not found." });
        }
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

// Passport "local-signup" strategy
passport.use(
  'local-signup',
  new LocalStrategy(
    {
      passReqToCallback: true, // Allows passing the request object to the callback
      usernameField: 'username', // Specify the username field in the request
      passwordField: 'password', // Specify the password field in the request
    },
    async (req, username, password, done) => {
      try {
        const { fullname, cccd, email, phone } = req.body; // Extract additional fields from the request body
        const pool = await poolPromise;

        // Check if the username already exists in TAIKHOAN
        const userResult = await pool
          .request()
          .input('username', username)
          .query('SELECT * FROM TAIKHOAN WHERE Username = @username');

        if (userResult.recordset.length > 0) {
          return done(null, false, { message: 'Username đã được sử dụng. Vui lòng chọn tên khác.' });
        }

        // Insert new user into TAIKHOAN
        await pool
          .request()
          .input('username', username)
          .input('password', password)
          .input('isActive', true) // Default value for IsActive
          .query(
            'INSERT INTO TAIKHOAN (Username, Password, IsActive) VALUES (@username, @password, @isActive)'
          );

        // Insert user details into KHACHHANG
        await pool
          .request()
          .input('username', username)
          .input('fullname', fullname)
          .input('phone', phone)
          .input('email', email)
          .input('cccd', cccd)
          .query(
            `INSERT INTO KHACHHANG (Username, HoTen, SDT, Email, CCCD) 
             VALUES (@username, @fullname, @phone, @email, @cccd)`
          );

        // Fetch the newly created user
        const newUser = {
          username,
          fullname,
          email,
          phone,
        };

        // Successfully registered
        return done(null, newUser);
      } catch (error) {
        console.error('Error during signup:', error);
        return done(error);
      }
    }
  )
);

// Serialize user
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialize user
passport.deserializeUser(async (username, done) => {
  try {
    let pool = await sql.connect(dbConfig);

    let result = await pool
      .request()
      .input("Username", sql.VarChar, username)
      .query("SELECT * FROM TAIKHOAN WHERE Username = @username");

    if (result.recordset.length === 0) {
      return done(new Error("User not found"));
    }

    let user = result.recordset[0];
    done(null, user);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;
