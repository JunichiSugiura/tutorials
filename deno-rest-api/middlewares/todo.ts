import { RouterContext, Status } from "../deps.ts";
import { todoModel } from "../models/mod.ts";
import { handleError, handleOK, getParams } from "./utils.ts";

export async function getAll(ctx: RouterContext) {
  const data = await todoModel.getAll();
  handleOK(ctx, data);
}

export async function get(ctx: RouterContext) {
  const params = await getParams(ctx);
  const [todos, error] = await todoModel.get(params);
  if (error) {
    return handleError(ctx, error);
  }

  handleOK(ctx, todos);
}

export async function create(ctx: RouterContext) {
  const params = await getParams(ctx);
  await todoModel.create(params);
  ctx.response.status = Status.OK;
  handleOK(ctx, "success");
}

export async function update(ctx: RouterContext) {
  const params = await getParams(ctx);
  const [_, error] = await todoModel.update(params);

  if (error) {
    return handleError(ctx, error);
  }

  handleOK(ctx, "success");
}

export async function remove(ctx: RouterContext) {
  const params = await getParams(ctx);
  const [_, error] = await todoModel.remove(params);

  if (error) {
    return handleError(ctx, error);
  }

  handleOK(ctx, "success");
}
