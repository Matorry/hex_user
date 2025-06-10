import express, { Request, Response } from "express";
import { validateSchema } from "../../shared/middlewares/validateSchema";
import { CreateUser } from "../../user/application/CreateUser";
import { DeleteUser } from "../../user/application/DeleteUser";
import { GetUser } from "../../user/application/GetUser";
import { SearchUsers } from "../../user/application/SearchUsers";
import { UpdateUser } from "../../user/application/UpdateUser";
import { UserEventBus } from "../../user/domain/UserEventBus";
import { UserRepositoryPostgreSQLPrisma } from "../../user/infrastructure/UserRepositoryPostgreSQLPrisma";
import { BcryptService } from "../../user/infrastructure/security/BcryptService";
import {
  UserCreateSchema,
  UserUpdateSchema,
} from "../../user/infrastructure/validators/UserValidator";

export default function userRoutes(publisher: UserEventBus) {
  const router = express.Router();
  const repository = new UserRepositoryPostgreSQLPrisma();
  const hasher = new BcryptService();

  // Crear usuario
  router.post(
    "/",
    validateSchema(UserCreateSchema),
    async (req: Request, res: Response) => {
      try {
        const useCase = new CreateUser(repository, publisher, hasher);
        const user = await useCase.execute(req.body);
        res.status(201).json({
          id: user.id,
          userName: user.userName,
          email: user.email.getValue(),
        });
      } catch (err: any) {
        res.status(500).json({ message: "Error al crear usuario", error: err });
      }
    }
  );

  // Buscar todos los usuarios
  router.get("/", async (req: Request, res: Response) => {
    try {
      const search = req.query.search?.toString(); // ejemplo: ?search=juan
      const useCase = new SearchUsers(repository);
      const users = await useCase.execute(search);
      const results = users.map((user) => ({
        id: user.id,
        userName: user.userName,
        email: user.email.getValue(),
      }));
      res.status(200).json(results);
    } catch (err) {
      res.status(500).json({ message: "Error al buscar usuarios", error: err });
    }
  });

  // Obtener usuario por ID
  router.get("/:id", async (req: Request, res: Response) => {
    try {
      const useCase = new GetUser(repository);
      const user = await useCase.execute(req.params.id);
      if (!user) {
        res.status(404).json({ message: "Usuario no encontrado" });
        return;
      }
      res.status(200).json({
        id: user.id,
        userName: user.userName,
        email: user.email.getValue(),
      });
    } catch (err) {
      res.status(500).json({ message: "Error al obtener usuario", error: err });
    }
  });

  // Actualizar usuario
  router.put(
    "/:id",
    validateSchema(UserUpdateSchema),
    async (req: Request, res: Response) => {
      try {
        const useCase = new UpdateUser(repository, hasher);
        const user = await useCase.execute(req.params.id, req.body);
        res.status(200).json({
          id: user.id,
          userName: user.userName,
          email: user.email.getValue(),
        });
      } catch (err) {
        res
          .status(500)
          .json({ message: "Error al actualizar usuario", error: err });
      }
    }
  );

  // Eliminar usuario
  router.delete("/:id", async (req: Request, res: Response) => {
    try {
      const useCase = new DeleteUser(repository);
      await useCase.execute(req.params.id);
      res.status(204).send();
    } catch (err) {
      res
        .status(500)
        .json({ message: "Error al eliminar usuario", error: err });
    }
  });

  return router;
}
