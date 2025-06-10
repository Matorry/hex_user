import express from "express";
import { LoginUser } from "../../user/application/LoginUser";
import { UserRepositoryPostgreSQLPrisma } from "../../user/infrastructure/UserRepositoryPostgreSQLPrisma";
import { JwtService } from "../../user/infrastructure/auth/JwtService";
import { BcryptService } from "../../user/infrastructure/security/BcryptService";

const router = express.Router();
const repository = new UserRepositoryPostgreSQLPrisma();
const jwtService = new JwtService();
const hash = new BcryptService();

router.post("/login", async (req, res) => {
  try {
    const { email, pswd } = req.body;
    const useCase = new LoginUser(repository, jwtService, hash);
    const result = await useCase.execute({ email, pswd });
    res.status(200).json(result);
  } catch (err: any) {
    res.status(401).json({ message: err.message ?? "Credenciales inválidas" });
  }
});

export default router;
