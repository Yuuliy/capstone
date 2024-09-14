// ** Repository
import orderRepository from '../repository/order.repository.js';
import accountRepository from '../repository/account.repository.js';
import voucherRepository from '../repository/voucher.repository.js';
import productRepository from '../repository/product.repository.js';
import cartRepository from '../repository/cart.repository.js';

// ** Helper
import googleHelper from '../helper/google.helper.js';
import esgoHelper from '../helper/esgo.helper.js'
import ghtkHelper from '../helper/ghtk.helper.js';

// ** Constants
import { ORDER_STATUS } from '../constants/model.constant.js';
import { CANCEL_REASON, PAYMENT_METHOD } from '../constants/order.constant.js';
import { sortOptions } from "../constants/query.constant.js";
import { shopAddress } from '../helper/ghtk.helper.js';

// ** Services
import productService from './product.service.js';
import guestService from './guest.service.js';
import accountService from './account.service.js';
import userService from './user.service.js';
import emailForm from '../utils/mailForm.js';
import paymentService from './payment.service.js';

export const TIME_TYPE = {
    WEEK: 'WEEK',
    YEAR: 'YEAR',
    DAY: 'DAY',
}

const orderService = {
    createOrder: async ({
        receiverName,
        receiverPhone,
        deliveryAddressId,
        discountValue, // Optional
        voucherCode,
        paymentMethod,
        // deliveryTime,
        items,
        shipping,
        totalPrice
    }, accountId) => {
        const account = await accountRepository.findById(accountId);

        const accountDeliveryAddress = account.user.deliveryAddress.find(address => address._id == deliveryAddressId);

        const code = Math.random().toString(36).slice(2, 12);

        const order = {
            code: code.toLocaleUpperCase(),
            receiverName,
            receiverPhone,
            deliveryAddress: {
                id: accountDeliveryAddress._id,
                address: accountDeliveryAddress.address,
                province: accountDeliveryAddress.province.provinceName,
                district: accountDeliveryAddress.district.districtName,
                ward: accountDeliveryAddress.ward.wardName,
            },
            discountValue,
            items,
            shipping,
            totalPrice
        };

        if (paymentMethod === PAYMENT_METHOD.COD) {
            if (account.user.prestige < 50) throw new Error('Bạn không thể chọn thanh toán COD vì điểm uy tín của bạn thấp hơn 50');
            order.payment = {
                method: PAYMENT_METHOD.COD,
            };
        } else {
            order.payment = {
                method: PAYMENT_METHOD.VNPAY,
                paid: false,
                refunded: false,
            };
        }

        if (!account) throw new Error('Không tìm thấy tài khoản');
        order.account = accountId;
        order.email = account.email;

        if (voucherCode) {
            const userVocher = account.user.personalVoucher;
            const voucher = userVocher.find(voucher => voucher.voucher.code === voucherCode);
            if (!voucher) throw new Error(`Không tìm thấy voucher ${voucherCode} trong ví của bạn`);
            if (voucher.voucher.expiredDate < Date.now()) throw new Error('Voucher đã hết hạn');
            voucher.isUsed = true;
            await account.user.save();
            order.voucherCode = voucher.voucher.code;
        };

        const result = await orderRepository.create(order);

        const cart = await cartRepository.findCartByAccount(accountId);

        for (const item of items) {
            //     const product = await productRepository.findByCode(item.productCode);
            //     const sizeMetric = product.colourVariant.sizeMetrics.find((size) => size.size === item.size);
            //     if (sizeMetric.quantity < item.quantity) throw new Error('Not enough quantity');
            //     sizeMetric.quantity -= item.quantity;
            //     await product.save();
            const itemIndex = cart.items.findIndex(cartItem => cartItem.productCode === item.productCode && cartItem.size === item.size);

            if (itemIndex !== -1) {
                cart.items.splice(itemIndex, 1);
                cart.totalPrice -= item.price * item.quantity;
            }
        }

        cart.save();

        return await orderService.formatOrderResult(result);
    },

    createGuestOrder: async ({
        receiverName,
        receiverPhone,
        deliveryAddress,
        email,
        paymentMethod,
        items,
        shipping,
        totalPrice
    }) => {
        const code = Math.random().toString(36).slice(2, 12);

        const guest = await guestService.findByPhone(receiverPhone);


        const order = {
            code: code.toLocaleUpperCase(),
            receiverName,
            receiverPhone,
            deliveryAddress,
            email,
            items,
            shipping,
            totalPrice
        };

        if (paymentMethod === PAYMENT_METHOD.COD) {
            if (guest && guest.prestige < 50) throw new Error('Bạn không thể chọn thanh toán COD bằng số điện thoại này vì bạn đã không nhận hàng quá nhiều lần');
            order.payment = {
                method: PAYMENT_METHOD.COD,
            };
        } else {
            order.payment = {
                method: PAYMENT_METHOD.VNPAY,
                paid: false,
                refunded: false,
            };
        }

        const result = await orderRepository.create(order);

        // for (const item of items) {
        //     const product = await productRepository.findByCode(item.productCode);
        //     const sizeMetric = product.colourVariant.sizeMetrics.find((size) => size.size === item.size);
        //     if (sizeMetric.quantity < item.quantity) throw new Error('Not enough quantity');
        //     sizeMetric.quantity -= item.quantity;
        //     await product.save();
        // }

        const message = await emailForm.newOrder(order);

        await googleHelper.sendEmail(email, 'Thanks for your order', message);

        return await orderService.formatOrderResult(result);
    },

    formatOrderResult: async (order) => {
        const items = order.items.map((item) => {
            return {
                displayName: item.displayName,
                productCode: item.productCode,
                image: item.image,
                price: item.price,
                size: item.size,
                quantity: item.quantity
            };
        });

        return {
            code: order.code ? order.code : '',
            items,
            accountId: order.account,
            email: order.email,
            receiverName: order.receiverName,
            receiverPhone: order.receiverPhone,
            deliveryAddress: {
                id: order.deliveryAddress.id ? order.deliveryAddress.id : '',
                address: order.deliveryAddress.address,
                province: order.deliveryAddress.province,
                district: order.deliveryAddress.district,
                ward: order.deliveryAddress.ward,
                isEdited: order.deliveryAddress.isEdited
            },
            discountValue: order.discountValue,
            payment: order.payment,
            shipping: order.shipping,
            totalPrice: order.totalPrice,
            status: order.status,
            cancelReason: order.cancelReason,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
            approvedBy: order.approvedBy,
            canceledBy: order.canceledBy,
        };
    },

    getMyOrder: async (accountId, page, size, code, status) => {
        const skip = (page - 1) * size;

        const query = {
            account: accountId,
        }

        if (code) query.code = code;
        if (status) query.status = status;

        const orders = await orderRepository.orderPagination(query, skip, size);

        const totalDocuments = await orderRepository.totalDocuments(query);

        const totalPage = Math.ceil(totalDocuments / size);

        const result = await Promise.all(orders.map(async (order) => {
            return await orderService.formatOrderResult(order);
        }));

        return {
            orders: result,
            totalPage,
            totalDocuments
        };
    },

    getAllOrder: async (page, size, code, status, address, payment, priceSort, startDate, endDate) => {
        const skip = (page - 1) * size;

        const query = {};

        const parsedStartDate = parseInt(startDate);
        const parsedEndDate = parseInt(endDate);

        if (!isNaN(parsedStartDate) && !isNaN(parsedEndDate)) {
            query.createdAt = {
                $gte: new Date(parsedStartDate),
                $lte: new Date(parsedEndDate)
            };
        } else if (!isNaN(parsedStartDate)) {
            query.createdAt = { $gte: new Date(parsedStartDate) };
        } else if (!isNaN(parsedEndDate)) {
            query.createdAt = { $lte: new Date(parsedEndDate) };
        }

        if (address) {
            const regex = new RegExp(address, 'ui');
            const addressQuery = {
                $or: [
                    { 'deliveryAddress.address': regex },
                    { 'deliveryAddress.province': regex },
                    { 'deliveryAddress.district': regex },
                    { 'deliveryAddress.ward': regex },
                ],
            };
            query.$and = [addressQuery];
        }
        if (code) query.code = code;
        if (status) query.status = status;
        if (payment) query['payment.method'] = payment;

        const sort = {}

        if (priceSort === sortOptions.ASC) {
            sort.totalPrice = 1;
        } else if (priceSort === sortOptions.DESC) {
            sort.totalPrice = -1;
        }

        const orders = await orderRepository.orderPagination(query, skip, size);

        const totalDocuments = await orderRepository.totalDocuments(query);

        const totalPage = Math.ceil(totalDocuments / size);

        const result = await Promise.all(orders.map(async (order) => {
            return await orderService.formatOrderResult(order);
        }));

        return {
            orders: result,
            totalPage,
            totalDocuments
        };
    },

    getOrderDetail: async (code) => {
        const order = await orderRepository.findByCode(code);
        return await orderService.formatOrderResult(order);
    },

    changeDeliveryAddress: async (accountId, {
        orderCode,
        deliveryAddressId,
        shippingFee
    }) => {
        const order = await orderRepository.findOneBy({
            code: orderCode,
            account: accountId
        });

        if (!order) throw new Error('Đơn hàng này không thuộc về bạn');
        if (order.deliveryAddress.isEdited) throw new Error('Bạn chỉ có thể thay đổi địa chỉ giao hàng 1 lần');

        const account = await accountRepository.findById(accountId);

        const accountDeliveryAddress = account.user.deliveryAddress.find(address => address._id == deliveryAddressId);

        order.deliveryAddress = {
            id: accountDeliveryAddress._id,
            address: accountDeliveryAddress.address,
            province: accountDeliveryAddress.province.provinceName,
            district: accountDeliveryAddress.district.districtName,
            ward: accountDeliveryAddress.ward.wardName,
            isEdited: true
        };

        order.shipping.fee = shippingFee;

        await order.save();

        return await orderService.formatOrderResult(order);
    },

    cancelOrder: async (accountId, code, reason, vnp_IpAddr) => {
        const order = await orderRepository.findOneBy({
            code,
            account: accountId
        });

        if (!order) throw new Error('Đơn hàng này không thuộc về bạn');

        if (order.status !== ORDER_STATUS.PENDING) throw new Error('Đơn hàng này không thể hủy');

        order.status = ORDER_STATUS.CANCELLED;
        order.cancelReason = reason;
        order.canceledBy = 'Khách hàng';

        await order.save();

        // request refund
        if (order.payment.method == 'VNPAY' && order.payment.paid === true) await paymentService.refund(vnp_IpAddr, code, 'Customer');

        return await orderService.formatOrderResult(order);
    },

    postOrder: async (orderCode, accountId) => {
        const account = await accountRepository.findById(accountId);
        const order = await orderRepository.findByCode(orderCode);

        const productFormat = await Promise.all(order.items.map(async (item) => {
            return {
                name: item.displayName,
                quantity: item.quantity,
                weight: 0.25
            };
        }));

        const orderFormat = {
            products: productFormat,
            order: {
                id: order.code,
                pick_name: shopAddress.pickName,
                pick_money: order.payment.method === 'COD' ? parseInt(order.totalPrice) : 0,
                pick_address: shopAddress.pickAddress,
                pick_province: shopAddress.province,
                pick_district: shopAddress.district,
                pick_tel: shopAddress.pickTel,
                name: order.receiverName,
                address: order.deliveryAddress.address,
                province: order.deliveryAddress.province,
                district: order.deliveryAddress.district,
                ward: order.deliveryAddress.ward,
                hamlet: shopAddress.defaultHamlet,
                tel: order.receiverPhone,
                email: order.email,
                value: order.totalPrice,
                deliver_option: order.shipping.shippingMethod ? 'xteam' : 'none',
            }
        }
        const orderResult = await ghtkHelper.postOrder(orderFormat);

        for (const item of order.items) {
            const product = await productRepository.findByCode(item.productCode);
            const sizeMetric = product.colourVariant.sizeMetrics.find((size) => size.size === item.size);
            if (sizeMetric.quantity < item.quantity) throw new Error('Không đủ số lượng sản phẩm');
            sizeMetric.quantity -= item.quantity;
            await product.save();
        }

        order.status = ORDER_STATUS.PROCESSING;
        order.shipping.shippingId = orderResult.order.label;
        order.approvedBy = account.username;

        await order.save();

        return orderResult;
    },

    getAllVnProvinces: async (name) => {
        const provinces = await esgoHelper.getPublicProvinces();
        if (name) {
            const regex = new RegExp(name, 'ui');
            return provinces.filter(province => regex.test(province.name));
        }
        return provinces;
    },

    getDistrictOfProvince: async (provinceId, name) => {
        const districts = await esgoHelper.getDistricOfProvince(provinceId);
        if (name) {
            const regex = new RegExp(name, 'ui');
            return districts.filter(district => regex.test(district.name));
        }
        return districts;
    },

    getWardOfDistrict: async (districtId, name) => {
        const wards = await esgoHelper.getWardOfDistrict(districtId);
        if (name) {
            const regex = new RegExp(name, 'ui');
            return wards.filter(ward => regex.test(ward.name));
        }
        return wards;
    },

    getShippingFee: async (address) => {
        const fee = await ghtkHelper.getShippinngFee(address);
        return fee;
    },

    getRevenueDashboard: async ({
        type,
        startDate,
        endDate
    }) => {
        const parsedStartDate = parseInt(startDate);
        const parsedEndDate = parseInt(endDate);
        let result = [];
        switch (type) {
            case TIME_TYPE.WEEK:
                result = await orderService.getRevenueByWeek(parsedStartDate, parsedEndDate);
                break;
            case TIME_TYPE.YEAR:
                result = await orderService.getRevenueByYear(parsedStartDate, parsedEndDate);
                break;
            case TIME_TYPE.DAY:
                result = await orderService.getRevenueByDay(parsedStartDate, parsedEndDate);
                break;
        }
        return result;
    },

    getRevenueByWeek: async (startDate, endDate) => {
        const orders = await orderRepository.findBy({
            status: ORDER_STATUS.DELIVERED,
            createdAt: {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            }
        });

        const dailyRevenue = Array(7).fill(0);

        orders.forEach(order => {
            const dayOfWeek = (new Date(order.createdAt).getDay() + 6) % 7;
            dailyRevenue[dayOfWeek] += order.totalPrice;
        });

        const totalRevenue = dailyRevenue.reduce((total, revenue) => total + revenue, 0);
        return {
            dashboard: dailyRevenue,
            total: totalRevenue
        };
    },


    getRevenueByYear: async (startDate, endDate) => {
        const orders = await orderRepository.findBy({
            status: ORDER_STATUS.DELIVERED,
            createdAt: {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            }
        });

        const monthlyRevenue = Array(12).fill(0);

        orders.forEach(order => {
            const month = new Date(order.createdAt).getMonth();
            monthlyRevenue[month] += order.totalPrice;
        });

        const totalRevenue = monthlyRevenue.reduce((total, revenue) => total + revenue, 0);

        return {
            dashboard: monthlyRevenue,
            total: totalRevenue
        };
    },

    getRevenueByDay: async (startDate, endDate) => {
        const orders = await orderRepository.findBy({
            status: ORDER_STATUS.DELIVERED,
            createdAt: {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            }
        });

        const daysCount = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

        const dailyRevenue = Array(daysCount).fill(0);

        orders.forEach(order => {
            const orderDate = new Date(order.createdAt).getTime();
            const diffTime = Math.floor((orderDate - startDate) / (1000 * 60 * 60 * 24));
            dailyRevenue[diffTime] += order.totalPrice;
        });

        const totalRevenue = dailyRevenue.reduce((total, revenue) => total + revenue, 0);

        return {
            dashboard: dailyRevenue,
            total: totalRevenue
        };
    },

    getTotalProductSelled: async ({ startDate, endDate }) => {
        const parsedStartDate = parseInt(startDate);
        const parsedEndDate = parseInt(endDate);
        const orders = await orderRepository.findBy({
            status: ORDER_STATUS.DELIVERED,
            createdAt: {
                $gte: new Date(parsedStartDate),
                $lte: new Date(parsedEndDate)
            }
        });

        const totalProductSelled = orders.reduce((total, order) => {
            return total + order.items.reduce((totalItem, item) => totalItem + item.quantity, 0);
        }, 0);

        return totalProductSelled;
    },

    getOrderStatus: async ({ startDate, endDate }) => {
        const parsedStartDate = parseInt(startDate);
        const parsedEndDate = parseInt(endDate);
        const orders = await orderRepository.findBy({
            createdAt: {
                $gte: new Date(parsedStartDate),
                $lte: new Date(parsedEndDate)
            }
        });

        const totalOrder = orders.length;
        const orderStatus = [
            { status: ORDER_STATUS.PENDING, amount: 0 },
            { status: ORDER_STATUS.PROCESSING, amount: 0 },
            { status: ORDER_STATUS.DELIVERING, amount: 0 },
            { status: ORDER_STATUS.DELIVERED, amount: 0 },
            { status: ORDER_STATUS.CANCELLED, amount: 0 }
        ];

        orders.forEach(order => {
            switch (order.status) {
                case ORDER_STATUS.PENDING:
                    orderStatus[0].amount++;
                    break;
                case ORDER_STATUS.PROCESSING:
                    orderStatus[1].amount++;
                    break;
                case ORDER_STATUS.DELIVERING:
                    orderStatus[2].amount++;
                    break;
                case ORDER_STATUS.DELIVERED:
                    orderStatus[3].amount++;
                    break;
                case ORDER_STATUS.CANCELLED:
                    orderStatus[4].amount++;
                    break;
            }
        });

        return {
            totalOrder,
            orderStatus
        };
    },

    getTopProducts: async ({ startDate, endDate }) => {
        const query = { status: ORDER_STATUS.DELIVERED };
        const timeQuery = {};
        if (startDate) {
            const parsedStartDate = parseInt(startDate);
            timeQuery.$gte = new Date(parsedStartDate);
        }

        if (endDate) {
            const parsedEndDate = parseInt(endDate);
            timeQuery.$lte = new Date(parsedEndDate);
        }

        if (Object.keys(timeQuery).length > 0) {
            query.createdAt = timeQuery;
        }

        const orders = await orderRepository.findBy(query);

        const products = {};

        orders.forEach(order => {
            order.items.forEach(item => {
                if (products[item.productCode]) {
                    products[item.productCode] += item.quantity;
                } else {
                    products[item.productCode] = item.quantity;
                }
            });
        });

        const topProducts = Object.keys(products).sort((a, b) => products[b] - products[a]).slice(0, 10);

        const result = await Promise.all(topProducts.map(async (productCode) => {
            const product = await productRepository.findByCode(productCode);
            return {
                productCode: product.productCode,
                displayName: product.displayName,
                image: product.images[0].url,
                quantity: products[productCode]
            };
        }));

        return result;
    },

    handleGhtkOrderCallBack: async ({
        partner_id,
        label_id,
        status_id,
        action_time,
        reason_code,
        reason,
        weight,
        fee,
        pick_money,
        return_part_package,
    }) => {
        const order = await orderRepository.findOneBy({ code: partner_id });
        if (!order) throw new Error(`Không tìm thấy đơn hàng: ${partner_id}`);

        switch (status_id) {
            case -1:
                order.status = ORDER_STATUS.CANCELLED;
                order.shipping.reason = reason;
                break;
            case 4:
                order.status = ORDER_STATUS.DELIVERING;
                order.shipping.reason = reason;
                break;
            case 5:
                order.status = ORDER_STATUS.DELIVERED;
                order.shipping.reason = reason;
                await orderService.handleIncreasePrestige(order);
                break;
            case 9:
                order.status = ORDER_STATUS.DELIVERY_FAILED;
                if (['131', '132'].includes(reason_code)) {
                    await orderService.handleReductPrestige(order);
                } else if (order.account) {
                    await userService.returnVoucherByAccountId(order.account, order.voucherCode);
                }
                order.shipping.reason = reason;
                break;
            case 20:
                order.status = ORDER_STATUS.RETURNING;
                if (reason) order.shipping.reason = reason;
                break;
            case 21:
                order.status = ORDER_STATUS.RETURNED;
                if (reason) order.shipping.reason = reason;
                await productService.returnProductByOrder(order);
                break;
        }

        await order.save();
    },

    handleReductPrestige: async (order) => {
        if (order.account) {
            await accountService.reductPrestige(order.account);
        } else {
            await guestService.reductPrestige({
                phone: order.receiverPhone,
                fullName: order.receiverName
            });
        }
    },

    handleIncreasePrestige: async (order) => {
        if (order.account) {
            await accountService.increasePrestige(order.account);
        } else {
            await guestService.increasePrestige({
                phone: order.receiverPhone,
                fullName: order.receiverName
            });
        }
    },

    cancelOrderByAdmin: async (accountId, code, reason) => {
        const account = await accountRepository.findById(accountId);
        const order = await orderRepository.findByCode(code);
        if (!order) throw new Error(`Không tìm thấy đơn hàng: ${code}`);

        //cancel ghtk order
        if (order.shipping.shippingId) {
            const result = await ghtkHelper.cancelOrder(order.shipping.shippingId);
            if (!result.success) throw new Error(result.message);

            if (result.message == 'Shop đã hủy đơn trước đó.') throw new Error(`Đơn hàng ${code} đã được hủy trước đó`);
        }


        if (order.discountValue && CANCEL_REASON.SHOP.includes(reason)) {
            await userService.returnVoucherByAccountId(order.account, order.voucherCode);
        }

        // if (reason == 'Sản phẩm đã hết hàng/Sản phẩm không còn khả dụng') {
        //     await productService.returnProductByOrder(order);
        // }

        if (order.status === ORDER_STATUS.PROCESSING) {
            await productService.returnProductByOrder(order);
        }

        order.status = ORDER_STATUS.CANCELLED;
        order.cancelReason = reason;
        order.canceledBy = account.username;

        await order.save();

        const message = await emailForm.cancelOrder(order);

        await googleHelper.sendEmail(order.email, 'Order Cancelled', message);

        return await orderService.formatOrderResult(order);
    },
};

export default orderService;