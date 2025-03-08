import * as Router from "../Modules/index.js";

const routes = (app) => {
  app.use("/auth", Router.authRouter);
  app.use("/user", Router.userRouter);
  app.use("/company", Router.companyRouter);
  app.use("/job", Router.jobRouter);
  app.use("/chat", Router.chatRouter);

  app.get("/", (req, res) => {
    res.send("Hello World! 👋🏼");
  });

  // app.use(globalErrorHandler);
};

export { routes };

