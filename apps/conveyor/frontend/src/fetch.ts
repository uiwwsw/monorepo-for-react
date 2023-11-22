import { Auth } from '!/auth/domain';
import { LocalStorage } from '@package-frontend/utils';
const originalFetch = window.fetch;
let auth = LocalStorage.get<Auth>('/check-auth');

window.fetch = function (input, init) {
  if (!init) {
    init = {};
  }
  if (!init.headers) {
    init.headers = new Headers();
  }

  if (!auth) auth = LocalStorage.get<Auth>('/check-auth');
  // init.headers could be:
  //   `A Headers object, an object literal,
  //    or an array of two-item arrays to set request’s headers.`
  if (auth?.session) {
    if (init.headers instanceof Headers) {
      init.headers.append('x-access-token', auth.session);
    } else if (init.headers instanceof Array) {
      init.headers.push(['x-access-token', auth.session]);
    } else {
      // object ?
      init.headers['x-access-token'] = auth.session;
    }
  }
  return originalFetch(input, init);
};
