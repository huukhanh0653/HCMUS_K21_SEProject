const { queryDB } = require("./queryDB");
const { sql, poolPromise } = require("./dbConfig");

async function createNewDish(dish) {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("name", sql.NVarChar(255), dish.dishName)
      .input("category", sql.NVarChar(255), dish.category)
      .input("price", sql.Int, dish.price)
      .input("image", sql.NVarChar(200), dish.image)
      .execute("SP_CREATE_DISH");
    return result.recordset ? result.recordset : result;
  } catch (error) {
    console.error("Error creating new dish:", error);
    throw error;
  }
}

async function createNewCustomer(customer) {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("HOTEN", sql.NVarChar(255), customer.fullName)
      .input("SDT", sql.NVarChar(255), customer.phoneNumber)
      .input("CCCD", sql.NVarChar(255), customer.ssn)
      .input("ISMALE", sql.Bit, customer.isMale)
      .input("EMAIL", sql.NVarChar(255), customer.email)
      .execute("SP_CREATE_CUSTOMER");
    return result.recordset ? result.recordset : result;
  } catch (error) {
    console.error("Error creating new customer:", error);
    throw error;
  }
}

async function createNewEmployee(employee) {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("HOTEN", sql.NVarChar(255), employee.fullName)
      .input("NGAYSINH", sql.Date, employee.dob)
      .input("NGAYVAOLAM", sql.Date, employee.startDate)
      .input("CN_HIENTAI", sql.NVarChar(2), employee.curBranch)
      .input("MABP", sql.Int, employee.dept)
      .execute("SP_CREATE_EMPLOYEE");
    return result.recordset ? result.recordset : result;
  } catch (error) {
    console.error("Error creating new employee:", error);
    throw error;
  }
}

async function createNewStaffTransfer(staffTransfer) {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("MANV", sql.Int, staffTransfer.id)
      .input("TO_CN", sql.NVarChar(2), staffTransfer.newBranch)
      .execute("SP_CREATE_STAFF_TRANSFER");
    return result.recordset ? result.recordset : result;
  } catch (error) {
    console.error("Error creating new staff transfer:", error);
    // throw error;
    return error;
  }
}

async function createNewMember(member) {
  try {
    if (!member.mathe || !member.manv || !member.makh) {
      throw new Error("Missing required member properties");
    }
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("MATHE", sql.Char(6), member.mathe)
      .input("MANV", sql.Int, member.manv)
      .input("MAKH", sql.Int, member.makh)
      .execute("SP_CREATE_MEMBER");
    return result.recordset ? result.recordset : result;
  } catch (error) {
    console.error("Error creating new member:", error);
    throw error;
  }
}

async function addDishToBranch(dishBranch) {
  try {
    console.log(dishBranch);
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("MAMON", sql.Int, dishBranch.DishID)
      .input("MACN", sql.NVarChar(2), dishBranch.CurBranch)
      .execute("SP_ADD_DISH_TO_BRANCH");
    return result.recordset ? result.recordset : result;
  } catch (error) {
    console.error("Error adding dish to branch:", error);
    throw error;
  }
}

async function createNewOrderDetail(orderDetail) {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("MAPHIEU", sql.Int, orderDetail.mapheu)
      .input("MAMON", sql.Int, orderDetail.mamon)
      .input("SL", sql.Int, orderDetail.soluong)
      .execute("SP_CREATE_CHONMON");
    return result;
  } catch (error) {
    console.error("Error creating new order detail:", error);
    throw error;
  }
}

async function createNewOrder(order) {
  try {
    const pool = await poolPromise;
    let _order = order;
    let success = true;
    let query = "";
    let isOpenTable = false;  //^ Kiểm tra bàn đã mở chưa

    //^ Kiểm tra hóa đơn đã tồn tại chưa
    if (!order.MaHD) {
      let MaHD = await queryDB("SELECT ISNULL(MAX(MAHD), 0) + 1 FROM HOADON");
      MaHD = MaHD[0][""];
      _order.MaHD = MaHD;

      //^ Tạo hóa đơn mới
      query = `SET IDENTITY_INSERT HOADON ON; 
    INSERT INTO HOADON (MAHD, NGAYLAP, ISEATIN, MACN, TONGHOADON) 
    VALUES (${MaHD}, GETDATE(), ${_order.isEatIn}, '${_order.curBranch}', 0); 
    SET IDENTITY_INSERT HOADON OFF;`;
      let rs = await pool.request().query(query);
      if (rs.rowsAffected[0] === 0) {
        queryDB(`DELETE FROM HOADON WHERE MAHD = ${_order.MaHD}`);
        return false;
      }
      isOpenTable = true;
    }

    //^ Lấy mã phiếu mới
    query = "SELECT ISNULL(MAX(MAPHIEU), 0) + 1 FROM PHIEUDATMON";
    let rs = await pool.request().query(query);
    let MaPhieu = rs.recordset[0][""];

    //^ Tạo phiếu đặt món
    query = `SET IDENTITY_INSERT PHIEUDATMON ON;
    INSERT INTO PHIEUDATMON (MAPHIEU, NGAYLAP, MABAN, MANV, MAHD)
    VALUES (${MaPhieu}, GETDATE(), ${_order.tableID}, ${_order.createdBy}, ${_order.MaHD});
    SET IDENTITY_INSERT PHIEUDATMON OFF;`;
    rs = await pool.request().query(query);
    if (rs.rowsAffected[0] === 0) {
      queryDB(`DELETE FROM PHIEUDATMON WHERE MAPHIEU = ${MaPhieu}`);
      return false;
    }

    //^ Thêm món vào bảng chọn món
    query = `INSERT INTO CHONMON (MAPHIEU, MAMON, SOLUONG, TRAMON) VALUES `;
    for (let i = 0; i < _order.data.length; i++) {
      query += `(${MaPhieu}, ${_order.data[i].dishID}, ${_order.data[i].quantity}, 0), `;
    }
    rs = await pool.request().query(query.slice(0, -2));
    if (rs.rowsAffected[0] === 0) {
      queryDB(`DELETE FROM CHONMON WHERE MAPHIEU = ${MaPhieu}`);
      return false;
    }
    console.log(_order.isEatIn, _order.MaHD, order.MaHD);
    //^ Cập nhật trạng thái bàn
    if (_order.isEatIn === 1 && isOpenTable) {
      console.log("Updating table status");
      query = 
      `UPDATE BAN SET TinhTrang = 0 WHERE MaBan = ${_order.tableID}
       UPDATE BAN SET MaHD = ${_order.MaHD} WHERE MaBan = ${_order.tableID}`;
      rs = await pool.request().query(query);
      if (rs.rowsAffected[0] === 0) success = false;
    }

    if (success) return { MaHD: _order.MaHD, MaPhieu: MaPhieu };
    else {
      return false;
    }
  } catch (error) {
    console.error("Error creating new order:", error);
    throw error;
  }
}

async function checkout(MaHoaDon, MaThe) {
  try {
    console.log("Checking out");
    const pool = await poolPromise;
    let query = `SELECT 1 FROM THETHANHVIEN WHERE MaThe = '${MaThe}' AND IsActive = 1`;
    let rs = await queryDB(query);
    if(rs.length === 0) {
      console.log("Card not found");
    }
    console.log(rs);
    console.log("Checking if table exists");


    const result = await pool.
                  request(). 
                  input("MaHD", sql.Int, MaHoaDon).
                  input("MaThe", sql.Char(8), MaThe).
                  execute("SP_CHECKOUT");

    if (result.rowsAffected[0] === 0) {
      return { success: false, message: "Thanh toán thất bại" };
    }
    console.log("Checked out");
    return { success: true, message: "Thanh toán thành công" };
  } catch (error) {
    console.error("Error checking out:", error);
    throw error;
  }
}

async function checkoutForPreorder(MaBan, ChiNhanh) {
  try {

    const pool = await poolPromise;
    let query = `SELECT 1 FROM BAN WHERE MaBan = ${MaBan} AND MaCN = '${ChiNhanh}' AND TinhTrang = 0`;
    let rs = await queryDB(query);
    if(rs.length === 0) {
      console.log("Table not found");
    }

    query = `UPDATE BAN SET TinhTrang = 1 WHERE MaBan = ${MaBan} AND MaCN = '${ChiNhanh}'`;
    rs = await queryDB(query);
    if(rs.rowsAffected[0] === 0) {
      console.log("Table not updated");
    }
    else {
      return { success: true, message: "Thanh toán thành công" };
    }
    return { success: true, message: "Thanh toán thành công" };
  } catch (error) {
    console.error("Error checking out:", error);
    throw error;
  }
}

async function deleteOrder(MaPhieu) {
  try {
    console.log(MaPhieu)
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("MAPHIEU", sql.Int, MaPhieu)
      .execute("SP_DELETE_ORDER");
    return result;
  } catch (error) {
    console.error("Error deleting order:", error);
    throw error;
  }
}

async function deleteCustomer(MaKH) {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("MAKH", sql.Int, MaKH)
      .execute("SP_DELETE_CUSTOMER");
    return result;
  } catch (error) {
    console.error("Error deleting customer:", error);
    throw error;
  }
}

async function deleteDish(mamon) {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("MAMON", sql.Int, mamon)
      .execute("SP_DELETE_DISH");
    return result;
  } catch (error) {
    console.error("Error deleting dish:", error);
    throw error;
  }
}

module.exports = {
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
};
