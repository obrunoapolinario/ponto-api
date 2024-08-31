import { Hono } from "hono";
import { getConnInfo } from "hono/bun";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import { poweredBy } from "hono/powered-by";
import { prettyJSON } from "hono/pretty-json";
import { showRoutes, inspectRoutes } from "hono/dev";
import { env } from "./config/env";

const app = new Hono();

app.use(
	cors({
		origin: env.ALLOWED_ORIGINS.split(","),
	}),
);
app.use(logger());
app.use(poweredBy());
app.use(prettyJSON());

app.get("/", (c) => {
	return c.json({ message: "Hello, World!" });
});

app.get("/health", (c) => {
	return c.json({ status: "ok" }, 200);
});

env.NODE_ENV !== "production" &&
	app.get("/routes", (c) => {
		const routes = inspectRoutes(app).filter((route) => route.isMiddleware === false);
		return c.json({
			routes: routes.map((route) => {
				return {
					method: route.method,
					path: route.path,
				};
			}),
		});
	});

env.NODE_ENV !== "production" &&
	showRoutes(app, {
		colorize: true,
	});

export default app;
