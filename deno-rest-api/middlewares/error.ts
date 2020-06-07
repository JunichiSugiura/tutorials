import { Context, isHttpError, Status } from "../deps.ts";
import { createErrorBody } from "./utils.ts";

export async function errorHandler(
  ctx: Context,
  next: () => Promise<void>,
): Promise<void> {
  try {
    await next();
  } catch (error) {
    if (!isHttpError(error)) {
      ctx.response.status = Status.InternalServerError;
      ctx.response.body = createErrorBody(error);
      return;
    }

    switch (error.status) {
      case Status.NotFound:
        ctx.response.status = Status.NotFound;
        ctx.response.body = createErrorBody("Page not found");
      default:
        ctx.response.status = Status.InternalServerError;
        ctx.response.body = createErrorBody(error);
    }
  }
}
