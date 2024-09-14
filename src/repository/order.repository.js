// ** Model
import Order from '../models/order.js';

// ** Constant
import { ORDER_STATUS } from '../constants/model.constant.js';

const orderRepository = {
    async create(order) {
        return await Order.create(order);
    },

    async findOneBy(query) {
        return await Order.findOne(query);
    },

    async findBy(query) {
        return await Order.find(query);
    },

    async orderPagination(query, skip, size) {
        return await Order.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(size);
    },

    async findByCode(code) {
        const order = await Order.findOne({ code });
        if (!order) throw new Error(`Không tìm thấy đơn hàng ${code}`);
        return order;
    },

    async update(id, order) {
        return await Order.findByIdAndUpdate(id, order, { new: true });
    },

    async cancelOrder(id) {
        return await Order.findByIdAndUpdate(id, { status: ORDER_STATUS.CANCELLED }, { new: true });
    },

    async totalDocuments(query) {
        return await Order.countDocuments(query);
    },

    async updateStatus(code, query) {
        return await Order.findOneAndUpdate(
            { code },
            { $set: query },
            { new: true, upsert: true }
        );
    }
};

export default orderRepository;