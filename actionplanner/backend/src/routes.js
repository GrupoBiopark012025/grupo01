import { Router } from "express";
import hateoas from "./middlewares/hateoas.js";
import handler from "./middlewares/handlers.js";
// import InternalServerError from "./routes/helper/500.js";
// import NotFound from "./routes/helper/404.js";

import AuthRouter from "./routes/authRouter.js";
import UserRouter from "./routes/userRouter.js";
import ClientRouter from "./routes/clientRouter.js";
import SectorRouter from "./routes/sectorRouter.js";
import TasksRouter from "./routes/tasksRouter.js";
import ActionPlanRouter from "./routes/actionPlanRouter.js";
import ProjectRouter from "./routes/projectRouter.js";

const routes = Router();

routes.use(hateoas);
routes.use(handler);

// Health check
routes.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'ActionPlanner API'
  });
});

routes.use("/api/auth", AuthRouter);
routes.use("/api/users", UserRouter);
routes.use("/api/clients", ClientRouter);
routes.use("/api/sectors", SectorRouter);
routes.use("/api/tasks", TasksRouter);
routes.use("/api/actionPlans", ActionPlanRouter);
routes.use("/api/projects", ProjectRouter);

export default routes;