# Things that I missed from using TypeScript

I've been using TypeScript for almost two years before switching back to Flow on live team. This experience gives me some new insite on what makes TS stands out comapare to Flow.
These are a collection of features that I missed the most using TypeScript.

## Install types for third-party moduels

- Scenario 1: Types come with third party module out of the box 📦
  - e.g. `index.ts`, `index.d.ts` in their package
- Scenario 2: Search at [DefinitelyTyped](https://definitelytyped.org/).
  - `yarn add -D @types/module-name`
- Scenario 3: If nothing exists, we'll create deifinistion files.
  - `touch src/@types/module-name.d.ts`

## Null and Undefined

`null` and `undefined` are actual type in TS.

```js
// @flow
const nothing: typeof undefined = undefined;
```

vs

```ts
const nothing: undefined = undefined;

function isString(str: string | undefined | null): boolean {
  return typeof str === "string";
}
```

## Enum

```ts
enum Color {
  Red,
  Green,
  Blue = 100,
}

console.log(Color.Red); // <- 0
console.log(Color.Blue); // <- 100
```

Enum also can be the Enum String.

This is pretty handy when you code a design pattern.

```ts
// Design Pattern Example #1
enum Color {
  Red = "#FF000",
  Green = "#00800",
  Blue = "#0000FF",
  Gray = "rgba(0, 0, 0, .8)",
}
```

```ts
// Design Pattern Example #2
enum Padding {
  Padding4 = 4,
  Padding8 = 8,
  Padding16 = 16,
}

enum WebPadding {
  Padding4 = "4px",
  Padding8 = "8px",
  Padding16 = "16px",
  VerticalPadding16 = "0 16px",
  HorizontalPadding16 = "16px 0",
}
```

## Interface

```tsx
// Greeting.tsx
export interface Props {
  message?: string; // <- string | undefined (aka. optional property)
}

export default function Greeting({ message = "Hi 👋" }: Props) {
  return <div>{message}</div>;
}
```

You can also extend from other interface

```tsx
// Home.tsx
import Greeting, { Props as GreetingProps } from "./Greeting";
// yes, you can import expressions and types in one line
// import type { Props } also works from v3.8

interface Props extends GreetingProps {
    isFirstTime: boolean;
}

export function Home({ isFirstTime, message }: Props) {
    return isFirstTime
        ? <Greeting message={message}>
        : <div>Welcome Back!</div>
}
```

```ts
interface ImmutablePoint {
  readonly x: number;
  readonly y: number;
}

const point: ImmutablePoint = {
  x: 0,
  y: 1,
};

console.log(point.x); // 0

points.x = 100; // error
```

We can even define function with interface 🤯

```
interface MultiplyFunc {
    (num1: number, num2: number) => number
}
```

We'll come back to it later.

### Redux Example

Here's a little redux module example using interface and enum together.

```ts
// Redux exmaple
interface State {
  counter: number;
}

const initialState = {
  counter: 0,
};

enum ActionType {
  Increment = "app/counter/INCREMENT",
  Reset = "app/counter/RESET",
}

type Action = IncrementAction | ResetAction;

interface IncrementAction {
  readonly type: ActionType.Increment;
  readonly payload: { num: number };
}

interface ResetAction {
  readonly type: ActionType.Reset;
}

// action creators
function increment(num: number = 1): IncrementAction {
  return {
    type: ActionType.Increment,
    payload: { num },
  };
}

function reset(): ResetAction {
  return {
    type: ActionType.Reset,
  };
}

function reducer(state: State = initialState, action: Action): State {
  switch (action.type) {
    case ActionType.Increment:
      return {
        ...state,
        counter: counter + action.payload.num,
      };
    case ActionType.Reset:
      return initialState;
    default:
      return state;
  }
}
```

## Generics

```ts
function Echo<T>(anything: T): T {
  return anything;
}
```

## Never

We don't use that often but I like the fact it exists.

```ts
function panic(): never {
  throw new Error("🚨PANIC🚨");
}
```

```ts
function meddle(): never {
  while (true) {
    window.prompt("How can I help you?");
  }
}
```

## Advancd Types

### Type Guards

> A type guard is some expression that performs a runtime check that guarantees the type in some scope.

```ts
enum TransactionMode {
  Tron = "tron",
  Cosmos = "cosmos",
}

interface Transaction {
  mode: TransactionMode;
  tronResources?: Resources;
  cosmosResources?: Resources;
}

interface Resources {
  validators: [];
}

interface TronTransaction extends Transaction {
  mode: TransactionMode.Tron;
  tronResources: Resources;
}

interface CosmosTransaction extends Transaction {
  mode: TransactionMode.Cosmos;
  cosmosResources: Resources;
}

// this is called "type predicates"
function isTron(tx: Transaction): tx is TronTransaction {
  return (
    tx.mode === TransactionMode.Tron && typeof tx.tronResources !== "undefined"
  );
}

function isCosmos(tx: Transaction): tx is CosmosTransaction {
  return (
    tx.mode === TransactionMode.Cosmos &&
    typeof tx.cosmosResources !== "undefined"
  );
}

function getValidators(tx: Transaction): Resources["validators"] {
  if (isTron(tx)) {
    return tx.tronResources.validators;
  }
  if (isCosmos(tx)) {
    return tx.cosmosResources.validators;
  }

  throw new Error("Don't know how to handle this 🤷‍♀️");
}

const tx = {
  mode: TransactionMode.Cosmos,
  //   ...
};

const validators = getValidators(tx);

console.log(validators); // error 🤷‍♀️
```

### Index types

```ts
const tx: CosmosTransaction = {
  mode: TransactionMode.Cosmos,
  cosmosResources: {
    validators: [],
  },
};

function getTransactionFields<T extends Transaction, K extends keyof T>(
  tx: T,
  keys: K[]
): T[K][] {
  return keys.map((k) => tx[k]);
}

const fields = getTransactionFields(tx, ["mode", "cosmosResouces"]);
// Type '"cosmosResouces"' is not assignable to type '"mode" | "cosmosResources" | "tronResources"'.
console.log(fields);
```

## Utility Types

This is my favorite section.

TODO

### Partial\<T\>

### Pick\<K,T\>

### Omit\<K,T\>

### Parameters\<T\>

### ReturnType\<T\>

TODO

## Tips

### Should I use Alias or Interface?

> Because an ideal property of software is being open to extension, you should always use an interface over a type alias if possible.
> On the other hand, if you can’t express some shape with an interface and you need to use a union or tuple type, type aliases are usually the way to go.

## Pitfalls coming from Flow

_In other words, "Don't code this way in our repo anymore"._

### `*` !== `any` && `*` === 🤷‍♀️

TS doesn't understand `*`. Use `any` insteaded or even better, just write proper type for it 😎

### In TypeScript `Object` type is equal to empty object.

```js
// @flow
const obj: Object = { message: "hi" }; //works
```

vs

```ts
const obj: Object = {}; // this only works
const obj2: { [key: string]: any } = { message: "hi" };
```

### A function argument need its name.

```js
// @flow
type EchoFunc = (string) => void;
```

vs

```ts
type EchoFunc = (message: string) => void;
// or
interface EchoFunc {
    (message: string) => void;
}
```

```ts
// X number of arguments
type SumFunc = (...nums: number[]): number;
```

### MaybeType is not supported

```js
// @flow
interface Props {
  account: ?Account;
}
```

vs

```ts
interface Props {
  account: Account | undefined | null;
}
```

### React file needs .tsx extension
