export const PAYMENT_TYPE = {
    COD: "COD",
    MOMO: "MOMO",
}

export const VOUCHER_STATUS = {
    PENDING: "PENDING",
    APPROVED: "APPROVED",
    AVAILABLE: "AVAILABLE",
    EXPIRED: "EXPIRED",
}

export const ORDER_STATUS = {
    PENDING: "PENDING",
    PROCESSING: "PROCESSING",
    DELIVERING: "DELIVERING",
    DELIVERED: "DELIVERED",
    CANCELLED: "CANCELLED",
    DELIVERY_FAILED: "DELIVERY FAILED",
    RETURNING: "RETURNING",
    RETURNED: "RETURNED",
}

export const VOUCHER_TYPES = {
    UNLIMITED: "UNLIMITED",
    LIMITED: "LIMITED",
}

export const ROLE = {
    ADMIN: "Admin",
    USER: "User",
    WAREHOUSE_MANAGER: "Warehouse Manager",
    STAFF: "Staff",
    SHOP_OWNER: "Shop Owner",
}

export const PERMISSION_MATRIX = {
    [ROLE.SHOP_OWNER]: {
        [ROLE.SHOP_OWNER]: false,
        [ROLE.ADMIN]: true,
        [ROLE.WAREHOUSE_MANAGER]: true,
        [ROLE.STAFF]: true,
        [ROLE.USER]: true,
    },
    [ROLE.ADMIN]: {
        [ROLE.SHOP_OWNER]: false,
        [ROLE.ADMIN]: false,
        [ROLE.WAREHOUSE_MANAGER]: true,
        [ROLE.STAFF]: true,
        [ROLE.USER]: true,
    },
};