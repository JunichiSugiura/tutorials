import { RouterContext, Status } from "../deps.ts";
import { todoModel } from "../model/mod.ts";
import { createErrorBody } from "../util.ts";

export async function getAll(ctx: RouterContext) {
  const data = await todoModel.getAll();
  ctx.response.status = Status.OK;
  ctx.response.body = { data };
}

export async function get(ctx: RouterContext) {
  const [todos, error] = await todoModel.get(ctx.params as todoModel.GetParams);
  if (error) {
    return handleError(ctx, error);
  }

  ctx.response.status = Status.OK;
  ctx.response.body = { data: todos };
}

export async function create(ctx: RouterContext) {
  await todoModel.create(ctx.params as todoModel.CreateParams);
  ctx.response.status = Status.OK;
  ctx.response.body = { data: "success" };
}

export async function update(ctx: RouterContext) {
  const [_, error] = await todoModel.update(
    ctx.params as todoModel.UpdateParams,
  );

  if (error) {
    return handleError(ctx, error);
  }

  ctx.response.status = Status.OK;
  ctx.response.body = { data: "success" };
}

export async function remove(ctx: RouterContext) {
  const [_, error] = await todoModel.remove(
    ctx.params as todoModel.RemoveParams,
  );

  if (error) {
    return handleError(ctx, error);
  }

  ctx.response.status = Status.OK;
  ctx.response.body = { data: "success" };
}

function handleError(ctx: RouterContext, error: Error): void {
  ctx.response.status = Status.BadRequest;
  ctx.response.body = createErrorBody(error);
}
