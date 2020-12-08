export function fetchNoCORS(url: string, init?: RequestInit) {
  const wrappedURL = `https://thingproxy.freeboard.io/fetch/${url}`;
  return fetch(wrappedURL, init);
}
