import _ from "lodash";

export const message = {
  required: (field) => `${_.capitalize(field)} là bắt buộc`,
  invalid: (field) => `${_.capitalize(field)} không hợp lệ`,
  incorrect: (field) => `${_.capitalize(field)} không chính xác`,
  notFound: (field) => `${_.capitalize(field)} không tồn tại`,
  existed: (field) => `${_.capitalize(field)} đã tồn tại`,
  new: (field) => `${_.capitalize(field)} mới phải khác với ${_.capitalize(field)} cũ`,
  stringLengthInRange: ({ field, min, max }) =>
    `${_.capitalize(
      field
    )} phải lớn hơn hoặc bằng ${min} và nhỏ hơn hoặc bằng ${max} ký tự`,
  mustBeOneOfAndNotDuplicated: ({ field, values }) =>
    `${_.capitalize(field)} phải là một trong [${values}] và không trùng lặp`,
  mustBeOneOf: ({ field, values }) =>
    `${_.capitalize(field)} phải là một trong [${values}]`,
  mustBeNumberAndGreaterThanOrEqual: ({ field, value = 1 }) =>
    `${_.capitalize(field)} phải là số và lớn hơn hoặc bằng ${value}`,
  mustBeNumberAndGreaterThan: (field, value = 1) =>
    `${_.capitalize(field)} phải là số và lớn hơn ${value}`,
  exist: (field) => `${_.capitalize(field)} đã tồn tại`,
  specialCharacter: (field) => `${_.capitalize(field)} không được chứa ký tự đặc biệt`,
  isHexColor: (field) => `${_.capitalize(field)} phải là mã màu hex hợp lệ`,
  mustBeArray: (field) => `${_.capitalize(field)} phải là một mảng`,
  arrayCannotEmpty: (field) => `${_.capitalize(field)} không được để trống`,
  mustBeLessThan: (field1, field2) => `${_.capitalize(field1)} phải nhỏ hơn ${_.capitalize(field2)}`,
  mustBeNumberAndGreaterOrEqualThan: (field, value = 1) =>
    `${_.capitalize(field)} phải là số và lớn hơn hoặc bằng ${value}`,
  noSpace: (field) => `${_.capitalize(field)} không được chứa khoảng trắng`,
};
