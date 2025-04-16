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
                messages: [
                    {
                        role: "system",
                        content:
                            "Bạn là trợ lý chuyên về máy tính và linh kiện. Nếu không biết chắc một thông tin (ví dụ còn hàng hay không), hãy nói rõ là bạn không có dữ liệu thực tế nhưng vẫn trả lời dựa trên giả định hoặc hướng dẫn người dùng liên hệ thêm."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                temperature: 0.7
            },
            {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
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

const classifyReview = async (req, res) => {
    try {
        console.log("🚀 CLASSIFY REVIEW:", req.body);
        const content = req.body.content;

        if (!content) {
            return res.status(400).json({ error: "⚠️ Missing review content" });
        }

        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        "role": "system",
                        "content": `Bạn là chuyên gia đánh giá thái độ khách hàng thông qua phân tích các nhận xét về linh kiện máy tính. Bạn sẽ phân loại dựa trên các:
                            - Hài lòng: Nhận xét tích cực, khen ngợi về chất lượng/trải nghiệm
                            - Không hài lòng: Nhận xét tiêu cực, chê bai, phàn nàn
                            - Trung lập: Nhận xét không thể hiện rõ thái độ
                            - Vừa khen vừa chê: Vừa khen vừa chê trong cùng nhận xét
                            - Góp ý: Đưa ra đề xuất cải thiện
                            - Không xác định: Nhận xét không thể phân loại`
                    },
                    {
                        "role": "user",
                        "content": `Phân tích và phân loại mức độ hài lòng dựa trên nhận xét sau: "${content}". Chỉ đưa ra kết quả phân loại, không giải thích.`
                    }
                ],
                temperature: 0.7,
                max_tokens: 60
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
            res.status(500).json({ error: "❌ No classification result from GPT API" });
        }

    } catch (error) {
        console.error("❌ Error classifying review:", error.response?.data || error.message);
        res.status(500).json({
            error: "An error occurred while processing the classification request",
            details: error.response?.data || error.message
        });
    }
};
const generateDescription = async (req, res) => {
    try {
        const { specs } = req.body;

        if (!specs) {
            return res.status(400).json({ error: "⚠️ Vui lòng cung cấp thông số kỹ thuật (specs)" });
        }

        const prompt = `
        Bạn là một chuyên gia marketing. Viết mô tả sản phẩm chuyên nghiệp, chuẩn SEO, từ cấu hình máy sau: "${specs}". 
        Mô tả rõ hiệu suất, đối tượng sử dụng phù hợp, và nhấn mạnh ưu điểm.
        Chỉ viết phần mô tả, không viết giới thiệu hay tiêu đề.
        `;

        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: prompt }],
                temperature: 0.7,
            },
            {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    "Content-Type": "application/json",
                },
            }
        );

        const reply = response.data.choices[0]?.message?.content;
        res.json({ description: reply.trim() });

    } catch (error) {
        console.error("❌ Lỗi GPT:", error.response?.data || error.message);
        res.status(500).json({ error: "Không thể tạo mô tả sản phẩm", details: error.message });
    }
};
module.exports = { generateContent, classifyReview, generateDescription };
