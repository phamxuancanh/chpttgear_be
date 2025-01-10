require('dotenv').config();
const { Sequelize } = require('sequelize');
const { Client } = require('pg');

// Hàm tạo cơ sở dữ liệu nếu chưa tồn tại
const createDatabaseIfNotExists = async () => {
    const { DB_NAME, DB_USER, DB_PASS, DB_HOST, DB_PORT } = process.env;

    try {
        // Kết nối đến cơ sở dữ liệu mặc định (postgres)
        const client = new Client({
            host: DB_HOST,
            user: DB_USER,
            password: DB_PASS,
            port: DB_PORT,
            database: 'postgres', // Kết nối tới cơ sở dữ liệu mặc định
            ssl: {
                rejectUnauthorized: false, // Thiết lập này chỉ nên dùng cho môi trường phát triển
            },
        });

        await client.connect();

        // Kiểm tra và tạo cơ sở dữ liệu nếu chưa tồn tại
        const result = await client.query(`SELECT 1 FROM pg_database WHERE datname = '${DB_NAME}'`);
        if (result.rowCount === 0) {
            await client.query(`CREATE DATABASE "${DB_NAME}";`);
            console.log(`Database "${DB_NAME}" has been created.`);
        } else {
            console.log(`Database "${DB_NAME}" already exists.`);
        }

        await client.end();
    } catch (error) {
        console.error('Unable to create the database:', error.message);
        throw error; // Ném lỗi để xử lý nếu cần
    }
};

// Hàm khởi tạo Sequelize
const initializeSequelize = () => {
    const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
        host: process.env.DB_HOST,
        dialect: 'postgres',
        port: process.env.DB_PORT,
        logging: console.log, // Hiển thị log các câu SQL (có thể tắt nếu không cần)
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false, // Thiết lập này chỉ nên dùng cho môi trường phát triển
            },
        },
    });

    return sequelize;
};

// Thực hiện kiểm tra và khởi tạo cơ sở dữ liệu
(async () => {
    await createDatabaseIfNotExists();
})();

const sequelize = initializeSequelize();

module.exports = sequelize;
