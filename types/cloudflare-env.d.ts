/**
 * Bindings do ambiente Cloudflare Workers usado pela aplicação.
 *
 * `cloudflare:workers` expõe `env: Cloudflare.Env`, e o D1 não pode ser
 * inferido sozinho: sem esta declaração `env.DB` não existe para o TypeScript.
 */
interface AppEnv {
  DB: D1Database;
  ASSETS: Fetcher;
}

declare namespace Cloudflare {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type -- augmentation: soma os bindings do projeto ao Env do runtime
  interface Env extends AppEnv {}
}
