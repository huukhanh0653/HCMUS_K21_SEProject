import axios from "axios";
// Base URL của STORAGE SERVICE API
import { Storage_API } from "../../apiConfig";

/**
 * Upload file lên Storage API.
 * @param {File} file - Đối tượng File cần upload.
 * @returns {Promise} - Promise trả về dữ liệu từ API.
 */
export const uploadFile = async (file) => {
    // Tạo đối tượng FormData và thêm file với key "file"
    const formData = new FormData();
    formData.append("file", file);
  
    try {
        const response = await axios.post(
            `${Storage_API}/api/storage/upload`,
            formData,
            {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            }
        );
        // Response dạng chuỗi ví dụ: "File uploaded successfully: https://storage.googleapis.com/discord_clone/your-file-name.png"
        const message = response.data;
        console.log(message)
        const prefix = "File uploaded successfully: ";
        const url = message.startsWith(prefix)
            ? message.replace(prefix, "").trim()
            : message;
        console.log("Uploaded file URL:", url);
        return { url };
    } catch (error) {
        console.error("Error uploading file:", error);
        throw error;
    }
};

const StorageService = {
  uploadFile,
};

export default StorageService;
