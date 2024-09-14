// ** Libs
import axios from 'axios';

const ESGO_ENDPOINT = 'https://esgoo.net/api-tinhthanh';

const esgoHelper = {
    getPublicProvinces: async () => {
        try {
            const response = await axios.get(`${ESGO_ENDPOINT}/1/0.htm`);
            return response.data.data;
        } catch (error) {
            console.error("Error fetching province:", error);
            return [];
        }
    },

    getDistricOfProvince: async (provinceId) => {
        try {
            const response = await axios.get(`${ESGO_ENDPOINT}/2/${provinceId}.htm`);
            return response.data.data;
        } catch (error) {
            console.error("Error fetching districts:", error);
            return [];
        }
    },

    getWardOfDistrict: async (districtId) => {
        try {
            const response = await axios.get(`${ESGO_ENDPOINT}/3/${districtId}.htm`);
            return response.data.data;
        } catch (error) {
            console.error("Error fetching ward:", error);
            return [];
        }
    },
}

export default esgoHelper