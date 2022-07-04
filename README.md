# remix-supertyped

utilize superjson and improve type safety for Remix's loader and action data

## Install

```sh
# npm
npm install remix-supertyped

# yarn
yarn add remix-supertyped

# pnpm
pnpm add remix-supertyped
```

## Usage

```jsx
...
import { json, useLoaderData } from 'remix-supertyped';

export const loader = async ({ request }: DataFunctionArgs) => {
  return json({ date: new Date() });
};

export default function App() {
  const { date } = useLoaderData<typeof loader>();

  console.log(date.toISOString());
  ...
}
```
