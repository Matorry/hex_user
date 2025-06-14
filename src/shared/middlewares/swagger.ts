import path from "path";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

const swaggerDocument = YAML.load(path.join(__dirname, "../../../docs/swagger.yaml"));

export const swaggerDocs = {
  serve: swaggerUi.serve,
  setup: swaggerUi.setup(swaggerDocument)
};
