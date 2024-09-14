// ** Lib
import jwt from 'jsonwebtoken';

// ** Constants
import { 
    JWT_ACCESS_KEY, 
    EXPIRES_ACCESS_TOKEN, 
    JWT_SECRET_KEY, 
    EXPIRES_REFRESH_TOKEN
} from '../constants/index.js';

const jwtService = {
    getToken: async (payload, type = "login") => {
        let accessToken, refreshToken;

        if (type === "login") {
            [accessToken, refreshToken] = await Promise.all([
                jwt.sign(payload, JWT_ACCESS_KEY, {
                    expiresIn: EXPIRES_ACCESS_TOKEN,
                }),
                jwt.sign(payload, JWT_SECRET_KEY, {
                    expiresIn: EXPIRES_REFRESH_TOKEN,
                }),
            ]);

            return { accessToken, refreshToken };
        } else {
            accessToken = jwt.sign(payload, JWT_ACCESS_KEY, {
                expiresIn: EXPIRES_ACCESS_TOKEN,
            });
            return { accessToken };
        }
    }
}

export default jwtService;