// ** Repository
import accountRepository from "../repository/account.repository.js";

const userService = {
    getProfile: async (id) => {
        const { account, user } = await accountRepository.findAccountAndUser(id);

        const accountJSON = account.toJSON();
        const userJSON = user.toJSON();
        delete userJSON._id;
        delete userJSON.__v;
        delete accountJSON.refreshToken;
        delete accountJSON.password;
        delete accountJSON.passwordResetExpires;
        delete accountJSON.passwordResetToken;

        return {
            ...accountJSON,
            user: userJSON,
        };
    },

    updateProfile: async (id, { firstName, lastName, phone, dob }) => {
        const account = await accountRepository.updateUser(id, firstName, lastName, dob, phone);

        const accountInfo = account.toJSON();
        delete accountInfo.refreshToken;
        delete accountInfo.password;

        return accountInfo;
    },

    createDeliveryAddress: async (id, address) => {
        const account = await accountRepository.findById(id);
        const user = account.user;

        if (user.deliveryAddress.length == 10) throw new Error("Bạn chỉ có thể tạo tối đa 10 địa chỉ");

        const isExist = user.deliveryAddress.find(
            (item) => new RegExp(item.address, 'i').test(address.address)
        );

        if (isExist) {
            throw new Error("Địa chỉ đã tồn tại");
        }

        if (address.isDefault) {
            user.deliveryAddress.forEach((item) => {
                item.isDefault = false;
            });
        }

        if (address.isDefault) {
            user.deliveryAddress.unshift(address);
        } else {
            user.deliveryAddress.push(address);
        }

        await user.save();

        const result = userService.handleDeliveryAddressResult(
            user.deliveryAddress
        );
        return result;
    },

    handleDeliveryAddressResult: (deliveryAddress) => {
        return deliveryAddress.map((item) => {
            return {
                id: item._id,
                fullName: item.fullName,
                phone: item.phone,
                address: item.address,
                province: {
                    provinceId: item.province.provinceId,
                    provinceName: item.province.provinceName,
                },
                district: {
                    districtId: item.district.districtId,
                    districtName: item.district.districtName,
                },
                ward: {
                    wardId: item.ward.wardId,
                    wardName: item.ward.wardName,
                },
                isDefault: item.isDefault,
            };
        });
    },

    updateDeliveryAddress: async (accountId, addressId, address) => {
        const account = await accountRepository.findById(accountId);
        const user = account.user;

        const deliveryAddress = user.deliveryAddress.id(addressId);

        if (!deliveryAddress) {
            throw new Error("Không tìm thấy địa chỉ");
        }

        const isExist = user.deliveryAddress.find(
            (item) => new RegExp(item.address, 'i').test(address.address) && item._id.toString() !== addressId
        );

        if (isExist) {
            throw new Error("Địa chỉ đã tồn tại");
        }

        if (address.isDefault) {
            user.deliveryAddress.forEach((item) => {
                item.isDefault = false;
            });

            user.deliveryAddress = user.deliveryAddress.filter(
                (item) => item._id.toString() !== addressId
            );

            user.deliveryAddress.unshift(deliveryAddress);
        }

        deliveryAddress.fullName = address.fullName;
        deliveryAddress.phone = address.phone;
        deliveryAddress.address = address.address;
        deliveryAddress.province = address.province;
        deliveryAddress.district = address.district;
        deliveryAddress.ward = address.ward;
        if (address.isDefault) deliveryAddress.isDefault = address.isDefault;

        await user.save();

        const result = userService.handleDeliveryAddressResult(
            user.deliveryAddress
        );
        return result.find((item) => item.id.toString() === addressId);
    },

    getUserDeliveryAddress: async (accountId) => {
        const account = await accountRepository.findById(accountId);
        const user = account.user;

        const result = userService.handleDeliveryAddressResult(
            user.deliveryAddress
        );
        return result;
    },

    deleteDeliveryAddress: async (accountId, addressId) => {
        const account = await accountRepository.findById(accountId);
        const user = account.user;

        const deliveryAddress = user.deliveryAddress.id(addressId);

        if (!deliveryAddress) {
            throw new Error("Không tìm thấy địa chỉ");
        }

        if (deliveryAddress.isDefault) {
            throw new Error("Không thể xóa địa chỉ mặc định");
        }

        user.deliveryAddress.pull({ _id: addressId });

        await user.save();

        const result = userService.handleDeliveryAddressResult(
            user.deliveryAddress
        );

        return result;
    },

    returnVoucherByAccountId: async (accountId, voucherCode) => {
        const user = await accountRepository.findUserByAccountId(accountId);

        const voucher = user.personalVoucher.find(
            (item) => item.voucher.code === voucherCode
        );

        if (!voucher) {
            throw new Error(`Không tìm thấy voucher ${voucherCode}`);
        }

        voucher.isUsed = false;

        await user.save();
    }
};

export default userService;
