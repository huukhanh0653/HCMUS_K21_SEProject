const { sql, poolPromise } = require("./dbConfig");
const {
  formatCurrency,
  formatAsSQLDate,
  convertToSQLDate,
  formatAsSQLDatetime,
  formatAsVietnameseDate,
} = require("../middleware/utils");
const e = require("express");

async function executeProcedure(procedureName, params) {
  try {
    const pool = await poolPromise;
    const request = pool.request();

    if (params) {
      params.forEach((param) => {
        request.input(param.name, param.type, param.value);
      });
    }

    const result = await request.execute(procedureName);

    return result.recordset ? result.recordset : result;
  } catch (err) {
    console.error("Error executing procedure:", err);
    return null;
  }
}

async function callFunction(functionName, params) {
  try {
    const pool = await poolPromise;
    const request = pool.request();

    if (params) {
      params.forEach((param) => {
        request.input(param.name, param.type, param.value);
      });
    }

    const result = await request.query(
      `SELECT dbo.${functionName}(${params
        .map((param) => param.name)
        .join(",")})`
    );
    return result.recordset ? result.recordset : result;
  } catch (err) {
    console.error("Error executing function:", err);
    return null;
  }
}

async function queryDB(query) {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(query);

    if (!result) {
      return null;
    }

    return result.recordset ? result.recordset : result;
  } catch (err) {
    console.log(err);
    return null;
  }
}

async function queryPaginating(query, pageSize, pageNumber) {
  try {
    const result = await executeProcedure("SP_QUERY_PAGE", [
      { name: "Query", type: sql.NVarChar, value: query },
      { name: "PageSize", type: sql.Int, value: pageSize },
      { name: "Page", type: sql.Int, value: pageNumber },
    ]);

    if (!result) {
      return [];
    }

    return result.recordset ? result.recordset : result;
  } catch (err) {
    console.error("Error executing paginated query:", err);
    return [];
  }
}

async function getTableInfo(MaCN) {
  try {
    let result = await executeProcedure("SP_ADMIN_GET_ALL_TABLE", [
      { name: "MACN", type: sql.Int, value: MaCN },
    ]);

    if (!result) {
      return [];
    }

    return result;
  } catch (err) {
    console.error("Error executing getTableInfo:", err);
    return [];
  }
}

async function getReservations(MaCN, Date) {
  let result = null;
  try {
    let query = `SELECT * FROM DATBAN WHERE ChiNhanh = ${MaCN} AND 
                CONVERT(date, NgayGioDat) = '${Date}'`;

    result = await queryDB(query);

    if (result === null) {
      return [];
    }
    result.forEach((element) => {
      element["reservationID"] = element["MaDatBan"];
      delete element["MaDatBan"];
      element["fullName"] = element["HoTen"];
      delete element["HoTen"];
      element["phone_number"] = element["SDT"] ? element["SDT"] : null;
      delete element["SDT"];
      element["billID"] = element["MaHD"] ? element["MaHD"] : null;
      delete element["MaHD"];
      element["numberOfPeople"] = element["SoLuong"];
      delete element["SoLuong"];
      element["note"] = element["GhiChu"] ? element["GhiChu"] : null;
      delete element["GhiChu"];
      element["date"] = element["NgayGioDat"].toISOString().split("T")[0];
      element["time"] = element["NgayGioDat"]
        .toISOString()
        .split("T")[1]
        .split(".")[0];
    });

    return result;
  } catch (err) {
    console.error("Error executing getReservations:", err);
    return [];
  }
}

async function getTableDetail(MaBan) {
  try {
    let query = `SELECT BAN.MABAN, PHIEUDATMON.MaPhieu, 
                PHIEUDATMON.NgayLap, NHANVIEN.HOTEN, PHIEUDATMON.TongTien
                FROM BAN
                JOIN PHIEUDATMON ON BAN.MaHD = PHIEUDATMON.MaHD
                JOIN NHANVIEN ON NHANVIEN.MaNV = PHIEUDATMON.MaNV
                WHERE BAN.MaBan = ${MaBan}`;

    let PhieuDatMon = await queryDB(query);
    if (!PhieuDatMon) {
      return [];
    }

    let result = [];

    for (let i = 0; i < PhieuDatMon.length; i++) {
      let item = {};
      item["orderID"] = PhieuDatMon[i].MaPhieu;
      item["date"] = PhieuDatMon[i].NgayLap.toISOString().split("T")[0];
      item["time"] = PhieuDatMon[i].NgayLap.toISOString()
        .split("T")[1]
        .split(".")[0];

      query = `SELECT MONAN.TenMon, MONAN.GiaTien, CHONMON.SoLuong
              FROM CHONMON JOIN MONAN ON CHONMON.MaMon = MONAN.MaMon
              WHERE CHONMON.MaPhieu =  ${item["orderID"]}`;

      let MonAn = await queryDB(query);
      if (MonAn) {
        item["data"] = MonAn;
        item["data"].forEach((element) => {
          element["GiaTien"] = formatCurrency(element["GiaTien"].toFixed(0));
          element["price"] = element["GiaTien"];
          delete element["GiaTien"];

          element["quantity"] = element["SoLuong"];
          delete element["SoLuong"];

          element["dishName"] = element["TenMon"];
          delete element["TenMon"];
        });
      } else item["data"] = [];

      item["createdBy"] = PhieuDatMon[i].HOTEN;
      item["subTotal"] = formatCurrency(PhieuDatMon[i].TongTien);

      result.push(item);
    }

    return result;
  } catch (err) {
    console.log(err);
    return [];
  }
}

async function getBillDetail(MaHD) {
  try {
    let query = `SELECT PHIEUDATMON.*, NHANVIEN.HoTen FROM PHIEUDATMON
                JOIN NHANVIEN ON NHANVIEN.MaNV = PHIEUDATMON.MaNV 
                WHERE PHIEUDATMON.MaHD = ${MaHD}`;
    let PhieuDatMon = await queryDB(query);
    if (!PhieuDatMon) {
      return [];
    }
    let result = [];

    for (let i = 0; i < PhieuDatMon.length; i++) {
      let item = {};
      item["orderID"] = PhieuDatMon[i].MaPhieu;
      item["createdBy"] = PhieuDatMon[i].HoTen;
      item["date"] = PhieuDatMon[i].NgayLap.toISOString().split("T")[0];
      item["time"] = PhieuDatMon[i].NgayLap.toISOString()
        .split("T")[1]
        .split(".")[0];

      query = `SELECT MONAN.TenMon, MONAN.GiaTien, CHONMON.SoLuong
              FROM CHONMON JOIN MONAN ON CHONMON.MaMon = MONAN.MaMon
              WHERE CHONMON.MaPhieu = ${item["orderID"]}`;

      let MonAn = await queryDB(query);
      item["subTotal"] = 0;
      if (MonAn) {
        item["data"] = MonAn;
        item["data"].forEach((element) => {
          item["subTotal"] +=
            element["GiaTien"].toFixed(0) * element["SoLuong"];

          element["GiaTien"] = formatCurrency(element["GiaTien"].toFixed(0));
          element["price"] = element["GiaTien"];
          delete element["GiaTien"];

          element["quantity"] = element["SoLuong"];
          delete element["SoLuong"];

          element["dishName"] = element["TenMon"];
          delete element["TenMon"];
        });
      } else item["data"] = [];
      item["subTotal"] = formatCurrency(item["subTotal"].toFixed(0));

      result.push(item);
    }

    return result;
  } catch (err) {
    console.log(err);
    return [];
  }
}

async function getStatisticBranch(MaCN, fromDate, toDate) {
  //! Còn lỗi, đang chờ fix
  try {
    const pool = await poolPromise;
    const request = pool.request();

    let totalBills;
    let totalRevenue;
    let totalNewMember;
    let totalCustomer;

    const sqlFromDate = convertToSQLDate(fromDate);
    const sqlToDate = convertToSQLDate(toDate);

    request.input("MaCN", sql.Int, MaCN);
    request.input("NgayBatDau", sqlFromDate);
    request.input("NgayKetThuc", sqlToDate);

    const result = await request.execute("sp_Top5MonAnChayNhatCN");
    totalCustomer = await queryDB(
      `SELECT COUNT(MaKH) as totalCustomer FROM KHACHHANG`
    );

    dailyRevenue = await queryDB(
      `SELECT HD.NgayLap as date, SUM(CM.SoLuong * MA.GiaTien) as Revenue
      FROM CHONMON CM
      JOIN PHIEUDATMON PDM ON CM.MaPhieu = PDM.MaPhieu
      JOIN MONAN MA ON CM.MaMon = MA.MaMon
      JOIN HOADON HD ON PDM.MaHD = HD.MaHD
      WHERE HD.MaCN = ${MaCN}
      AND '${sqlFromDate}' <= HD.NgayLap AND HD.NgayLap <= '${sqlToDate}'
      GROUP BY HD.NgayLap
      ORDER BY HD.NgayLap ASC`
    );

    totalRevenue = await queryDB(
      `SELECT SUM(CM.SoLuong * MA.GiaTien) as totalRevenue
      FROM CHONMON CM
      JOIN PHIEUDATMON PDM ON CM.MaPhieu = PDM.MaPhieu
      JOIN MONAN MA ON CM.MaMon = MA.MaMon
      JOIN HOADON HD ON PDM.MaHD = HD.MaHD
      WHERE HD.MaCN = ${MaCN}
      AND '${sqlFromDate}' <= HD.NgayLap AND HD.NgayLap <= '${sqlToDate}'`
    );

    totalNewMember = await queryDB(
      `SELECT COUNT(MaThe) as totalNewMember FROM THETHANHVIEN WHERE NgayLap BETWEEN '${sqlFromDate}' AND '${sqlToDate}'`
    );

    totalBills = await queryDB(
      `SELECT COUNT(MaHD) as totalBills
      FROM hoadon
      WHERE (NgayLap BETWEEN '${sqlFromDate}' AND '${sqlToDate}') AND HOADON.MaCN = ${MaCN}`
    );

    dailyRevenue.forEach((element) => {
      element["date"] = formatAsVietnameseDate(element["date"]);
    });

    return {
      dailyRevenue: dailyRevenue ? dailyRevenue : [],
      totalRevenue: totalRevenue[0].totalRevenue
        ? formatCurrency(totalRevenue[0].totalRevenue.toFixed(0))
        : "0",
      totalNewMember: totalNewMember[0].totalNewMember || 0,
      totalBills: totalBills[0].totalBills || 0,
      totalCustomer: totalCustomer ? totalCustomer[0].totalCustomer : 0,
      recentSales: result.recordset ? result.recordset : result,
    };
  } catch (err) {
    console.error("Error executing getStatistic:", err);
    return [];
  }
}

async function getStatisticCompany(fromDate, toDate) {
  //! Còn lỗi, đang chờ fix
  try {
    const pool = await poolPromise;
    const request = pool.request();

    let totalBills;
    let totalRevenue;
    let totalNewMember;
    let totalCustomer;

    const sqlFromDate = convertToSQLDate(fromDate);
    const sqlToDate = convertToSQLDate(toDate);

    request.input("NgayBatDau", sqlFromDate);
    request.input("NgayKetThuc", sqlToDate);

    const result = await request.execute("sp_TopMonAnChayNhatCty");

    totalCustomer = await queryDB(
      `SELECT COUNT(MaKH) as totalCustomer FROM KHACHHANG`
    );

    dailyRevenue = await queryDB(
      `SELECT HD.NgayLap as date, SUM(CM.SoLuong * MA.GiaTien) as Revenue
      FROM CHONMON CM
      JOIN PHIEUDATMON PDM ON CM.MaPhieu = PDM.MaPhieu
      JOIN MONAN MA ON CM.MaMon = MA.MaMon
      JOIN HOADON HD ON PDM.MaHD = HD.MaHD
      WHERE '${sqlFromDate}' <= HD.NgayLap AND HD.NgayLap <= '${sqlToDate}'
      GROUP BY HD.NgayLap
      ORDER BY HD.NgayLap ASC`
    );

    totalRevenue = await queryDB(
      `SELECT SUM(CM.SoLuong * MA.GiaTien) as totalRevenue
      FROM CHONMON CM
      JOIN PHIEUDATMON PDM ON CM.MaPhieu = PDM.MaPhieu
      JOIN MONAN MA ON CM.MaMon = MA.MaMon
      JOIN HOADON HD ON PDM.MaHD = HD.MaHD
      WHERE'${sqlFromDate}' <= HD.NgayLap AND HD.NgayLap <= '${sqlToDate}'`
    );

    totalNewMember = await queryDB(
      `SELECT COUNT(MaThe) as totalNewMember FROM THETHANHVIEN WHERE NgayLap BETWEEN '${sqlFromDate}' AND '${sqlToDate}'`
    );

    totalBills = await queryDB(
      `SELECT COUNT(MaHD) as totalBills
      FROM hoadon
      WHERE (NgayLap BETWEEN '${sqlFromDate}' AND '${sqlToDate}')`
    );

    dailyRevenue.forEach((element) => {
      element["date"] = formatAsVietnameseDate(element["date"]);
    });

    return {
      dailyRevenue: dailyRevenue ? dailyRevenue : [],
      totalRevenue: totalRevenue[0].totalRevenue
        ? formatCurrency(totalRevenue[0].totalRevenue.toFixed(0))
        : "0",
      totalNewMember: totalNewMember[0].totalNewMember || 0,
      totalBills: totalBills[0].totalBills || 0,
      totalCustomer: totalCustomer ? totalCustomer[0].totalCustomer : 0,
      recentSales: result.recordset ? result.recordset : result,
    };
  } catch (err) {
    console.error("Error executing getStatistic:", err);
    return [];
  }
}

async function getStatisticRegion(region, fromDate, toDate) {
  //! Còn lỗi, đang chờ fix
  try {
    const pool = await poolPromise;
    const request = pool.request();

    let totalBills;
    let totalRevenue;
    let totalNewMember;
    let totalCustomer;

    const sqlFromDate = convertToSQLDate(fromDate);
    const sqlToDate = convertToSQLDate(toDate);

    request.input("MaKV", region);
    request.input("NgayBatDau", sqlFromDate);
    request.input("NgayKetThuc", sqlToDate);

    const result = await request.execute("sp_Top5MonAnChayNhatKV");
    totalCustomer = await queryDB(
      `SELECT COUNT(MaKH) as totalCustomer FROM KHACHHANG`
    );

    dailyRevenue = await queryDB(
      `SELECT HD.NgayLap as date, SUM(CM.SoLuong * MA.GiaTien) as Revenue
      FROM CHONMON CM
      JOIN PHIEUDATMON PDM ON CM.MaPhieu = PDM.MaPhieu
      JOIN MONAN MA ON CM.MaMon = MA.MaMon
      JOIN HOADON HD ON PDM.MaHD = HD.MaHD
      JOIN CHINHANH CN ON HD.MaCN = CN.MaCN
      WHERE '${sqlFromDate}' <= HD.NgayLap AND HD.NgayLap <= '${sqlToDate}'
      AND CN.MaKV = '${region}'
      GROUP BY HD.NgayLap
      ORDER BY HD.NgayLap ASC`
    );

    totalRevenue = await queryDB(
      `SELECT SUM(CM.SoLuong * MA.GiaTien) as totalRevenue
      FROM CHONMON CM
      JOIN PHIEUDATMON PDM ON CM.MaPhieu = PDM.MaPhieu
      JOIN MONAN MA ON CM.MaMon = MA.MaMon
      JOIN HOADON HD ON PDM.MaHD = HD.MaHD
      JOIN CHINHANH CN ON HD.MaCN = CN.MaCN
      WHERE'${sqlFromDate}' <= HD.NgayLap AND HD.NgayLap <= '${sqlToDate}'
      AND CN.MaKV = '${region}'`
    );

    totalNewMember = await queryDB(
      `SELECT COUNT(MaThe) as totalNewMember FROM THETHANHVIEN WHERE NgayLap BETWEEN '${sqlFromDate}' AND '${sqlToDate}'`
    );

    totalBills = await queryDB(
      `SELECT COUNT(MaHD) as totalBills
      FROM hoadon
      JOIN CHINHANH ON HOADON.MaCN = CHINHANH.MaCN
      WHERE (NgayLap BETWEEN '${sqlFromDate}' AND '${sqlToDate}')
      AND CHINHANH.MaKV = '${region}'`
    );

    dailyRevenue.forEach((element) => {
      element["date"] = formatAsVietnameseDate(element["date"]);
    });

    return {
      dailyRevenue: dailyRevenue ? dailyRevenue : [],
      totalRevenue: totalRevenue[0].totalRevenue
        ? formatCurrency(totalRevenue[0].totalRevenue.toFixed(0))
        : "0",
      totalNewMember: totalNewMember[0].totalNewMember || 0,
      totalBills: totalBills[0].totalBills || 0,
      totalCustomer: totalCustomer ? totalCustomer[0].totalCustomer : 0,
      recentSales: result.recordset ? result.recordset : result,
    };
  } catch (err) {
    console.error("Error executing getStatistic:", err);
    return [];
  }
}

async function searchStatisticDish(MaCN, fromDate, toDate, dishName) {
  //! Còn lỗi, đang chờ fix
  try {
    const pool = await poolPromise;
    const request = pool.request();

    const sqlFromDate = convertToSQLDate(fromDate);
    const sqlToDate = convertToSQLDate(toDate);

    request.input("MaCN", sql.Int, MaCN);
    request.input("NgayBatDau", sqlFromDate);
    request.input("NgayKetThuc", sqlToDate);
    request.input("TenMon", sql.NVarChar, dishName);

    const result = await request.execute("sp_SearchDoanhThuMonAnCN");
    return result.recordset ? result.recordset : result;
  } catch (err) {
    console.error("Error executing getStatistic:", err);
    return [];
  }
}

async function getCustomer(pageSize, pageNumber) {
  try {
    let query = `SELECT * FROM KHACHHANG`;

    const result = await queryPaginating(query, pageSize, pageNumber);

    if (!result) return [];

    result.forEach((element) => {
      element["username"] = element["Username"];
      delete element["Username"];
      element["customerID"] = element["MaKH"];
      delete element["MaKH"];
      element["fullName"] = element["HoTen"];
      delete element["HoTen"];
      element["phoneNumber"] = element["SDT"];
      delete element["SDT"];
      element["email"] = element["Email"];
      delete element["Email"];
      element["address"] = element["DiaChi"];
      delete element["DiaChi"];
      element["ssn"] = element["cccd"];
      delete element["cccd"];
      element["gender"] = element["GioiTinh"];
      delete element["GioiTinh"];
    });

    return result;
  } catch (err) {
    console.log(err);
    return null;
  }
}

async function searchCustomer(keyWord) {
  try {
    const result = await executeProcedure("SP_SEARCH_KHACHHANG", [
      {
        name: "TUKHOA",
        type: sql.NVarChar,
        value: keyWord,
      },
    ]);

    if (!result) return [];

    result.forEach((element) => {
      element["username"] = element["Username"];
      delete element["Username"];
      element["customerID"] = element["MaKH"];
      delete element["MaKH"];
      element["fullName"] = element["HoTen"];
      delete element["HoTen"];
      element["phoneNumber"] = element["SDT"];
      delete element["SDT"];
      element["email"] = element["Email"];
      delete element["Email"];
      element["address"] = element["DiaChi"];
      delete element["DiaChi"];
      element["ssn"] = element["cccd"];
      delete element["cccd"];
      element["gender"] = element["GioiTinh"];
      delete element["GioiTinh"];
    });
    return result;
  } catch (err) {
    console.log(err);
  }
}

async function getDishes(MACN, Category, pageSize, pageNumber) {
  try {
    let result = await executeProcedure("SP_GETDISHES", [
      { name: "MACN", type: sql.NVarChar, value: MACN },
      { name: "CATEGORY", type: sql.NVarChar, value: Category },
      { name: "PageSize", type: sql.Int, value: pageSize },
      { name: "Page", type: sql.Int, value: pageNumber },
    ]);

    if (!result) return [];

    result.forEach((element) => {
      element["dishID"] = element["MaMon"];
      delete element["MaMon"];
      element["dishName"] = element["TenMon"];
      delete element["TenMon"];
      element["price"] = formatCurrency(element["GiaTien"].toFixed(0));
      delete element["GiaTien"];
      element["image"] = element["HinhAnh"];
      delete element["HinhAnh"];
      element["deliverable"] = element["GiaoHang"];
      delete element["GiaoHang"];
      element["category"] = element["PhanLoai"];
      delete element["PhanLoai"];
      element["availability"] = element["isServed"];
      delete element["isServed"];
    });
    return result;
  } catch (err) {
    console.log(err);
    return null;
  }
}

async function getCompanyDishes(Category, pageSize, pageNumber) {
  try {
    let result = await queryPaginating(
      `SELECT MONAN.*, KV.MT, KV.MN, KV.MB
       FROM (SELECT MONAN1.MaMon,
            MAX(CASE WHEN THUCDON.MaKV = 'MB' THEN 1 ELSE 0 END) AS MB,
            MAX(CASE WHEN THUCDON.MaKV = 'MT' THEN 1 ELSE 0 END) AS MT, 
            MAX(CASE WHEN THUCDON.MaKV = 'MN' THEN 1 ELSE 0 END) AS MN
            FROM MONAN MONAN1 LEFT JOIN THUCDON ON MONAN1.MaMon = THUCDON.MaMon 
            WHERE MONAN1.PhanLoai = '${Category}'
			GROUP BY MONAN1.MaMon) AS KV
      JOIN MONAN ON KV.MaMon = MONAN.MaMon`,
      pageSize,
      pageNumber
    );

    if (!result) return [];

    result.forEach((element) => {
      element["dishID"] = element["MaMon"];
      delete element["MaMon"];
      element["dishName"] = element["TenMon"];
      delete element["TenMon"];
      element["price"] = formatCurrency(element["GiaTien"].toFixed(0));
      delete element["GiaTien"];
      element["image"] = element["HinhAnh"];
      delete element["HinhAnh"];
      element["deliverable"] = element["GiaoHang"];
      delete element["GiaoHang"];
      element["category"] = element["PhanLoai"];
      delete element["PhanLoai"];
      element["availability"] = element["isServed"];
      delete element["isServed"];
    });

    return result;
  } catch (err) {
    console.log(err);
    return null;
  }
}

async function getRegionalDishes(MAKV, Category, pageSize, pageNumber) {
  try {
    let query = `SELECT MONAN.* FROM THUCDON JOIN MONAN 
                ON THUCDON.MaMon = MONAN.MaMon 
                WHERE THUCDON.MaKV = '${MAKV}' AND PhanLoai LIKE '${Category}'`;
    let result = await queryPaginating(query, pageSize, pageNumber);

    if (!result) return [];

    result.forEach((element) => {
      element["dishID"] = element["MaMon"];
      delete element["MaMon"];
      element["dishName"] = element["TenMon"];
      delete element["TenMon"];
      element["price"] = formatCurrency(element["GiaTien"].toFixed(0));
      delete element["GiaTien"];
      element["image"] = element["HinhAnh"];
      delete element["HinhAnh"];
      element["deliverable"] = element["GiaoHang"];
      delete element["GiaoHang"];
      element["category"] = element["PhanLoai"];
      delete element["PhanLoai"];
    });

    return result;
  } catch (err) {
    console.log(err);
    return null;
  }
}

async function getMember(MaKH) {
  try {
    let query = `SELECT * FROM TheThanhVien WHERE MaKH = ${MaKH}`;

    let result = await queryDB(query);

    if (!result) return null;

    return result.recordset ? result.recordset : result;
  } catch (err) {
    console.log(err);
    return null;
  }
}

async function getEmployeeReview(MaNV) {
  console.log(MaNV);
  try {
    const pool = await poolPromise;
    const request = pool.request();
    request.input("MaNV", sql.Int, MaNV);
    const result = await request.execute("fn_DiemPhucVuNhanVien");

    return result.recordset ? result.recordset : result;
  } catch (err) {
    console.log(err);
    return null;
  }
}

module.exports = {
  queryPaginating,
  getTableInfo,
  getTableDetail,
  getBillDetail,
  queryDB,
  getReservations,
  executeProcedure,
  callFunction,
  getCustomer,
  getStatisticBranch,
  getDishes,
  getMember,
  getRegionalDishes,
  getCompanyDishes,
  searchStatisticDish,
  getStatisticCompany,
  getStatisticRegion,
  getEmployeeReview,
  searchCustomer,
};
