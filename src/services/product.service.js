// ** Repository
import productRepository from "../repository/product.repository.js";
import categoryRepository from "../repository/category.repository.js";

// ** Constants
import { sortOptions } from "../constants/query.constant.js";

// ** Helper
import firebaseHelper from "../helper/firebase.helper.js";

const productService = {
  createProduct: async ({ productName, type, description, categoryId, price, colourVariant }, images = []) => {
    const colourVariantParsed = JSON.parse(colourVariant);

    const exitsProduct = await productRepository.findOneBy({
      productName: { $regex: productService.formatName(productName), $options: "i" },
      type,
      "colourVariant.colourName": { $regex: colourVariantParsed.colourName, $options: "i" },
    });

    if (exitsProduct) throw new Error("Sản phẩm đã tồn tại!");

    const category = await categoryRepository.getById(categoryId);
    const productCode = Math.random().toString(36).slice(2, 12).toUpperCase();

    const productNameFormatted = productService.formatName(productName);
    const typeFormatted = productService.formatName(type);
    colourVariantParsed.colourName = productService.formatName(colourVariantParsed.colourName);

    const displayName = `${productService.formatName(category.name)} ${productNameFormatted} - ${typeFormatted}`;

    const product = await productRepository.create({
      productCode,
      productName: productNameFormatted,
      type: typeFormatted,
      displayName,
      description,
      categoryId: category._id,
      price,
      colourVariant: colourVariantParsed,
      isHide: category.isHide ? true : false,
    });

    if (product && images.length > 0) {
      const urls = await firebaseHelper.uploadToStorage(productCode, images);
      product.images = urls;
      await product.save();
    }

    return productService.handleformatProductResult(product);
  },

  formatName: (name) => {
    return name.split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
  },

  productDetail: async (code) => {
    const product = await productRepository.findByCode(code);
    const ortherColor = await productRepository.findByProductName(product.productName);
    const result = productService.handleformatProductResult(product);
    return {
      ...result,
      ortherColor: ortherColor.map((product) => {
        return {
          productCode: product.productCode,
          hex: product.colourVariant.hex,
          isHide: product.isHide,
        };
      }),
    }
  },

  getTotalQuantity: async (product) => {
    const totalQuantity = product.colourVariant.sizeMetrics.reduce(
      (acc, size) => acc + size.quantity,
      0
    );
    return totalQuantity;
  },

  handleformatProductResult: (product) => {
    const sizeMetrics = product.colourVariant.sizeMetrics.sort((a, b) => {
      return a.size - b.size;
    }).map((size) => {
      return {
        size: size.size,
        quantity: size.quantity,
      };
    });

    const images = product.images.map((image) => ({
      id: image.id,
      url: image.url,
    }));

    return {
      productCode: product.productCode,
      productName: product.productName,
      type: product.type,
      displayName: product.displayName,
      description: product.description,
      images,
      category: {
        id: product.category._id,
        name: product.category.name,
      },
      price: product.price,
      salePrice: product.salePrice,
      isHide: product.isHide,
      colourVariant: {
        colourName: product.colourVariant.colourName,
        hex: product.colourVariant.hex,
        sizeMetrics,
      },
    };
  },

  getAllProduct: async ({
    page,
    size,
    types,
    displayName,
    categoryIds,
    categoryNames,
    colors,
    colorNames,
    minPrice,
    maxPrice,
    priceSort,
  }) => {
    const skip = (page - 1) * size;

    const query = {
      isHide: false,
    };

    if (displayName) query.displayName = { $regex: displayName, $options: "i" };

    if (types) query.type = productService.handleGenereateQueryArray(types);

    if (categoryIds) query.category = { $in: categoryIds };

    if (colors) query["colourVariant.hex"] = productService.handleGenereateQueryArray(colors);

    if (minPrice && maxPrice) {
      query.price = { $gte: minPrice, $lte: maxPrice };
    } else if (minPrice) {
      query.price = { $gte: minPrice };
    } else if (maxPrice) {
      query.price = { $lte: maxPrice };
    }

    if (colorNames) query["colourVariant.colourName"] = productService.handleGenereateQueryArray(colorNames);

    const sort = {};

    if (priceSort === sortOptions.ASC) {
      sort.price = 1;
    } else if (priceSort === sortOptions.DESC) {
      sort.price = -1;
    }

    const totalDocuments = await productRepository.totalDocuments(query);
    const totalPage = Math.ceil(totalDocuments / size);

    let products = await productRepository.filterProducts(
      query,
      skip,
      size,
      sort
    );

    if (categoryNames) {
      const regex = new RegExp([categoryNames].join('|'), 'i');
      products = products.filter(product =>
        product.category && regex.test(product.category.name)
      );
    }

    const result = await productService.formatProductResult(products);

    return {
      products: result,
      totalPage,
      totalDocuments,
    };
  },

  handleGenereateQueryArray: (array) => {
    if (Array.isArray(array)) {
      return { $in: array };
    } else {
      return { $regex: array, $options: "i" };
    }
  },

  getPoductDashboard: async ({
    page,
    size,
    displayName,
    categoryId,
    color,
    minPrice,
    maxPrice,
    priceSort,
  }) => {

    const skip = (page - 1) * size;

    const query = {};

    if (displayName) query.displayName = { $regex: displayName, $options: "i" };
    if (categoryId) query.category = categoryId;
    if (color) query["colourVariant.hex"] = color;
    if (minPrice) query.price = { $gte: minPrice };
    if (maxPrice) query.price = { $lte: maxPrice };

    const sort = {};

    if (priceSort === sortOptions.ASC) {
      sort.price = 1;
    } else if (priceSort === sortOptions.DESC) {
      sort.price = -1;
    }

    const totalDocuments = await productRepository.totalDocuments(query);
    const totalPage = Math.ceil(totalDocuments / size);

    const products = await productRepository.filterProducts(
      query,
      skip,
      size,
      sort
    );

    const result = await Promise.all(
      products.map(async (product) => {
        const totalQuantity = await productService.getTotalQuantity(product);
        const formattedProduct = productService.handleformatProductResult(product);
        return {
          ...formattedProduct,
          totalQuantity,
        };
      })
    );

    return {
      products: result,
      totalPage,
      totalDocuments,
    };
  },

  formatProductResult: async (products) => {
    const result = products.map((product) => {
      const totalQuantity = product.colourVariant.sizeMetrics.reduce(
        (acc, size) => acc + size.quantity,
        0
      );
      const sizeMetrics = product.colourVariant.sizeMetrics.map((sizes) => {
        return {
          size: sizes.size,
          quantity: sizes.quantity,
        };
      });
      return {
        productCode: product.productCode,
        productName: product.productName,
        displayName: product.displayName,
        type: product.type,
        category: product.category.name,
        colorName: product.colourVariant.colourName,
        salePrice: product.salePrice,
        price: product.price,
        images: product.images,
        sizeMetrics,
        totalQuantity,
      };
    });

    return result;
  },

  deleteProduct: async (code) => {
    const product = await productRepository.findByCode(code);
    if (product.category.isHide) {
      throw new Error("Không thể thay đổi trạng thái của sản phẩm thuộc danh mục đã ẩn!");
    }
    const result = await productRepository.findAndChangeVisibility(code);
    return productService.handleformatProductResult(result);
  },

  updateProduct: async (productCode, { productName, type, description, categoryId, price, colourVariant, removeImageIds = [] }, images = []) => {
    const product = await productRepository.findByCode(productCode);
    const colourVariantParsed = JSON.parse(colourVariant);

    const productExist = await productRepository.findOneBy(
      {
        productName: { $regex: productService.formatName(productName), $options: "i" },
        type: { $regex: type, $options: "i" },
        "colourVariant.colourName": { $regex: colourVariantParsed.colourName, $options: "i" },
        productCode:
        {
          $ne: productCode
        }
      }
    );

    if (productExist) throw new Error("Sản phẩm đã tồn tại!");

    const query = {};
    let categoryName = product.category.name;
    if (categoryId !== product.category._id.toString()) {
      const category = await categoryRepository.getById(categoryId);
      query.category = category._id;
      categoryName = productService.formatName(category.name);
    }


    const productNameFormatted = productService.formatName(productName);
    const typeFormatted = productService.formatName(type);
    colourVariantParsed.colourName = productService.formatName(colourVariantParsed.colourName);

    const displayName = `${categoryName} ${productNameFormatted} - ${typeFormatted}`;

    query.productName = productNameFormatted;
    query.type = typeFormatted;
    query.displayName = displayName;
    if (description) query.description = description;
    query.price = price;
    query.colourVariant = colourVariantParsed;

    if (removeImageIds.length > 0) {
      await firebaseHelper.deleteFile(productCode, removeImageIds);
      product.images = product.images.filter((image) => !removeImageIds.includes(image.id));
      query.images = product.images;
    }

    if (images.length > 0) {
      const urls = await firebaseHelper.uploadToStorage(productCode, images);
      product.images = product.images.concat(urls);
      query.images = product.images;
    }

    const result = await productRepository.findAndUpdate(productCode, query);

    return productService.handleformatProductResult(result);
  },

  getAllColors: async () => {
    const products = await productRepository.getAllProducts();
    const colors = products.reduce((acc, product) => {
      const color = {
        colorName: product.colourVariant.colourName,
        hex: product.colourVariant.hex,
      };
      if (!acc.find((item) => item.colorName === color.colorName)) {
        acc.push(color);
      }
      return acc;
    }, []);

    return colors;
  },

  handleSizeMetrics: async (sizeMetrics) => {
    const result = [];
    for (const sizeMetric of sizeMetrics) {
      result.push({
        size: sizeMetric.size,
        quantity: sizeMetric.quantity,
        isAvailable: sizeMetric.quantity > 0 ? true : false,
      });

    }
    return result;
  },

  returnProductByOrder: async (order) => {
    const items = order.items;

    for (const item of items) {
      const product = await productRepository.findByCode(item.productCode);
      const sizeMetric = product.colourVariant.sizeMetrics.find(
        (size) => size.size === item.size
      );
      sizeMetric.quantity += item.quantity
      await product.save();
    }
  },

  checkStock: async ({ productCode, size, quantity }) => {
    const product = await productRepository.findByCode(productCode);
    const sizeMetric = product.colourVariant.sizeMetrics.find(
      (sizeMetric) => sizeMetric.size == size
    );
    if (sizeMetric.quantity < quantity || product.isHide) {
      return false;
    }
    return true;
  }
};

export default productService;
