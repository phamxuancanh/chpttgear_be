const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.error("⚠️ Vui lòng thiết lập biến môi trường GEMINI_API_KEY trong file .env");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

const generateContent = async (req, res) => {
    try {
        console.log("🚀CHAY VAO ", req.body);
        const prompt = req.body.prompt;
        if (!prompt) {
            return res.status(400).json({ error: "⚠️ Thiếu nội dung prompt" });
        }

        const result = await model.generateContent(prompt);
        const response = result.response;

        if (response && response.text()) {
            res.json({ result: response.text() });
        } else {
            res.status(500).json({ error: "❌ Không có kết quả trả về từ Gemini API" });
        }
    } catch (error) {
        console.error("❌ Lỗi khi gọi Gemini API:", error);
        res.status(500).json({ error: "Đã xảy ra lỗi khi xử lý yêu cầu", details: error.message });
    }
};

module.exports = { generateContent };
