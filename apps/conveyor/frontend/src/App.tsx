import { lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PrivateLayout from './layouts/PrivateLayout';
import PublicLayout from './layouts/PublicLayout';
import { authRoutes, commonRoutes } from './routes';
const Main = lazy(() => import('./pages/Main'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Loading = lazy(() => import('./pages/Loading'));
const Error = lazy(() => import('./pages/Error'));
const SignOut = lazy(() => import('./pages/SignOut'));
// import { createLogger } from '@package-frontend/utils';
/* ======   interface   ====== */
/* ======    global     ====== */
// const logger = createLogger('App');

const App = () => {
  /* ======   variables   ====== */
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  return (
    <Router>
      <Routes>
        <Route element={<PrivateLayout />}>
          {authRoutes.map((x) => (
            <Route key={x.name} path={x.path} element={<x.node />} />
          ))}
        </Route>

        <Route element={<PublicLayout />}>
          {commonRoutes.map((x) => (
            <Route key={x.name} path={x.path} element={<x.node />} />
          ))}
          <Route path="/" element={<Main />} />
          <Route path="/loading" element={<Loading />} />
          <Route path="/error" element={<Error />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="/sign-out" element={<SignOut />} />
      </Routes>
    </Router>
  );
};

export default App;
