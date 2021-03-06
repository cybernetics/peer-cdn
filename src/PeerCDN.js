import { getInstall, getActivate, getFetch } from "./listeners";
import Router from "./router";

export default class PeerCDN {
  // If at any point you want to force pages that use this service worker to start using a fresh
  // cache, then increment the cacheVersion value. It will kick off the service worker update
  // flow and the old cache(s) will be purged as part of the activate event handler when the
  // updated service worker is activated.
  constructor() {
    this.router = new Router();
    this.register = this.register.bind(this);
    this.GET = this.GET.bind(this);
  }

  // Register middleware for a GET method and given route path with one of strategies
  GET(path, strategy, ...middleware) {
    this.router.use("GET", path, strategy, ...middleware);
  }

  // Register handlers for given service worker instance
  register() {
    [getInstall()].forEach((h) => self.addEventListener("install", h));
    [getActivate()].forEach((h) => self.addEventListener("activate", h));
    // Register fetch events from array.
    // When an event occurs, they're invoked one at a time, in the order that they're registered.
    // As soon as one handler calls event.respondWith(), none of the other registered handlers will be run.
    [getFetch(this.router)].forEach((h) => self.addEventListener("fetch", h));
  }
}
