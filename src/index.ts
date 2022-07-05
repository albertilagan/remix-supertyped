import { useActionData as useRemixActionData, useLoaderData as useRemixLoaderData } from '@remix-run/react';
import type { DataFunctionArgs, HtmlMetaDescriptor, MetaFunction } from '@remix-run/server-runtime';
import { json as remixJson, redirect as remixRedirect } from '@remix-run/server-runtime';

import superjson from 'superjson';
import type { SuperJSONResult } from 'superjson/dist/types';

export type MetaArgs = Parameters<MetaFunction>[0];

export type SuperJsonMetaFunction<Data> = {
  (args: Omit<MetaArgs, 'data'> & { data: Data }): HtmlMetaDescriptor;
};

export type ResponseTyped<Data> = Omit<Response, 'json'> & {
  json(): Promise<Data>;
};

export type ActionErrors<T> = Partial<Record<keyof T, string>>;

export type MaybePromise<Value> = Value | PromiseLike<Value>;

export type DataFunctionTyped<Result> = (args: DataFunctionArgs) => MaybePromise<ResponseTyped<Result>>;

export type InferDataFunctionResult<DataFunction> = DataFunction extends DataFunctionTyped<infer Data> ? Data : unknown;

// Remix overwride

export function json<Input>(data: Input, init?: ResponseInit | number) {
  return remixJson(superjson.serialize(data), init) as ResponseTyped<Input>;
}

export function jsonError<Input>(data: ActionErrors<Input>, init?: ResponseInit | number) {
  return remixJson(superjson.serialize({ errors: data }), init) as ResponseTyped<{ errors?: ActionErrors<Input> }>;
}

export function useLoaderData<DataFunction extends DataFunctionTyped<any>>() {
  const data = useRemixLoaderData<SuperJSONResult>();
  return superjson.deserialize<InferDataFunctionResult<DataFunction>>(data);
}

export function useActionData<DataFunction extends DataFunctionTyped<any>>() {
  const data = useRemixActionData<SuperJSONResult>();
  if (!data) return;
  return superjson.deserialize<InferDataFunctionResult<DataFunction>>(data);
}

export function withSuperJson<Data>(metaFn: MetaFunction): SuperJsonMetaFunction<Data> {
  return ({ data, ...rest }: MetaArgs) => {
    return metaFn({ ...rest, data: superjson.deserialize<Data>(data) });
  };
}

export function redirect(url: string, init?: number | ResponseInit) {
  return remixRedirect(url, init) as ResponseTyped<never>;
}
