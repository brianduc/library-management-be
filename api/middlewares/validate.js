const ResponseHandler = require("../../utils/response-handlers");

function validate(schema) {
  return (req, res, next) => {
    try {
      // Parse and validate the request body
      const validatedData = schema.parse(req.body);

      // Replace the request body with the validated data
      req.body = validatedData;

      next();
    } catch (error) {
      if (error.errors) {
        const formattedErrors = error.errors.map((err) => ({
          message: err.message,
          path: err.path,
        }));

        return ResponseHandler.badRequest(
          res,
          "Validation failed",
          formattedErrors,
        );
      }

      // Handle unexpected errors
      return ResponseHandler.badRequest(res, "Invalid input data", [
        { message: error.message },
      ]);
    }
  };
}

module.exports = validate;
