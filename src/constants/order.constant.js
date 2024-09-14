export const PAYMENT_METHOD = {
    COD: "COD",
    VNPAY: "VNPAY"
};

export const CANCEL_REASON = {
    SHOP: [
        'Sản phẩm đã hết hàng/Sản phẩm không còn khả dụng',
        'Không bàn giao được cho đơn vị vận chuyển',
        'Đơn hàng quá hạn',
        'Lỗi kỹ thuật',
    ],
    CUSTOMER: [
        'Địa chỉ giao hàng không hợp lệ',
        'Khách yêu cầu hủy đơn',
        'Thông tin đơn hàng không hợp lệ',
        'Không liên lạc được với khách hàng quá 3 lần',
        'Đơn hàng bị trùng lặp',
        'Khách hàng chưa thanh toán'
    ],
}