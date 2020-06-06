import { uuid } from "../deps.ts";
import { toMap, fromMap } from "./util.ts";

interface Todo {
  id: string;
  title: string;
  done: boolean;
  createdAt: string;
  updatedAt: string;
}

const FILE_PATH = "./db/todos.json";

export async function getAll(): Promise<Todo[]> {
  const decoder = new TextDecoder();
  const data = await Deno.readFile(FILE_PATH);

  return JSON.parse(decoder.decode(data));
}

type Result<T> = [T, undefined] | [undefined, Error];

export async function get(
  { id }: Pick<Todo, "id">,
): Promise<Result<Todo>> {
  const todos = await getAll();
  const todo = toMap(todos).get(id);
  if (!todo) {
    return [undefined, new Error("Cannot find item")];
  }
  return [todo, undefined];
}

export async function updateAll(todos: Todo[]): Promise<true> {
  const encoder = new TextEncoder();
  Deno.writeFile(
    FILE_PATH,
    encoder.encode(JSON.stringify(todos)),
  );
  return true;
}

export async function create(
  { title }: Pick<Todo, "title">,
): Promise<true> {
  const todos = await getAll();
  const id = uuid.generate();

  const now = new Date().toISOString();
  await updateAll([
    ...todos,
    {
      id,
      done: false,
      title,
      createdAt: now,
      updatedAt: now,
    },
  ]);

  return true;
}

export async function update(
  params: Partial<Todo> & Pick<Todo, "id">,
): Promise<Result<true>> {
  const todos = await getAll();
  const todoMap = toMap(todos);
  const current = todoMap.get(params.id);

  if (!current) {
    return [undefined, new Error("Cannot find item")];
  }

  todoMap.set(
    params.id,
    { ...current, ...params, updatedAt: new Date().toISOString() },
  );
  await updateAll(fromMap(todoMap));
  return [true, undefined];
}

export async function remove(
  { id }: Pick<Todo, "id">,
): Promise<Result<true>> {
  const todos = await getAll();
  const todoMap = toMap(todos);

  if (!todoMap.has(id)) {
    return [undefined, new Error("Cannot find item")];
  }

  todoMap.delete(id);
  await updateAll(fromMap(todoMap));
  return [true, undefined];
}
