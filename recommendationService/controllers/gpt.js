const axios = require("axios");
require("dotenv").config();

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
    console.error("⚠️ Vui lòng thiết lập biến môi trường OPENAI_API_KEY trong file .env");
    process.exit(1);
}

const generateContent = async (req, res) => {
    try {
        console.log("🚀 CHẠY VÀO GPT:", req.body);
        const prompt = req.body.prompt;

        if (!prompt) {
            return res.status(400).json({ error: "⚠️ Thiếu nội dung prompt" });
        }

        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: prompt }],
                temperature: 0.7
            },
            {
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                    "Content-Type": "application/json"
                }
            }
        );

        const reply = response.data.choices[0]?.message?.content;

        if (reply) {
            res.json({ result: reply });
        } else {
            res.status(500).json({ error: "❌ Không có kết quả trả về từ GPT API" });
        }

    } catch (error) {
        console.error("❌ Lỗi khi gọi GPT API:", error.response?.data || error.message);
        res.status(500).json({
            error: "Đã xảy ra lỗi khi xử lý yêu cầu",
            details: error.response?.data || error.message
        });
    }
};

module.exports = { generateContent };
