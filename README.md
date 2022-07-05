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

```jsx
...
type ActionInput = z.TypeOf<typeof loginSchema>;

export const action = async ({ request }: DataFunctionArgs) => {
  // Validation
  const { formData, errors } = await validateAction<ActionInput>(request, loginSchema);
  if (errors) return jsonError<ActionInput>(errors, { status: 400 });

  // Try login
  const { email, password } = formData;
  const user = await login(email, password);
  if (!user) {
    return jsonError<ActionInput>({ email: 'Invalid email or password' }, { status: 400 });
  }

  ...
};

export const meta = withSuperJson(({ data, location, params, parentsData }) => {
  ...
  return {
    title: 'Login',
  };
});

export default function LoginPage() {
  const actionData = useActionData<typeof action>();
  // actionData: {
  //   errors?: Partial<Record<"remember" | requiredKeys<{
  //       email: string;
  //       password: string;
  //       remember: "on" | undefined;
  //       redirectTo: string;
  //   }>, string>> | undefined;
  // }
  ...
}
```