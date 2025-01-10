const express = require('express');
const app = express();
const PORT = 6868;

// Import và sử dụng middleware
require('./middlewares/proxy')(app);

app.get('/', (req, res) => {
    res.send('API Gateway đang hoạt động');
});

app.listen(PORT, () => {
    console.log(`API Gateway đang chạy tại cổng ${PORT}`);
});
