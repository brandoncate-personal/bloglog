import { getAssetFromKV, serveSinglePageApp } from '@cloudflare/kv-asset-handler'

// import { Router } from 'itty-router'

// // host
// const MAIN_HOST = 'bloglog.brandoncate95.workers.dev'

// // Create a new router
// const router = Router()

// const proxyTo = hostname => request => {
//   // Point to backend
//   const url = new URL(request.url);
//   const forwardedHost = url.hostname;
//   url.hostname = hostname;

//   // Build request. Keep track of the original Host.
//   const req = new Request(url, request);
//   req.headers.append('X-Forwarded-Host', forwardedHost);

//   // Execute request
//   return fetch(req);
// }

// router.all('*', proxyTo(MAIN_HOST))

// /*
// This snippet ties our worker to the router we deifned above, all incoming requests
// are passed to the router where your routes are called and the response is sent.
// */
// addEventListener('fetch', (e) => {
//   e.respondWith(router.handle(e.request))
// })

/**
 * The DEBUG flag will do two things that help during development:
 * 1. we will skip caching on the edge, which makes it easier to
 *    debug.
 * 2. we will return an error message on exception in your Response rather
 *    than the default 404.html page.
 */
const DEBUG = false

addEventListener('fetch', event => {
  try {
    event.respondWith(handleEvent(event))
  } catch (e) {
    if (DEBUG) {
      return event.respondWith(
        new Response(e.message || e.toString(), {
          status: 500,
        }),
      )
    }
    event.respondWith(new Response('Internal Error', { status: 500 }))
  }
})

async function handleEvent(event) {
  const url = new URL(event.request.url)
  let options = {}

  /**
   * You can add custom logic to how we fetch your assets
   * by configuring the function `mapRequestToAsset`
   */
  options.mapRequestToAsset = serveSinglePageApp

  try {
    if (DEBUG) {
      // customize caching
      options.cacheControl = {
        bypassCache: true,
      };
    }
    const page = await getAssetFromKV(event, options);
    console.log(page)

    // allow headers to be altered
    const response = new Response(page.body, page);

    response.headers.set("X-XSS-Protection", "1; mode=block");
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("Referrer-Policy", "unsafe-url");
    response.headers.set("Feature-Policy", "none");

    return response;

  } catch (e) {
    // if an error is thrown try to serve the asset at 404.html
    if (!DEBUG) {
      try {
        let notFoundResponse = await getAssetFromKV(event, {
          mapRequestToAsset: req => new Request(`${new URL(req.url).origin}/404.html`, req),
        })

        return new Response(notFoundResponse.body, { ...notFoundResponse, status: 404 })
      } catch (e) { }
    }

    return new Response(e.message || e.toString(), { status: 500 })
  }
}

/**
 * Here's one example of how to modify a request to
 * remove a specific prefix, in this case `/docs` from
 * the url. This can be useful if you are deploying to a
 * route on a zone, or if you only want your static content
 * to exist at a specific path.
 */
// function handlePrefix(prefix) {
//   return request => {
//     // compute the default (e.g. / -> index.html)
//     let defaultAssetKey = mapRequestToAsset(request)
//     let url = new URL(defaultAssetKey.url)

//     // strip the prefix from the path for lookup
//     url.pathname = '/' // url.pathname.replace(prefix, '/')

//     console.log(url.pathname)

//     // inherit all other props from the default request
//     return new Request(url.toString(), defaultAssetKey)
//   }
// }