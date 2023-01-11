import stringify from "fast-json-stable-stringify";

export type CacheManagerOptions = {
  getKey?: (param: unknown) => string;
};

export function getCacheManager<T>({ getKey = stringify }: CacheManagerOptions = {}) {
  const cache: Record<string, T> = {};

  function cacheHandler(func: () => T, keyObj: unknown): T;
  function cacheHandler(func: () => Promise<T>, keyObj: unknown): Promise<T>;
  function cacheHandler(func: () => T | Promise<T>, keyObj: unknown): T | Promise<T> {
    const key = getKey(keyObj);
    if (key in cache) return cache[key];
    const result = func();
    if (result instanceof Promise) {
      return result.then((res) => (cache[key] = res));
    } else {
      cache[key] = result;
      return result;
    }
  }

  function usePromise(func: () => Promise<T>, deps: React.DependencyList): T {
    const result = cacheHandler(func, deps);
    if (result instanceof Promise) {
      throw result;
    }
    return result;
  }

  return {
    cache,
    cacheHandler,
    usePromise,
  };
}
