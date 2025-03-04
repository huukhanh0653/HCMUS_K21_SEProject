const { queryDB } = require("./queryDB");
const { sql, poolPromise } = require("./dbConfig");
const schedule = require('node-schedule');

// async function updateTheThanhVien() {
//     try {
//         console.log('Updating Membership ranks...');
//         const pool = await poolPromise;
//         const result = await pool
//           .request()
//           .execute("sp_UpdateMembershipRanks");
//         console.log(result);
//     } catch (err) {
//         console.error('SQL error', err);
//     }
// }

// // Schedule the function to run every 30 seconds
// schedule.scheduleJob('*/30 * * * * *', function() {
//     updateTheThanhVien();
// });

// Schedule the function to run every 24 hours
// schedule.scheduleJob('0 0 * * *', function() {
//     updateTheThanhVien();
// });

