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

### Loader

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

### Redirect

Using `Remix`'s `redirect` which returns `Response` will overwrite our type-safety.

`remix-supertyped`'s `redirect` to the rescue.

```jsx
...
import { json, redirect, useLoaderData } from 'remix-supertyped';

export const loader = () => {
  if (!isAuthenticated) {
    return redirect('/login');
  }

  return json({ date: new Date() });
};

export default function Example() {
  const data = useLoaderData<typeof loader>();
  ...
}

```

```jsx
/* with remix's redirect + remix-supertyped's loader */
data: any;

/* remix-supertyped's redirect and loader */
data: {
  date: Date;
}
```

### Meta

Since we are serializing the data using `superjson` we need to `deserialize` it as well for the `meta` export.

```jsx
import { withSuperJson } from 'remix-supertyped';
export const meta = withSuperJson(({ data, location, params, parentsData }) => {
  ...
  return {
    title: 'Login',
  };
});
```

### Action

```jsx
...
import { jsonError, useActionData } from 'remix-supertyped';

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

export default function LoginPage() {
  const actionData = useActionData<typeof action>();
  ...
}
```

```jsx
/* with remix's useActionData */
actionData: any

/* remix-supertyped's useActionData */
actionData: {
  errors?: Partial<Record<"remember" | requiredKeys<{
    email: string;
    password: string;
    remember: "on" | undefined;
    redirectTo: string;
  }>, string>> | undefined;
}
```
