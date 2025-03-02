var express = require("express");
const passport = require("../middleware/passport");
const { isEmployee } = require("../middleware/auth");
var router = express.Router();
const { sql, poolPromise } = require("../model/dbConfig");
const { query_paginating, getTableInfo, executeProcedure, queryDB } = require("../model/queryDB");

router.get("/get-all-bophan", async function (req, res, next) {
  let query = `SELECT * FROM BOPHAN`;
  const pool = await poolPromise;
  const result = await pool.request().query(query);
  if (!result) {
    return res.status(500).json({ message: "Internal server error" });
  }
  console.log(result.recordset);
  return res.status(200).json(result.recordset);
});

router.post("/register", async function (req, res, next) {
  const { username, password, name, phone, email, cccd, gender } = req.query;

  if (!username || !password || !name || !phone || !email || !cccd || !gender)
    return res.status(400).json({ message: "Missing required information" });

  if (
    !queryDB(
      `INSERT INTO TaiKhoan (Username, Password, isActive) VALUES ('${username}, '${password}', 1)`
    )
  )
    return res.status(500).json({ message: "Internal server error" });

  let MaKH = queryDB("SELECT * FROM KHACHHANG").recordset.length;
  if (!MaKH) MaKH = 1;

  if (
    !queryDB(
      `INSERT INTO KhachHang (MaKH, Username, HoTen, Email, SDT, CCCD, GioiTinh) VALUES ('${MaKH}, ${username}', N'${name}', '${email}', '${phone}', '${cccd}, ${gender}')`
    )
  )
    return res.status(500).json({ message: "Internal server error" });

  return res.status(200).json({ message: "Registered successfully" });
});

router.get("/menu/:MaKV", async function (req, res, next) {
  const { MaKV } = req.params;
  let result = false;

  result = await executeProcedure("sp_XemMenuTheoKV", [
    {
      name: "makv",
      type: sql.Char,
      value: MaKV,
    },
  ]);
  if (result.length === 0)
    return res.status(200).json({ message: "No result" });
  if (!result || result.length === 0)
    return res.status(500).json({ message: "Internal server error" });
  return res.status(200).json(result);
});

router.get("/menu/:MaKV/:MaCN", async function (req, res, next) {
  const { MaKV, MaCN } = req.params;
  let result = false;

  result = await executeProcedure("sp_XemMenuTheoCN", [
    {
      name: "macn",
      type: sql.Int,
      value: MaCN,
    },
  ]);
  if (result.length === 0)
    return res.status(200).json({ message: "No result" });
  if (!result || result.length === 0)
    return res.status(500).json({ message: "Internal server error" });
  return res.status(200).json(result);
});

router.get("/menu/:MaKV/:MaCN/:PhanLoai", async function (req, res, next) {
  const { MaKV, MaCN, PhanLoai } = req.params;
  let result = false;

  result = await executeProcedure("sp_XemMenuTheoCate", [
    {
      name: "phanloai",
      type: sql.NVarChar,
      value: PhanLoai,
    },
    {
      name: "macn",
      type: sql.Int,
      value: MaCN,
    },
  ]);
  if (result.length === 0)
    return res.status(200).json({ message: "No result" });
  if (!result || result.length === 0)
    return res.status(500).json({ message: "Internal server error" });
  return res.status(200).json(result);
});


router.get("/get-all-khuvuc", async function (req, res, next) {
  try {
    const query = `SELECT * FROM KHUVUC`;
    const pool = await poolPromise;
    const result = await pool.request().query(query);

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }

    console.log(result.recordset);
    return res.status(200).json(result.recordset);
  }
  catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Unexpected Error" });
  }
});

router.get("/get-chinhanh/:MaKV", async function (req, res, next) {
  const { MaKV } = req.params;
  try {
    const query = `SELECT * FROM CHINHANH WHERE MaKV = '${MaKV}'`;
    const pool = await poolPromise;
    const result = await pool.request().query(query);

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }

    console.log(result.recordset);
    return res.status(200).json(result.recordset);
  }
  catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Unexpected Error" });
  }
});

router.get("/get-all-phanloai", async function (req, res, next) {
  try {
    const query = `SELECT DISTINCT PhanLoai FROM MONAN`;
    const pool = await poolPromise;
    const result = await pool.request().query(query);

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }

    console.log(result.recordset);
    return res.status(200).json(result.recordset);
  }
  catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Unexpected Error" });
  }
});

router.get("/product/:id", async function (req, res, next) {
  const { id } = req.params; // Retrieve the `id` from the route parameters

  try {
    // Query the database for the specific dish
    const dishDetail = await queryDB(`SELECT * FROM MONAN WHERE MaMon = '${id}'`);

    // Check if the dish exists
    if (!dishDetail ) {
      return res.status(404).json({ message: "No product found" });
    }

    // Return the dish details
    console.log(dishDetail);
    return res.status(200).json(dishDetail);

  } catch (error) {
    console.error("Error fetching product:", error);
    return res.status(500).json({ message: "Unexpected Error" });
  }
});

router.post("/customer-reservation", async function (req, res, next) {
  try {
    const { name, phone, rdate, ppl, note, selectedBranch } = req.body;
    const pool = await poolPromise;

    if (!rdate || !ppl || !name || !phone || !selectedBranch)
      return res.status(404).json({ message: "Missing required information" });

    // Parse and format date for SQL
    const formattedDate = rdate.replace("T", " ") + ":00";

    console.log(name, phone, formattedDate, ppl, note, selectedBranch);

    //let branchId = queryDB("SELECT MaCN FROM CHINHANH WHERE TenCN = N'${selectedBranch}'").recordset.length;

    const bookingResult = await pool
      .request()
      .input("hoten", name)
      .input("sdt", phone)
      .input("ngaygiodat", formattedDate)
      .input("sl", ppl)
      .input("macn", selectedBranch)
      .input("ghichu", note)
      .execute("sp_DatBanMoi");

    const MaDatBan = bookingResult.returnValue;

    // if (
    //   queryDB(
    //     `INSERT INTO DATBAN (HoTen, SDT, NgayGioDat, SoLuong, ChiNhanh, GhiChu) VALUES (N'${name}', '${phone}', '${formattedDate}', '${ppl}', '${selectedBranch}', N'${note}')`
    //   )
    // )
      return res.status(200).json({ message: "Đặt bàn thành công! ", MaDatBan });

  } catch (error) {
    console.error("Error: ", error);
    return res.status(500).json({ message: "Unexpected Error" });
  }
});

router.post("/cart-page", async function (req, res, next) {
  try {
    const { cartItems, cardID, reservationID } = req.body;

    const processedCardID = cardID && cardID.trim() !== "" ? cardID : null;

    // Validate the request body
    if (!cartItems || Object.keys(cartItems).length === 0) {
      console.log("Cart is empty");
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Fetch products from database to validate cart items and calculate totals
    const pool = await poolPromise; // Assuming you're using SQL Server with a pool
    const productIds = Object.keys(cartItems).map(id => `'${id}'`).join(',');
    console.log(productIds);
    const query = `SELECT MaMon, TenMon, HinhAnh, GiaTien FROM MONAN WHERE MaMon IN (${productIds})`;

    const result = await pool.request().query(query);
    const products = result.recordset;

    if (!products || products.length === 0) {
      console.log("Products not found");
      return res.status(404).json({ message: "Products not found" });
    }

    // Calculate totals and prepare order details
    const orderDetails = [];

    products.forEach((product) => {
      const cartItem = cartItems[product.MaMon]; // Get the product details from cartItems
      if (cartItem && cartItem.quantity > 0) {
    
        orderDetails.push({
          MaMon: product.MaMon,
          SoLuong: cartItem.quantity, // Pass the quantity
        });
      }
    });

    // Insert invoice using stored procedure `sp_taoHDMoi`
    let invoiceResult;
    if (reservationID) {
        invoiceResult = await pool.request().execute("sp_TaoHDMoi");
    } else {
        invoiceResult = await pool.request().execute("sp_TaoHDMoi_Delivery");
    }
    
    const MaHD = invoiceResult.returnValue; 

    // Insert order (PHIEUDATMON) using stored procedure `sp_TaoPDM_Moi`
    const orderResult = await pool
      .request()
      .input("MaHD", MaHD)
      .execute("sp_TaoPDM_Customer");

    const MaPhieu = orderResult.returnValue; // Get the newly created order ID

    // Insert each order detail into CHONMON table
    for (const detail of orderDetails) {
      await pool
        .request()
        .input("MaPhieu", MaPhieu)
        .input("MaMon", detail.MaMon)
        .input("SoLuong", detail.SoLuong)
        .input("TraMon", 0)
        .query(
          "INSERT INTO CHONMON (MaPhieu, MaMon, SoLuong, TraMon) VALUES (@MaPhieu, @MaMon, @SoLuong, @TraMon)"
        );
    }

    const checkOutRes = await pool
      .request()
      .input("MaHD", MaHD)
      .input("MaThe", processedCardID)
      .execute("sp_Checkout_Customer");

    const GiamGia = checkOutRes.returnValue;

    const query1 = `SELECT TOP 1 * FROM HOADON WHERE MaHD = '${MaHD}'`;
    const result1 = await pool.request().query(query1)

    const TongTien = result1.recordset[0]?.TongHoaDon;

    if (reservationID)
    {
      const query2 = `UPDATE DATBAN
                      SET MaHD = '${MaHD}'
                      WHERE MaDatBan = '${reservationID}'`;
      const result2 = await pool.request().query(query2)
    }
    // Respond with order confirmation
    return res.status(200).json({
      message: "Order placed successfully",
      MaPhieu, TongTien, GiamGia
    });
  } catch (error) {
    console.error("Error placing order:", error);
    return res.status(500).json({ message: "Unexpected Error" });
  }
});

router.post("/check-card", async function (req, res, next) {
  try {
    const { cardID } = req.body;

    if (!cardID )
      return res.status(400).json({ message: "Missing information" });

    const query = `SELECT * FROM THETHANHVIEN WHERE MaThe = '${cardID}' `;
    const pool = await poolPromise;
    const result = await pool.request().query(query);

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "Mã thẻ không hợp lệ!" });
    }

      return res.status(200).json({ message: "Mã thẻ hợp lệ!" });

    } catch (error) {
      console.error("Error: ", error);
      return res.status(500).json({ message: "Unexpected Error" });
    }

});

router.get("/search-dish", async function (req, res, next) {
  let result = false;
  let KeyWord = req.query.keyWord ? req.query.keyWord : "";

  result = await executeProcedure("SP_SEARCH_MONAN", [
    {
      name: "TUKHOA",
      type: sql.NVarChar,
      value: KeyWord,
    },
  ]);
  if (result.length === 0)
    return res.status(200).json({ message: "No result" });
  if (!result || result.length === 0)
    return res.status(500).json({ message: "Internal server error" });
  return res.status(200).json(result);
});

// router.post("/register-customer", isEmployee, function (req, res, next) {
//   const { username, password } = req.user;
//   const { NgayLap, LoaiThe, MaKH } = req.body;

//   let findEmp = queryDB(
//     `SELECT * FROM NHANVIEN WHERE Username = '${username}'`
//   );

//   if (!findEmp) {
//     return res.status(401).json({ message: "Unauthorized" });
//   } else {
//     findEmp = findEmp.recordset[0];
//   }

//   if (!name || !phone || !email || !address) {
//     return res.status(400).json({ message: "Missing required information" });
//   }

//   let query = `INSERT INTO TheThanhVien (MaThe, NgayLap, LoaiThe, MaNV, isActive, MaKH) VALUES ('${username}', '${password}', N'${name}', '${phone}', '${email}', N'${address}', 1)`;

//   poolPromise
//     .then((pool) => {
//       return pool.request().query(query);
//     })
//     .then((result) => {
//       console.log(result);
//       return res.status(200).json({ message: "Registered successfully" });
//     })
//     .catch((err) => {
//       console.log(err);
//       return res.status(500).json({ message: "Internal server error" });
//     });
// });

// router.post("/create-order-dish", isEmployee, function (req, res, next) {});

// router.post("/create-bophan", function (req, res, next) {
//   const { MaBP, TenBoPhan, Luong } = req.query;

//   console.log(req.query);
//   let query = `INSERT INTO BoPhan (MaBP, TenBoPhan, Luong) VALUES ('${MaBP}', N'${TenBoPhan}', '${Luong}')`;
//   poolPromise
//     .then((pool) => {
//       return pool.request().query(query);
//     })
//     .then((result) => {
//       console.log(result);
//       return res.status(200).json({ message: "Registered successfully" });
//     })
//     .catch((err) => {
//       console.log(err);
//       return res.status(500).json({ message: "Internal server error" });
//     });
// });

module.exports = router;
