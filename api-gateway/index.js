const express = require('express');
const app = express();
const PORT = 6868;
const cors = require('cors');
require('./middlewares/proxy')(app);

app.use(cors({ origin: '*', credentials: true }));
app.get('/', (req, res) => {
    res.send('API Gateway đang hoạt động');
});

app.listen(PORT, () => {
    console.log(`API Gateway đang chạy tại cổng ${PORT}`);
});
