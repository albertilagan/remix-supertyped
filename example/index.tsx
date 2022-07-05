import { json, redirect, useLoaderData } from '../src';

const isAuthenticated = false;

export const loader = () => {
  if (!isAuthenticated) {
    return redirect('/login');
  }

  return json({ date: new Date() });
};

export default function Example() {
  const data = useLoaderData<typeof loader>();
}
