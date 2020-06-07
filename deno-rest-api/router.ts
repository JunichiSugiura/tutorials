import { Router } from "./deps.ts";
import { rootHandler, todoHandler } from "./middlewares/mod.ts";

export const router = new Router();

router.get("/", rootHandler.getHome);

router.get("/todos", todoHandler.getAll);
router.get("/todos/:id", todoHandler.get);
router.post("/todos", todoHandler.create);
router.put("/todos/:id", todoHandler.update);
router.delete("/todos/:id", todoHandler.remove);
