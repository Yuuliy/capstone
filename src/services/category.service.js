// ** Model
import Category from "../models/category.js";

// ** Repository
import cateRepository from "../repository/category.repository.js";
import productRepository from "../repository/product.repository.js";

const cateService = {
  getAll: async () => {
    const result = await cateRepository.getAll();
    return result;
  },

  getById: async (id) => {
    return await cateRepository.getById(id);
  },

  create: async ({ name, description, isHide }) => {
    const nameExists = await Category.findOne({ name });

    if (nameExists) {
      throw new Error("Danh mục đã tồn tại");
    }

    const category = new Category({
      name,
      description,
      isHide,
    });

    return cateRepository.create(category);
  },

  update: async (id, { name, description }) => {
    const nameExists = await Category.findOne({ $and: [{ name }, { _id: { $ne: id } }] });
    if (nameExists) {
      throw new Error("Danhh mục đã tồn tại");
    }

    return cateRepository.update(id, { name, description });
  },

  changeStatus: async (id) => {
    const category = await cateRepository.changeStatus(id);
    await productRepository.changeStatusByCategory(id, category.isHide);
    return category;
  },

  //get all existing categories in DB (for admin only)
  searchAndPaginate: async (page, size, name) => {
    const startIndex = (page - 1) * size;
    const query = { name: { $regex: name, $options: "i" } };

    const listCategory = await cateRepository.searchAndPaginate(
      startIndex,
      size,
      query
    );
    return {
      items: listCategory.item,
      totalPage: Math.ceil(listCategory.total / size),
      activePage: listCategory.total ? page : 1,
      totalDocument: listCategory.total,
    };
  },

  //get all active category (for user's client)
  searchActivePagination: async (page, size, name) => {
    const startIndex = (page - 1) * size;
    const query = {
      name: { $regex: name, $options: "i" },
      isHide: false,
    };
    const listCategory = await cateRepository.searchAndPaginate(
      startIndex,
      size,
      query
    );

    return {
      items: listCategory.item,
      totalPage: Math.ceil(listCategory.total / size),
      activePage: listCategory.total ? page : 1,
      totalDocument: listCategory.total,
    };
  },
};

export default cateService;
