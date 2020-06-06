import { RouterContext } from "../deps.ts";

export function getHome(ctx: RouterContext) {
  ctx.response.body = "TODO list API built with Deno 🦕";
}
