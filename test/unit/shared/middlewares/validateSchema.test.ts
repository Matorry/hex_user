import { validateSchema } from "../../../../src/shared/middlewares/validateSchema";
import Joi from "joi";

describe("Given the validateSchema middleware", () => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().email().required()
  });

  const next = jest.fn();

  let req: any;
  let res: any;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next.mockClear();
  });

  describe("When the schema is valid", () => {
    test("Then it should call next with validated data", () => {
      req.body = { name: "John", email: "john@example.com" };

      validateSchema(schema)(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(req.body).toEqual({ name: "John", email: "john@example.com" }); // valor validado
    });
  });

  describe("When the schema is invalid", () => {
    test("Then it should respond with 400 and validation error details", () => {
      req.body = { name: "J" }; // falta email, nombre demasiado corto

      validateSchema(schema)(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Datos inválidos",
        details: expect.arrayContaining([
          expect.objectContaining({ message: expect.any(String), path: expect.any(Array) })
        ])
      });
      expect(next).not.toHaveBeenCalled();
    });
  });
});
