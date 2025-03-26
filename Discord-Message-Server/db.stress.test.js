const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

// 👉 MongoDB URI (mongos IP và port bạn mở)
const MONGO_URI =
  "mongodb://35.225.51.17:27117/message_service?directConnection=true&tls=false";

// 👉 Thông tin mặc định để generate
const TEST_SERVER_ID = "stress-server-001";
const TEST_CHANNEL_ID = "stress-channel-001";
const SENDER_ID = "stress-user-001";

// 👉 Kết nối tới Mongo
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ Connected to MongoDB");
    startStressTest();
  })
  .catch((err) => {
    console.error("❌ Connection error:", err);
  });

// 👉 Schema tương ứng
const MessageSchema = new mongoose.Schema({
  server_id: { type: String, required: true },
  message_id: { type: String, required: true, unique: true },
  channel_id: { type: String, required: true },
  sender_id: { type: String, required: true },
  content: { type: String, required: true },
  attachments: [{ type: String }],
  timestamp: { type: Date, default: Date.now },
  edited: { type: Boolean, default: false },
  deleted: { type: Boolean, default: false },
});

const Message = mongoose.model("Message", MessageSchema);

// 👉 Hàm tạo 1 message ngẫu nhiên
const generateMessage = () => ({
  server_id: TEST_SERVER_ID,
  message_id: uuidv4(),
  channel_id: TEST_CHANNEL_ID,
  sender_id: SENDER_ID,
  content: "Stress test message at " + new Date().toISOString(),
  attachments: [],
  timestamp: new Date(),
  edited: false,
  deleted: false,
});

// 👉 Hàm chạy stress test
const startStressTest = async () => {
  const total = 10000; // 👈 Số lượng message
  console.time("Insert Time");

  const bulk = [];
  for (let i = 0; i < total; i++) {
    bulk.push(generateMessage());
    if (bulk.length === 1000) {
      await Message.insertMany(bulk);
      console.log(`✅ Inserted ${i + 1}/${total}`);
      bulk.length = 0;
    }
  }

  if (bulk.length > 0) {
    await Message.insertMany(bulk);
    console.log(`✅ Inserted ${total}`);
  }

  console.timeEnd("Insert Time");
  mongoose.disconnect();
};
