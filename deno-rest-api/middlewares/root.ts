import { Context } from "../deps.ts";

export function getHome(ctx: Context) {
  ctx.response.body = "TODO list API built with Deno 🦕";
}
