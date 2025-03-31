import { DurableObject } from "cloudflare:workers";

/**
 * Env provides a mechanism to reference bindings declared in wrangler.jsonc within JavaScript
 *
 * @typedef {Object} Env
 * @property {DurableObjectNamespace} MY_DURABLE_OBJECT - The Durable Object namespace binding
 */

/** A Durable Object's behavior is defined in an exported Javascript class */
export class GeminiProxy extends DurableObject {
	/**
	 * The constructor is invoked once upon creation of the Durable Object, i.e. the first call to
	 * 	`DurableObjectStub::get` for a given identifier (no-op constructors can be omitted)
	 *
	 * @param {DurableObjectState} ctx - The interface for interacting with Durable Object state
	 * @param {Env} env - The interface to reference bindings declared in wrangler.jsonc
	 */
	constructor(ctx, env) {
		super(ctx, env);
	}

	async fetch(req) {
		return fetch(req);
	}
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/") {
      return new Response("Hello", {
        status: 200,
      });
    }

    // 添加跨域支持
    let corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
      "Access-Control-Allow-Headers": request.headers.get(
        "Access-Control-Request-Headers"
      ),
    };

    // 如果是预检请求，直接返回跨域头
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

		let targetURL = new URL("https://generativelanguage.googleapis.com");

    targetURL.pathname = url.pathname;
    targetURL.search = url.search;

		let newRequest = new Request(targetURL, {
      method: request.method,
      headers: request.headers,
      body: request.body,
    });

		const id = env.MY_DURABLE_OBJECT.idFromName("gemini");

		// https://developers.cloudflare.com/durable-objects/reference/data-location/
		const stub = env.MY_DURABLE_OBJECT.get(id, { locationHint: "wnam" });

		let response = await stub.fetch(newRequest);

    // 复制响应以添加新的头
    let responseHeaders = new Headers(response.headers);
    for (let [key, value] of Object.entries(corsHeaders)) {
      responseHeaders.set(key, value);
    }

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  },
};
