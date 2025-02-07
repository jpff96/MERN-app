const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateRegisterInput(data) {
  let errors = {};
  //My empty method
  data.name = !isEmpty(data.name) ? data.name : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.password2 = !isEmpty(data.password2) ? data.password2 : "";

  if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
    errors.name = "Name must be between 2 and 30 characters";
  }

  if (!Validator.isEmail(data.email)) {
    errors.email = "Email field is required";
  }

  if (Validator.isEmpty(data.name)) {
    errors.name = "Name field is required";
  }

  if (Validator.isEmpty(data.password)) {
    errors.passowrd = "Passowrd field is required";
  }

  if (!(Validator.isLength(data.password), { min: 6, max: 30 })) {
    errors.passowrd =
      "passowrd must be at least 6 characters and no more than 30.";
  }

  if (Validator.isEmpty(data.password2)) {
    errors.passowrd2 = "Confirm passowrd field is required";
  }

  if (!Validator.equals(data.password, data.password2)) {
    errors.passowrd2 = "Passowrd must match";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
