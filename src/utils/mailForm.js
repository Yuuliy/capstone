import moment from 'moment';
import { SHOP_EMAIL } from '../constants/index.js';

const emailForm = {
    newOrder: async (order) => {
        return `
        <html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    margin: 20px;
                    color: #333;
                }
                .header {
                    text-align: center;
                    margin-bottom: 20px;
                }
                .header img {
                    max-width: 100px;
                }
                h1 {
                    color: #333;
                }
                p {
                    margin: 0 0 10px;
                }
                .section {
                    border-top: 1px solid #ccc;
                    padding-top: 10px;
                    margin-top: 10px;
                }
                .section-title {
                    font-weight: bold;
                    margin-bottom: 5px;
                }
                .order-details {
                    margin-bottom: 10px;
                }
                .order-details span {
                    display: inline-block;
                    width: 150px;
                    font-weight: bold;
                }
                .total {
                    font-size: 12px;
                    text-align: right;
                }
                .note {
                    font-size: 12px;
                    color: #777;
                }
                .total-price {
                    font-size: 18px;
                    font-weight: bold;
                    text-align: right;
                    border-top: 1px solid #ccc;
                    padding-top: 10px;
                    margin-top: 10px;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 10px;
                }
                table, th, td {
                    border: 1px solid #ccc;
                }
                th, td {
                    padding: 8px;
                    text-align: left;
                }
                th {
                    background-color: #f9f9f9;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <img src="https://firebasestorage.googleapis.com/v0/b/social-media-33aea.appspot.com/o/logo%2Flogo.png?alt=media&token=86da0a54-a828-4a7e-998b-a2cb105cff89" alt="Shoes_for_sure">
                <h1>Thank You</h1>
            </div>
            <h3>Cảm ơn bạn đã đặt hàng!</h3>
            <div class="section">
                <div class="section-title">Thông tin khách hàng</div>
                <p>Người nhận hàng: ${order.receiverName}<br>
                Email: ${order.email}<br>
                Số điện thoại: ${order.receiverPhone}</p>
            </div>
            <div class="section">
                <div class="section-title">Địa chỉ nhận hàng</div>
                <p>${order.deliveryAddress.address}, 
                ${order.deliveryAddress.ward}, 
                ${order.deliveryAddress.district}, 
                ${order.deliveryAddress.province}.</p>
            </div>
            <div class="section">
                <div class="section-title">
                    <span>Mã đơn hàng:</span>
                    <span style="color:rgb(255,106,0);">${order.code}</span>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Sản phẩm</th>
                            <th>Kích cỡ</th>
                            <th>Giá</th>
                            <th>Số lượng</th>
                            <th>Thành Tiền</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${order.items.map(item => `
                        <tr>
                            <td>${item.displayName}</td>
                            <td>${item.size}</td>
                            <td>${item.price}</td>
                            <td>${item.quantity}</td>
                            <td>${item.price * item.quantity}</td>
                        </tr>
                        `).join('')}
                    </tbody>
                </table>
                <p>
                <p class="total">Tổng: ${order.totalPrice}</p>
                <p class="total">Phí vận chuyển: ${order.shipping.fee}</p>
                ${order.discountValue ? `
                    <p class="total">Giảm: - ${order.discountValue}</p>
                    <p class="total-price">Total: ${order.totalPrice + order.shipping.fee - order.discountValue}</p>
                ` : `
                <p class="total-price">Total: ${order.totalPrice + order.shipping.fee}</p>
                `}
            </div>
            <p>Phương thức thanh toán: ${order.payment.method}</p>
            <p>Để tra cứu thông tin về đơn hàng, vui lòng truy cập <a href="https://shoe4sure-web.vercel.app/search-order">Shoes 4 Sure</a> để biết thêm chi tiết.</p>
            <p>Trân trọng,</p>
            <p><strong>Đội ngũ hỗ trợ khách hàng</strong></p>
        </body>
        </html>
    `;
    },

    cancelOrder: async (order) => {
        return `
            <html lang="vi">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Thông báo hủy đơn hàng</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                        color: #333;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                        border: 1px solid #ddd;
                        border-radius: 5px;
                    }
                    h1 {
                        color: #e74c3c;
                    }
                    .order-details {
                        background-color: #f9f9f9;
                        padding: 15px;
                        border-radius: 5px;
                        margin-top: 20px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Thông báo hủy đơn hàng</h1>
                    <p>Kính gửi quý khách hàng,</p>
                    <p>Chúng tôi rất tiếc phải thông báo rằng đơn hàng của quý khách đã bị hủy. Chi tiết đơn hàng như sau:</p>
                    <div class="order-details">
                        <p><strong>Mã đơn hàng:</strong> <span id="orderNumber">${order.code}</span></p>
                        <p><strong>Ngày đặt hàng:</strong> <span id="orderDate">${moment(order.createdAt).format('DD-MM-YYYY')}</span></p>
                        <p><strong>Lý do hủy:</strong> <span id="cancelReason">${order.cancelReason}</span></p>
                    </div>
                    <p>Nếu quý khách có bất kỳ thắc mắc nào, vui lòng liên hệ với chúng tôi để được hỗ trợ: </p>
                    <p>Email: ${SHOP_EMAIL} </p>
                    <p>Số điện thoại: 0364716472 </p>
                    <p>Chúng tôi xin chân thành cảo lỗi vì sự bất tiện này và hy vọng sẽ được phục vụ quý khách trong tương lai.</p>
                    <p>Trân trọng,</p>
                    <p><strong>Đội ngũ hỗ trợ khách hàng</strong></p>
                </div>
            </body>
            </html>
        `;
    },

    hpbdForm: async (account, voucher) => {
        const now = Date.now();
        const today = new Date(now).getDay();

        const daysOfWeek = ['Chủ nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];

        return `
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Celebrate YOU</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            text-align: center;
                            color: #333;
                            margin: 0;
                            padding: 0;
                            background-color: #f0f0f0;
                        }
                        .container {
                            max-width: 600px;
                            margin: 50px auto;
                            background-color: #fff;
                            padding: 20px;
                            border-radius: 10px;
                            box-shadow: 0 0 10px rgba(0,0,0,0.1);
                        }
                        .title {
                            font-size: 24px;
                            margin-bottom: 10px;
                        }
                        .subtitle {
                            font-size: 18px;
                            margin-bottom: 20px;
                        }
                        .reward-container {
                            margin-left: 60px;
                            width: 75%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            margin-bottom: 20px;
                            border: 2px solid #ff5722;
                            border-radius: 10px;
                            padding: 10px;
                        }
                        .reward-image {
                            width: 80px;
                            height: 80px;
                        }
                        .reward-info {
                            text-align: left;
                            margin-left: 10px;
                        }
                        .reward-info h3 {
                            margin: 0;
                            color: #f56c0b;
                        }
                        .reward-info p {
                            margin: 5px 0;
                            font-size: 14px;
                            color: #999;
                        }
                        .reward-details {
                            font-size: 16px;
                            color: #333;
                        }
                        .btn {
                            margin-left: 39%;
                            display: inline-block;
                            padding: 10px 20px;
                            background-color: #f56c0b;
                            border-radius: 5px;
                            margin-bottom: 20px;
                            margin-top: 10px;
                        }
                        .btn a {
                            color: #fff; /* Màu trắng cho chữ */
                            text-decoration: none; /* Bỏ dấu gạch chân */
                        }
                        .expiry {
                            font-size: 14px;
                            color: #777;
                        }
                        .discounts {
                            justify-content: center;
                            gap: 5px;
                        }
                        .discounts span {
                            padding: 5px 10px;
                            border-radius: 5px;
                            color: #fff;
                            font-size: 14px;
                        }
                        .discount-30 {
                            background-color: #ff5722;
                        }
                        .discount-99k {
                            background-color: #ff9800;
                        }
                        .discount-99k-max {
                            background-color: #ffc107;
                        }
                        a {
                            text-decoration: none;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <p class="title">Chúc mừng sinh nhật <strong>${account.user.firstName} ${account.user.lastName}</strong></p>
                        <p class="subtitle">Xin chào ${account.user.firstName}, chúng tôi muốn tặng bạn một món quà vào sinh nhật của bạn vào ${daysOfWeek[today]} – hãy tự thưởng cho mình hôm nay bằng một sản phẩm đến từ Shoes For Sure!</p>
                        <div class="reward-container">
                            <img src="https://firebasestorage.googleapis.com/v0/b/social-media-33aea.appspot.com/o/logo%2Fvoucher_icon.db4a7604.png?alt=media&token=ed570ac9-4fff-4045-8a49-bf43f63fc4f1" alt="Reward Icon" class="reward-image">
                            <div class="reward-info">
                                <h3>${voucher.title}</h3>
                                <p>HSD: 7 ngày</p>
                                <p class="reward-details">Giảm ${voucher.discount * 100}% cho đơn từ ${voucher.minOrderPrice}đ, giảm tối đa ${voucher.maxDiscountValue}đ</p>
                                <div class="discounts">
                                    <span class="discount-30">${voucher.discount * 100}%</span>
                                    <span class="discount-99k">▼${voucher.minOrderPrice}</span>
                                    <span class="discount-99k-max">▲${voucher.maxDiscountValue}</span>
                                </div>
                            </div>
                        </div>
                        <div class="btn">
                            <a href="https://shoe4sure-web.vercel.app/">SHOPPING NOW</a>
                        </div>
                        <p class="expiry">Voucher Expired at: ${moment(voucher.expiredDate).format('DD-MM-YYYY')}</p>
                    </div>
                </body>
                </html>
        `;
    },
}

export default emailForm;