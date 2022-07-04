# remix-supertyped

Typescript support for Remix's loader and action data + superjson

## Usage

```
export const loader = async ({ request }: DataFunctionArgs) => {
  return json({ date: new Date() });
};

export default function App() {
  const { date } = useLoaderData<typeof loader>();

  console.log(date.toISOString());

  return <div>Remix Full Typesafe + superjson</div>
}
```
