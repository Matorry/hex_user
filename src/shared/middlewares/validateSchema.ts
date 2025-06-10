import { NextFunction, Request, Response } from "express";
import { ObjectSchema } from "joi";

export const validateSchema = (schema: ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      res.status(400).json({
        message: "Datos inválidos",
        details: error.details.map(detail => ({
          message: detail.message,
          path: detail.path
        }))
      });
      return;
    }

    req.body = value;
    next();
  };
};
