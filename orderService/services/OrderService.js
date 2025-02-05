const Order = require('../models/Order');

// Get all orders
exports.getAllOrders = async () => {
    try {
        const orders = await Order.findAll();
        return orders;
    } catch (error) {
        throw new Error('Error fetching orders');
    }
};

// Get order by ID
exports.getOrderById = async (orderId) => {
    try {
        const order = await Order.findByPk(orderId);
        if (!order) {
            throw new Error('Order not found');
        }
        return order;
    } catch (error) {
        throw new Error('Error fetching order');
    }
};

// Get orders by user ID
exports.getOrderByUserId = async (userId) => {
    try {
        const orders = await Order.findAll({
            where: { user_id: userId }
        });
        return orders;
    } catch (error) {
        throw new Error('Error fetching orders for user');
    }
};

exports.createOrder = async (orderData) => {
    try {
        const order = await Order.create(orderData);
        return order;
    } catch (error) {
        return { error: error.message };
    }
};


// Update an existing order
exports.updateOrder = async (orderId, orderData) => {
    try {
        const order = await Order.findByPk(orderId);
        if (!order) {
            throw new Error('Order not found');
        }
        await order.update(orderData);
        return order;
    } catch (error) {
        throw new Error('Error updating order');
    }
};

// Delete an order
exports.deleteOrder = async (orderId) => {
    try {
        const order = await Order.findByPk(orderId);
        if (!order) {
            throw new Error('Order not found');
        }
        await order.destroy();
        return { message: 'Order deleted successfully' };
    } catch (error) {
        throw new Error('Error deleting order');
    }
};

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

exports.sendEmail = async (to, subject, templateName, context) => {
    const filePath = path.join(__dirname, templateName);
    const source = fs.readFileSync(filePath, 'utf-8');
    const template = handlebars.compile(source);
    const html = template(context);

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        html,
    };

    await transporter.sendMail(mailOptions);
};
