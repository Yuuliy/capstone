// ** Lib
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

// ** Services
import jwtService from "../services/jwt.service.js";

// ** Repository
import accountRepository from "../repository/account.repository.js";

// ** Constants
import { JWT_SECRET_KEY, JWT_ACCESS_KEY, CLIENT_URL } from "../constants/index.js";

// ** Helper
import googleHelper from '../helper/google.helper.js'

// ** Configs
import { client } from '../configs/redisConfig.js';

const authService = {
    register: async ({ username, password, email, phone, firstName, lastName }) => {
        const account = await accountRepository.create({ username, password, email, phone, firstName, lastName });

        const payload = {
            id: account._id,
            username: account.username ? account.username : account.email,
            role: account.role,
        }
        const { accessToken } = await jwtService.getToken(payload, "register");

        const result = await authService.formatAccountResponse(account);
        return {
            ...result,
            accessToken,
        }
    },

    login: async ({ username, password }) => {
        const account = await accountRepository.findByUsername(username);

        if (!account) throw new Error("Tên đăng nhập không tồn tại");

        if (account && account.status.isBlocked) throw new Error(`Tài khoản này đang bị khóa vì lý do: ${account.status.blockReason}`);

        if (!bcrypt.compareSync(password, account.password))
            throw new Error("Mật khẩu không chính xác");

        const payload = {
            id: account._id,
            username: account.username ? account.username : account.email,
            role: account.role,
        }

        const refreshTokenDecoded = account.refreshToken ? jwt.decode(account.refreshToken) : null;

        if (!account.refreshToken || refreshTokenDecoded.exp * 1000 < Date.now()) {
            const token = await jwtService.getToken(payload, "login");
            account.refreshToken = token.refreshToken;
            await account.save();

            return {
                ...await authService.formatAccountResponse(account),
                accessToken: token.accessToken,
                refreshToken: token.refreshToken,
            }
        } else {
            const { accessToken } = await jwtService.getToken(payload, "refresh");
            return {
                ...await authService.formatAccountResponse(account),
                accessToken,
                refreshToken: account.refreshToken,
            }
        }
    },

    loginWithGoogle: async (credentital) => {
            if (credentital) {
                const verificationResponse = await googleHelper.verifyGoogleToken(credentital);
                if (verificationResponse.error) {
                    console.error(`Verifiation Fail: ${verificationResponse.error}`);
                    throw new Error('Đăng nhập thất bại');
                }
                const profile = verificationResponse?.payload;

                let account = await accountRepository.findByEmail(profile.email);
                if (account && account.status.isBlocked) throw new Error(`Tài khoản này đang bị khóa vì lý do: ${account.status.blockReason}`);

                let register = false;

                if (!account) {
                    const autoGenerateUsername = profile.email.split('@')[0];
                    const autoGeneratePassword = `P@ssw0rd${Math.random().toString(36).slice(2, 5)}`;

                    account = await accountRepository.create({
                        username: autoGenerateUsername,
                        password: autoGeneratePassword,
                        email: profile.email,
                        firstName: profile.given_name,
                        lastName: profile.family_name,
                        // avatar: profile.picture,
                    });

                    const html = `Xin chào ${profile.given_name},<br><br>
                    Cảm ơn bạn đã đăng ký tài khoản tại cửa hàng của chúng tôi.<br>
                    Ngoài ra, chúng tôi đã tạo một tài khoản mặc định cho bạn với thông tin đăng nhập như sau:<br>
                    <br>
                    <b>- Tên đăng nhập</b>: ${autoGenerateUsername}<br>
                    <b>- Mật khẩu</b>: ${autoGeneratePassword}<br>
                    <br>
                    Bạn có thể đăng nhập vào trang web của chúng tôi bất cứ lúc nào bằng thông tin đăng nhập trên.<br>
                    <br>
                    Trân trọng,<br>
                    Shoes for Sure.`
                    await googleHelper.sendEmail(profile.email, "Thanks for register", html);

                    register = true;
                }


                const payload = {
                    id: account._id,
                    username: account.username ? account.username : account.email,
                    role: account.role,
                }

                const { accessToken, refreshToken } = await jwtService.getToken(payload);
                account.refreshToken = refreshToken;
                await account.save();

                return {
                    ...await authService.formatAccountResponse(account),
                    register,
                    accessToken,
                    refreshToken,
                }
            }
    },

    refreshAccessToken: async (refreshToken) => {
        const payload = jwt.verify(refreshToken, JWT_SECRET_KEY);
        const account = await accountRepository.findById(payload.id);

        if (refreshToken !== account.refreshToken) throw new Error("Refresh Token không hợp lệ");

        return await jwtService.getToken({
            id: account._id,
            role: account.role,
            username: account.username,
        }, "refresh");
    },

    logout: async (accessToken) => {
        const payload = jwt.decode(accessToken, JWT_ACCESS_KEY);

        if (payload.exp < Date.now()) return;

        if (!payload) throw new Error('Access token không hợp lệ');

        const account = await accountRepository.findById(payload.id);

        const exp = payload.exp * 1000;
        const now = Date.now();

        const ttl = Math.ceil((exp - now) / 1000);

        await client.set(`${account.id}_${payload.exp}`, accessToken, {
            EX: ttl,
            NX: true
        });
    },

    forgotPassword: async (email) => {
        const account = await accountRepository.findByEmail(email);
        if (!account) throw new Error("Account không tồn tại");

        const resetPasswordToken = crypto.randomBytes(32).toString('hex');

        account.passwordResetToken = resetPasswordToken;
        account.passwordResetExpires = Date.now() + 600000;

        account.save();

        const html = `Xin vui lòng click vào link dưới đây để thay đổi mật khẩu của bạn.Link này sẽ hết hạn sau 10 phút kể từ bây giờ. <a href=${CLIENT_URL}/login?formType=doimatkhau&token=${resetPasswordToken}>Click here</a>`
        await googleHelper.sendEmail(email, "Forgot password", html);
    },

    resetPassword: async (token, password) => {
        const account = await accountRepository.findByPasswordResetToken(token);

        if (!account) throw new Error("Token không hợp lệ hoặc đã hết hạn");

        const salt = bcrypt.genSaltSync();
        account.password = bcrypt.hashSync(password, salt);

        account.passwordResetToken = null;
        account.passwordResetExpires = null;
        await account.save();
    },

    changePassword: async (id, oldPassword, newPassword) => {
        const account = await accountRepository.findById(id);
        if (!bcrypt.compareSync(oldPassword, account.password))
            throw new Error("Mật khẩu cũ không chính xác");

        const salt = bcrypt.genSaltSync();
        account.password = bcrypt.hashSync(newPassword, salt);

        await account.save();
    },

    formatAccountResponse: async (account) => {
        return {
            id: account._id,
            username: account.username,
            email: account.email,
            role: account.role,
            user: {
                _id: account.user._id,
                firstName: account.user.firstName,
                lastName: account.user.lastName,
                phone: account.user.phone,
                dob: account.user.dob,
                prestige: account.user.prestige,
                deliveryAddress: account.user.deliveryAddress,
                personalVoucher: account.user.personalVoucher,
            },
            isBlocked: account.status.isBlocked,
            blockReason: account.status.blockReason,
        }
    },
};

export default authService;