import { Auth } from '!/auth/domain';
import { LocalStorage, createLogger } from '@package-frontend/utils';
const originalFetch = window.fetch;

window.fetch = function (input, init) {
  if (!init) {
    init = {};
  }
  if (!init.headers) {
    init.headers = new Headers();
  }

  const auth = LocalStorage.get<Auth>('/check-auth');

  // init.headers could be:
  //   `A Headers object, an object literal,
  //    or an array of two-item arrays to set request’s headers.`
  if (auth?.session) {
    if (init.headers instanceof Headers) {
      init.headers.append('session', auth.session);
    } else if (init.headers instanceof Array) {
      init.headers.push(['session', auth.session]);
    } else {
      // object ?
      init.headers['session'] = auth.session;
    }
  }
  return originalFetch(input, init);
};
