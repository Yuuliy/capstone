// ** Libs
import axios from 'axios';

// ** Constant
import { GHTK_TOKEN, GHTK_ENDPOINT } from '../constants/index.js';

export const shopAddress = {
    province: 'Hà Nội',
    district: 'Nam Từ Liêm',
    pickName: 'Lê Công Thành',
    pickTel: '0364716472',
    pickAddress: '30 Ngõ 14 Phố Mễ Trì Hạ, Mễ Trì, Nam Từ Liêm, Hà Nội',
    defaultHamlet: 'Khác',
};

const ghtkHelper = {
    getShippinngFee: async ({
        province,
        district,
        xteam
    }) => {
        try {
            const response = await axios.get(
                `${GHTK_ENDPOINT}/services/shipment/fee?pick_province=${shopAddress.province}&pick_district=${shopAddress.district}&province=${province}&district=${district}&weight=1000&deliver_option=${xteam ? 'xteam' : 'none'}`,
                {
                    headers: {
                        Token: GHTK_TOKEN
                    }
                }
            )
            return response.data.fee.fee;
        } catch (error) {
            console.error(`Error fetching shipping fee: ${error.response.data.message.toString()}`);
            throw new Error(`Lỗi khi lấy phí vận chuyển`);
        }
    },

    postOrder: async (orderData) => {
        try {
            const response = await axios.post(
                `${GHTK_ENDPOINT}/services/shipment/order/?ver=1.5`,
                orderData,
                {
                    headers: {
                        Token: GHTK_TOKEN,
                        'Content-Type': 'application/json'
                    }
                }
            )
            return response.data;
        } catch (error) {
            console.error(`Error when post order: ${error.response.data.message.toString()}`);
            throw new Error(`Lỗi khi đăng đơn hàng`);
        }
    },

    cancelOrder: async (shippingId) => {
        try {
            const response = await axios.post(
                `${GHTK_ENDPOINT}/services/shipment/cancel/${shippingId}`,
                null,
                {
                    headers: {
                        Token: GHTK_TOKEN,
                    }
                }
            )
            return response.data;
        } catch (error) {
            console.error(`Error when post order: ${error.response.data.message.toString()}`);
            throw new Error(`Lỗi khi huỷ đơn hàng`);
        }
    }
};

export default ghtkHelper;