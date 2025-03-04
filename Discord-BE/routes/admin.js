const express = require("express");
const router = express.Router();
const multer = require("multer");
const passport = require("../middleware/passport");
const upload = multer();

const { isEmployee, _isAdministrator } = require("../middleware/auth");

const { sql, poolPromise } = require("../model/dbConfig");
const {
  getTableInfo,
  queryPaginating,
  getTableDetail,
  getReservations,
  callFunction,
  getBillDetail,
  getCustomer,
  getDishes,
  getStatisticBranch,
  getStatisticCompany,
  getStatisticRegion,
  getMember,
  getEmployeeReview,
  getRegionalDishes,
  executeProcedure,
  queryDB,
  searchStatisticDish,
  searchCustomer,
} = require("../model/queryDB");

const { formatAsSQLDate, convertToSQLDate } = require("../middleware/utils");

const {
  createNewDish,
  createNewCustomer,
  createNewEmployee,
  createNewStaffTransfer,
  createNewMember,
  addDishToBranch,
  createNewOrder,
  deleteOrder,
  createNewOrderDetail,
  deleteCustomer,
  deleteDish,
  checkout,
  checkoutForPreorder,
} = require("../model/query_post");

router.get("/get-all-bophan", async function (req, res, next) {
  let query = `SELECT * FROM BOPHAN`;
  const pool = await poolPromise;
  const result = await pool.request().query(query);
  if (!result || result.length === 0) {
    return res.status(500).json({ message: "Internal server error" });
  }
  return res.status(200).json(result);
});

router.get("/members", async function (req, res, next) {
  let pageSize = req.query.PageSize ? parseInt(req.query.PageSize, 10) : 25;
  let pageNumber = req.query.PageNumber
    ? parseInt(req.query.PageNumber, 10)
    : 1;

  const result = await queryPaginating(
    "ACCOUNTS",
    "ID",
    pageSize,
    pageNumber
  );
  if (!result || result.length === 0) {
    return res.status(500).json({ message: "Internal server error" });
  }
  return res.status(200).json(result);
});

router.get("/customers", async function (req, res, next) {
  let pageSize = req.query.PageSize ? parseInt(req.query.PageSize, 10) : 25;
  let pageNumber = req.query.CurrentPage
    ? parseInt(req.query.CurrentPage, 10)
    : 1;

  const result = await getCustomer(pageSize, pageNumber);

  if (!result || result.length === 0) {
    return res.status(500).json({ message: "Internal server error" });
  }
  return res.status(200).json(result);
});

// Lay thong tin cac ban an trong mot chi nhanh bat ky
router.get("/info", async function (req, res, next) {
  let result = false;
  let MaCN = false;

  // if (isAdministrator(req.body.user)) MaCN = req.query.id;
  // else MaCN = req.body.user.CN_HienTai;
  if (req.query.CurBranch != null) {
    MaCN = req.query.CurBranch;
  } else {
    // MaCN = req.body.user.CN_HienTai;
  }

  // Lấy thông tin các bàn hiện tại của chi nhánh
  result = await getTableInfo(MaCN);

  if (!result || result.length === 0) {
    return res.status(500).json({ message: "Internal server error" });
  }
  return res.status(200).json(result);
});

// Lay thong tin chi tiet cua mot ban an
router.get("/table", async function (req, res, next) {
  let result = false;
  let MaBan = req.query.id;

  // Lấy thông tin các bàn hiện tại của chi nhánh
  result = await getTableDetail(MaBan);

  if (!result || result.length === 0) {
    return res.status(500).json({ message: "Internal server error" });
  }
  return res.status(200).json(result);
});

// Lay toan bo phieu dat ban trong mot ngay cu the tai mot chi nhanh
router.get("/reservations", async function (req, res, next) {
  let result = false;
  // Nếu là admin thì dùng id truyền vào, còn không thì lấy chi nhánh hiện tại
  // let MaCN = isAdministrator(req.user) ? req.query.id : req.user.CN_HienTai;
  let MaCN = req.query.CurBranch;
  let formattedDate = req.query.Date
    ? convertToSQLDate(req.query.Date)
    : formatAsSQLDate(Date.now());

  result = await getReservations(MaCN, formattedDate);

  if (!result) {
    return res.status(500).json({ message: "Internal server error" });
  }
  else if(result.length === 0) {
    return res.status(200).json({ message: "No data" });
  }
  return res.status(200).json(result);
});

// Lay toan bo hoa don trong mot ngay cu the tai mot chi nhanh
router.get("/bill", async function (req, res, next) {
  let result = false;
  let PageNumber = req.query.CurrentPage ? req.query.CurrentPage : 1;
  let PageSize = req.query.PageSize ? req.query.PageSize : 25;
  // Phan quyen theo chi nhanh va cong ty
  let MaCN = req.query.CurBranch;
  result = await queryPaginating(
    `SELECT * FROM HOADON WHERE MaCN = ${MaCN}`,
    PageSize,
    PageNumber
  );

  if (!result || result.length === 0) {
    return res.status(500).json({ message: "Internal server error" });
  }
  return res.status(200).json(result);
});

// Lay toan bo hoa don trong mot ngay cu the tai mot chi nhanh
router.get("/total-bill", async function (req, res, next) {
  let result = false;
  // Phan quyen theo chi nhanh va cong ty
  let MaCN = req.query.CurBranch;

  result = await queryDB(
    `SELECT COUNT(*) AS TotalBill FROM HOADON WHERE MaCN = ${MaCN}`
  );

  if (!result || result.length === 0) {
    return res.status(500).json({ message: "Internal server error" });
  }
  return res.status(200).json(result[0]);
});

router.get("/bill-detail", async function (req, res, next) {
  let result = false;
  let MaHD = req.query.billID;
  result = await getBillDetail(MaHD);
  if (!result || result.length === 0) {
    return res.status(500).json({ message: "Internal server error" });
  }
  return res.status(200).json(result);
});

router.get("/total-dish", async function (req, res, next) {
  let result = false;
  // Phan quyen theo chi nhanh va cong ty
  let MaCN = req.query.CurBranch;
  let Category = req.query.Category;

  result = await queryDB(
    `SELECT COUNT(*) AS TotalDish
    FROM MONAN JOIN PHUCVU ON MONAN.MaMon = PHUCVU.MaMon
    WHERE PHUCVU.MaCN = ${MaCN} AND MONAN.phanLoai='${Category}'`
  );

  if (!result || result.length === 0) {
    return res.status(500).json({ message: "Internal server error" });
  }
  return res.status(200).json(result[0]);
});

router.get("/dish-per-category", async function (req, res, next) {
  let result = false;
  let MaCN = req.query.CurBranch;

  result = await queryDB(
    `SELECT PhanLoai, COUNT(*) AS TotalDish FROM MONAN JOIN PHUCVU ON MONAN.MaMon = PHUCVU.MaMon WHERE PHUCVU.MaCN = ${MaCN} GROUP BY PhanLoai`
  );

  let data = {};
  result.forEach((row) => {
    data[row.PhanLoai] = row.TotalDish;
  });

  result = data;

  if (!result || result.length === 0) {
    return res.status(500).json({ message: "Internal server error" });
  }
  return res.status(200).json(result);
});

router.get("/dishes", async function (req, res, next) {
  let result = false;

  let PageNumber = req.query.CurrentPage ? req.query.CurrentPage : 1;
  let PageSize = req.query.PageSize ? req.query.PageSize : 25;
  let Category = req.query.Category ? req.query.Category : "%";
  let MaCN = req.query.CurBranch ? req.query.CurBranch : 1;

  result = await getDishes(MaCN, Category, PageSize, PageNumber);

  if (!result || result.length === 0) {
    return res.status(500).json({ message: "Internal server error" });
  }
  return res.status(200).json(result);
});

router.get("/regional-dishes", async function (req, res, next) {
  let result = false;

  let PageNumber = req.query.CurrentPage ? req.query.CurrentPage : 1;
  let PageSize = req.query.PageSize ? req.query.PageSize : 25;
  let Category = req.query.Category ? req.query.Category : "%";

  let MaCN = req.query.CurBranch ? req.query.CurBranch : null;

  let MaKV = await queryDB(`SELECT MaKV FROM CHINHANH WHERE MaCN = ${MaCN}`);
  MaKV = MaKV[0].MaKV;

  if (!MaKV) {
    return res.status(400).json({ message: "Cannot find region" });
  }

  result = await getRegionalDishes(MaKV, Category, PageSize, PageNumber);

  if (!result || result.length === 0) {
    return res.status(500).json({ message: "Internal server error" });
  }
  return res.status(200).json(result);
});

router.get("/regional-dish-info", async function (req, res, next) {
  let result = false;
  let MaCN = req.query.CurBranch;
  const MaKV = await queryDB(`SELECT MaKV FROM CHINHANH WHERE MaCN = ${MaCN}`);

  result = await queryDB(
    `SELECT MONAN.PhanLoai, COUNT(*) AS TotalDish 
    FROM MONAN 
    JOIN THUCDON ON MONAN.MaMon = THUCDON.MaMon 
    WHERE THUCDON.MaKV = '${MaKV[0].MaKV}'
    GROUP BY MONAN.PhanLoai`
  );

  let data = {};
  let total = 0;
  result.forEach((row) => {
    data[row.PhanLoai] = row.TotalDish;
    total += row.TotalDish;
  });

  result = { data: data, total: total };

  if (!result || result.length === 0) {
    return res.status(500).json({ message: "Internal server error" });
  }
  return res.status(200).json(result);
});

router.get("/total-employee", async function (req, res, next) {
  let result = false;
  // Phan quyen theo chi nhanh va cong ty
  let MaCN = req.query.CurBranch;

  result = await queryDB(
    `SELECT COUNT(*) AS TotalEmployee FROM NHANVIEN WHERE CN_HienTai = ${MaCN}`
  );
  if (!result || result.length === 0) {
    return res.status(500).json({ message: "Internal server error" });
  }
  return res.status(200).json(result[0]);
});

router.get("/employees", async function (req, res, next) {
  let result = false;

  let PageNumber = req.query.CurrentPage ? req.query.CurrentPage : 1;
  let PageSize = req.query.PageSize ? req.query.PageSize : 25;
  let MaCN = req.query.CurBranch ? req.query.CurBranch : null;

  result = await queryPaginating(
    `SELECT * FROM NHANVIEN` + (MaCN ? ` WHERE CN_Hientai = ${MaCN}` : ""),
    PageSize,
    PageNumber
  );

  if (!result || result.length === 0) {
    return res.status(500).json({ message: "Internal server error" });
  }
  return res.status(200).json(result);
});

router.get("/employee-review", async function (req, res, next) {
  let result = false;
  let MaNV = req.query.EmployeeID;
  result = await getEmployeeReview(MaNV);

  if (!result || result.length === 0) {
    return res.status(500).json({ message: "Internal server error" });
  }
  return res.status(200).json(result.output);
});

router.get("/work-history", async function (req, res, next) {
  let result = false;

  result = await queryDB(
    `SELECT * FROM DOICN WHERE MaNV = ${req.query.employeeID}`
  );

  if (!result || result.length === 0) {
    return res.status(500).json({ message: "Internal server error" });
  }
  return res.status(200).json(result);
});

router.get("/member", async function (req, res, next) {
  let result = false;

  let MaKH = req.query.CustomerID ? req.query.CustomerID : null;

  if (!MaKH) {
    return res.status(400).json({ message: "Invalid Customer ID" });
  }

  result = await getMember(MaKH);

  if (!result || result.length === 0) {
    return res.status(500).json({ message: "Internal server error" });
  }
  return res.status(200).json(result);
});

router.get("/total-customer", async function (req, res, next) {
  let result = false;

  result = await queryDB("SELECT COUNT(*) AS TotalCustomer FROM KHACHHANG");

  if (!result || result.length === 0) {
    return res.status(500).json({ message: "Internal server error" });
  }
  return res.status(200).json(result[0]);
});

router.get("/customers", async function (req, res, next) {
  let result = false;

  let PageNumber = req.query.CurrentPage ? req.query.CurrentPage : 1;
  let PageSize = req.query.PageSize ? req.query.PageSize : 25;

  result = await queryPaginating(
    `SELECT * FROM KHACHHANG`,
    PageSize,
    PageNumber
  );

  if (!result || result.length === 0) {
    return res.status(500).json({ message: "Internal server error" });
  }
  return res.status(200).json(result);
});

router.get("/total-customer", async function (req, res, next) {
  let result = false;

  result = await queryDB("SELECT COUNT(*) AS TotalCustomer FROM KHACHHANG");

  if (!result || result.length === 0) {
    return res.status(500).json({ message: "Internal server error" });
  }
  return res.status(200).json(result[0]);
});

router.get("/customers", async function (req, res, next) {
  let result = false;

  let PageNumber = req.query.CurrentPage ? req.query.CurrentPage : 1;
  let PageSize = req.query.PageSize ? req.query.PageSize : 25;

  result = await queryPaginating(
    `SELECT * FROM KHACHHANG`,
    PageSize,
    PageNumber
  );

  if (!result || result.length === 0) {
    return res.status(500).json({ message: "Internal server error" });
  }
  return res.status(200).json(result);
});

router.get("/statistic-branch", async function (req, res, next) {
  let result = false;
  let MaCN = req.query.CurBranch ? req.query.CurBranch : 1;
  let fromDate = req.query.FromDate;
  let toDate = req.query.ToDate;

  if (!MaCN || !fromDate || !toDate)
    return res.status(400).json({ message: "Invalid Branch ID or Date" });

  result = await getStatisticBranch(MaCN, fromDate, toDate);

  if (!result || result.length === 0)
    return res
      .status(500)
      .json({ message: "Internal server error or empty data" });

  return res.status(200).json(result);
});


router.get("/search-dish", async function (req, res, next) {
  let result = false;
  let MaCN = req.query.CurBranch ? req.query.CurBranch : 1;
  let fromDate = req.query.FromDate;
  let toDate = req.query.ToDate;
  let dishName = req.query.DishName;

  if (!MaCN || !fromDate || !toDate || !dishName)
    return res.status(400).json({ message: "Invalid Branch ID or Date" });

  result = await searchStatisticDish(MaCN, fromDate, toDate, dishName);

  if (!result || result.length === 0)
    return res
      .status(500)
      .json({ message: "Internal server error or empty data" });

  return res.status(200).json(result);
});

router.get("/search-customer", async function (req, res, next) {
  let result = false;
  let KeyWord = decodeURIComponent(req.query.keyWord);

  result = await searchCustomer(KeyWord);
  if (result.length === 0)
    return res.status(200).json({ message: "No result" });
  if (!result || result.length === 0)
    return res.status(500).json({ message: "Internal server error" });
  return res.status(200).json(result);
});

router.get("/search-bill", async function (req, res, next) {
  let result = false;
  let KeyWord = req.query.keyWord ? req.query.keyWord : "";

  result = await executeProcedure("SP_SEARCH_HOADON", [
    {
      name: "TUKHOA",
      type: sql.NVarChar,
      value: KeyWord,
    },
  ]);

  if (result.length === 0)
    return res.status(200).json({ message: "No result" });

  if (!result)
    return res.status(500).json({ message: "Internal server error" });
  return res.status(200).json(result);
});

////////////////////////////////////////////////////////////////////////////////////////
//* Test rồi
router.post("/new_dish", upload.none(), async function (req, res, next) {
  const dish = req.body;

  //& Sẽ bổ sung phần xác thực phân quyền cho chức năng này
  //& (admin mới có quyền thêm món trên toàn hệ thống)
  const result = await createNewDish(dish);

  if (!result || result.length === 0) {
    return res.status(500).json({ message: "Internal server error" });
  }
  return res.status(200).json(result);
});

//* Test rồi
router.post("/new_customer", upload.none(), async function (req, res, next) {
  let customer = req.body;

  if (customer["gender"] && customer["gender"].toUpperCase() === "MALE") {
    customer["isMale"] = 1;
  } else {
    customer["isMale"] = 0;
  }

  const result = await createNewCustomer(customer);

  if (!result || result.length === 0) {
    return res.status(500).json({ message: "Internal server error" });
  }
  return res.status(200).json(result);
});

//* Test rồi
router.post("/new_employee", upload.none(), async function (req, res, next) {
  let employee = req.body;
  //& Sẽ bổ sung phần xác thực phân quyền cho chức năng này
  employee.curBranch = req.query.CurBranch ? req.query.CurBranch : 1;

  const result = await createNewEmployee(employee);

  if (!result || result.length === 0) {
    return res.status(500).json({ message: "Internal server error" });
  }
  return res.status(200).json(result);
});

//* Test rồi
router.post(
  "/new_staff_transfer",
  upload.none(),
  async function (req, res, next) {
    let staffTransfer = req.body;

    //& Sẽ bổ sung phần xác thực phân quyền cho chức năng này
    staffTransfer.EmployeeID = req.query.EmployeeID ? req.query.EmployeeID : 1;

    const result = await createNewStaffTransfer(staffTransfer);

    if (!result || result.length === 0) {
      return res.status(500).json({ message: "Internal server error" });
    }
    return res.status(200).json(result);
  }
);

//! proc ở sql chạy được nhưng mà lên đây nó load mãi không ra -> chưa fix kịp
router.post("/new_membership", upload.none(), async function (req, res, next) {
  let customerID = req.query.CustomerID ? req.query.CustomerID : null;
  let MaThe = await queryDB(
    `SELECT TOP 1 MaThe FROM THETHANHVIEN ORDER BY MaThe DESC`
  );
  MaThe = parseInt(MaThe[0][""]) + 1;
  MaThe = MaThe.toString();

  let MaNV = req.query.EmployeeID ? req.query.EmployeeID : 1;

  let member = { mathe: MaThe, manv: MaNV, makh: customerID };

  if (!customerID)
    return res.status(400).json({ message: "Invalid Customer ID" });

  let result = await createNewMember(member);

  if (!result || result.length === 0)
    return res.status(500).json({ message: "Internal server error" });
});

router.post(
  "/add_dish_to_branch",
  upload.none(),
  async function (req, res, next) {
    let dishBranch = req.body;
    if (req.query.CurBranch == -1) {
      let staff = req.query.Staff;
      const branch = await queryDB(
        `SELECT CN_HienTai FROM NHANVIEN WHERE MaNV = ${staff}`
      );
      if (!branch || branch.length === 0)
        return res.status(500).json({ message: "Internal server error" });

      dishBranch.CurBranch = branch[0].CN_HienTai;
    } else {
      dishBranch.CurBranch = req.query.CurBranch;
    }

    //& Sẽ bổ sung phần xác thực phân quyền cho chức năng này

    const result = await addDishToBranch(dishBranch);

    if (!result || result.length === 0)
      return res.status(500).json({ message: "Internal server error" });

    return res.status(200).json(result);
  }
);

router.post("/new_order", upload.none(), async function (req, res, next) {
  let order = req.body;
  //& Sẽ bổ sung phần xác thực phân quyền cho chức năng này
  order.tableID = req.query.tableID ? parseInt(req.query.tableID) : null;
  order.isEatIn = order.tableID ? 1 : 0;
  order.curBranch = req.query.CurBranch ? req.query.CurBranch : 1; // just for testing

  console.log("order", order);
  const result = await createNewOrder(order);
  console.log("result", result);

  if (!result)
    return res.status(500).json({ message: "Internal server error" });

  return res.status(200).json(result);
});

router.delete("/delete_order", async function (req, res, next) {
  let MaHD = req.query.OrderID;
  console.log(MaHD);
  const result = await deleteOrder(MaHD);

  if (!result || result.length === 0)
    return res.status(500).json({ message: "Internal server error" });

  return res.status(200).json(result);
});

router.post(
  "/open_table_for_preorder",
  upload.none(),
  async function (req, res, next) {
    let MaBan = req.query.TableID;

    const response = await queryDB(
      `UPDATE BAN SET TinhTrang = 0, MaHD = NULL WHERE MaBan = ${MaBan}`
    );
    if (!response || response.length === 0)
      return res.status(500).json({ message: "Internal server error" });
    else return res.status(200).json(response);
  }
);

//! Chưa test
router.post("/checkout", async function (req, res, next) {
  let HoaDon = req.query.BillID;
  let MaThe = req.query.MemberID;
  if(MaThe == -1) {
    MaThe = null;
  }
  console.log(HoaDon, MaThe);

  const result = await checkout(HoaDon, MaThe);

  if (!result.success && result.message)
    return res.status(400).json({ message: result.message });
  else if (!result)
    return res.status(500).json({ message: "Internal server error" });

  return res.status(200).json(result);
});

router.post("/checkout-preorder", async function (req, res, next) {
  let MaBan = req.query.TableID;
  let ChiNhanh = req.query.CurBranch;


  const result = await checkoutForPreorder(MaBan, ChiNhanh);

  if (!result.success && result.message)
    return res.status(400).json({ message: result.message });
  else if (!result)
    return res.status(500).json({ message: "Internal server error" });

  return res.status(200).json(result);
});

router.delete("/delete_customer", async function (req, res, next) {
  let MaKH = req.query.CustomerID;

  const result = await deleteCustomer(MaKH);

  if (!result || result.length === 0)
    return res.status(500).json({ message: "Internal server error" });

  return res.status(200).json(result);
});

router.delete("/delete_dish", async function (req, res, next) {
  let MaMon = req.query.DishID;

  const result = await deleteDish(MaMon);

  if (!result || result.length === 0)
    return res.status(500).json({ message: "Internal server error" });

  return res.status(200).json(result);
});

////////////////////////////////////////////////////////////////////////////////////////
//^ Route dùng để test các chức năng mới
router.get("/testing", async function (req, res, next) {
  let result = false;
  result = await queryDB(
    "select mathe from thethanhvien where mathe = '041058'"
  );
  console.log(result);
  if (!result || result.length === 0) {
    return res.status(500).json({ message: "Internal server error" });
  }
  return res.status(200).json(result);
});

module.exports = router;
