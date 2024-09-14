// ** Models
import Cart from '../models/cart.js';

const cartRepository = {
    addToCart: async (items, totalPrice, accountId) => {
        const userCart = await Cart.findOne({ account: accountId });
        if (!userCart) {
            const newCart = new Cart({
                items,
                totalPrice,
                account: accountId
            });

            await newCart.save();

            return {
                items: newCart.items,
                totalPrice: newCart.totalPrice,
            }

        } else {
            const cartItems = userCart.items;
            for (const item of items) {
                const existingCartItem = cartItems.find(cartItem => cartItem.productCode === item.productCode && cartItem.size === item.size);
                if (existingCartItem) {
                    existingCartItem.quantity += item.quantity;

                    userCart.totalPrice += item.price * item.quantity;
                } else {
                    cartItems.push(item);
                    userCart.totalPrice += item.price * item.quantity;
                }
            }

            userCart.items = cartItems;
            await userCart.save();

            return {
                items: userCart.items,
                totalPrice: userCart.totalPrice,
            }
        }
    },

    findCartByAccount: async (accountId) => {
        return await Cart.findOne({
            account: accountId,
        }).select('-__v');
        // .populate('items.product');
    },

    createOrUpdateCart: async (accountId, items, totalPrice) => {
        const cart = await Cart.findOneAndUpdate(
            { account: accountId },
            {
                items,
                totalPrice,
                account: accountId
            },
            { new: true, upsert: true }
        ).select('-__v');

        return cart;
    },
};

export default cartRepository;