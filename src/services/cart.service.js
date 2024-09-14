// ** Repository
import cartRepository from "../repository/cart.repository.js";
import productRepository from "../repository/product.repository.js";

// ** Service
import productService from "../services/product.service.js";

const cartService = {

    addToCart: async (accountId, items) => {
        const userCart = await cartRepository.findCartByAccount(accountId);
        
        if (userCart && userCart.items.length == 10) throw new Error("Số lượng sản phẩm trong giỏ hàng đã đạt tối đa");

        let totalPrice = 0;

        const cartItems = [];
        for (const item of items) {
            const product = await productRepository.findProductByCode(item.productCode);
            if (!product) throw new Error("Không tìm thấy sản phẩm");
            
            const sizeExist = product.colourVariant.sizeMetrics.find(sizeMetric => sizeMetric.size === item.size);

            if (!sizeExist) throw new Error("Không tìm thấy size sản phẩm");
            // const sizeMetrics = await productService.handleSizeMetrics(product.colourVariant.sizeMetrics);

            const cartItem = {
                displayName: product.displayName,
                productCode: product.productCode,
                image: product.images[0].url,
                price: product.price,
                sizeMetrics: product.colourVariant.sizeMetrics,
                quantity: item.quantity,
                size: item.size,
                isHide: product.isHide,
            };
            cartItems.push(cartItem);
            totalPrice = product.price * cartItem.quantity;
        }

        const cart = await cartRepository.addToCart(cartItems, totalPrice, accountId);

        const result = await cartService.formatCartItems(cart.items);

        return {
            items: result,
            totalPrice: cart.totalPrice,
        }
    },

    formatCartItems: async (items) => {
        const result = [];
        if (!items) return result;
        for (const item of items) {
            const product = await productRepository.findProductByCode(item.productCode);
            const productSize = product.colourVariant.sizeMetrics.find(sizeMetric => sizeMetric.size === item.size);

            result.push({
                displayName: item.displayName,
                productCode: item.productCode,
                image: item.image,
                price: item.price,
                sizeMetrics: item.sizeMetrics,
                quantity: item.quantity,
                size: item.size,
                isHide: item.isHide,
                inStock: item.quantity > productSize.quantity ? false : true,
            });
        }
        return result;
    },

    getCartByAccount: async (accountId) => {
        const cart = await cartRepository.findCartByAccount(accountId);
        if (!cart) {
            return {
                items: [],
                totalPrice: 0,
            }
        }
        const cartItems = await cartService.formatCartItems(cart.items);
        return {
            items: cartItems,
            totalPrice: cart.totalPrice,
        }
    },

    removeItem: async (productCode, size, accountId) => {

        const userCart = await cartRepository.findCartByAccount(accountId);

        if (!userCart) throw new Error("Không tìm thấy giỏ hàng của bạn");
        if (userCart.items.length == 0) throw new Error("Giỏ hàng của bạn đang trống");

        const indexItem = userCart.items.findIndex(cartItem => cartItem.productCode === productCode && cartItem.size === size);
        if (!indexItem < 0) throw new Error("Không tìm thấy sản phẩm trong giỏ hàng");

        userCart.items.splice(indexItem, 1);
        userCart.totalPrice = await cartService.calculateTotalPrice(userCart.items);

        await userCart.save();

        return {
            items: await cartService.formatCartItems(userCart.items),
            totalPrice: userCart.totalPrice,
        }
    },

    updateCart: async ({ productCode, oldSize, oldQuantity, newSize, newQuantity }, accountId) => {
        const userCart = await cartRepository.findCartByAccount(accountId);        
        if (!userCart) throw new Error("Không tìm thấy giỏ hàng của bạn");

        const cartItemsUpdate = await cartService.handleUpdateItems({ productCode, oldSize, oldQuantity, newSize, newQuantity }, userCart.items);
        userCart.items = cartItemsUpdate.items;
        userCart.totalPrice = cartItemsUpdate.totalPrice;
        userCart.save();

        return {
            items: await cartService.formatCartItems(userCart.items),
            totalPrice: userCart.totalPrice,
        }
    },

    handleUpdateItems: async ({ productCode, oldSize, oldQuantity, newSize, newQuantity }, items) => {
        const updateItems = [];
        const index = items.findIndex(item => item.productCode == productCode && item.size == oldSize && item.quantity == oldQuantity);

        if (index === -1) throw new Error("Không tìm thấy sản phẩm trong giỏ hàng");

        items[index].size = newSize;
        items[index].quantity = newQuantity;

        // Merge duplicate products and update quantity
        items.forEach(item => {
            const existingItem = updateItems.find(updateItem => updateItem.productCode === item.productCode && updateItem.size === item.size);
            if (existingItem) {
                existingItem.quantity += item.quantity;
            } else {
                updateItems.push(item);
            }
        });

        const totalPrice = await cartService.calculateTotalPrice(updateItems);

        return {
            items: updateItems,
            totalPrice,
        }
    },

    calculateTotalPrice: async (items) => {
        return items.reduce((total, item) => total + (item.price * item.quantity), 0);
    },

    checkCartInStock: async (items) => {
        let totalPrice = 0;
        const cartItems = [];
        for (const item of items) {
            const product = await productRepository.findProductByCode(item.productCode);
            if (!product) throw new Error("Không tìm thấy sản phẩm");

            const sizeExist = product.colourVariant.sizeMetrics.find(sizeMetric => sizeMetric.size === item.size);
            if (!sizeExist) throw new Error("Không tìm thấy size sản phẩm");

            const cartItem = {
                displayName: product.displayName,
                productCode: product.productCode,
                image: product.images[0].url,
                price: product.price,
                sizeMetrics: product.colourVariant.sizeMetrics,
                quantity: item.quantity,
                size: item.size,
                isHide: product.isHide,
            };

            cartItems.push(cartItem);
            totalPrice = product.price * cartItem.quantity;
        }

        return {
            items: await cartService.formatCartItems(cartItems),
            totalPrice,
        }
    }
};

export default cartService;