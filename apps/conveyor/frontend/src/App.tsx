import { lazy, Fragment } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PrivateLayout from 'src/layouts/PrivateLayout';
import PublicLayout from 'src/layouts/PublicLayout';
import { authRoutes, commonRoutes } from 'src/routes';
const Main = lazy(() => import('./pages/Main'));
const NotFound = lazy(() => import('src/pages/NotFound'));
const Loading = lazy(() => import('src/pages/Loading'));
const Error = lazy(() => import('src/pages/Error'));
const SignOut = lazy(() => import('src/pages/SignOut'));
// import { createLogger } from '#/logger';
/* ======   interface   ====== */
/* ======    global     ====== */
// const logger = createLogger('App');

const App = () => {
  /* ======   variables   ====== */
  // const t = import.meta.env.VITE_APP
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  return (
    <Router>
      <Routes>
        <Route element={<PrivateLayout />}>
          {authRoutes.map((x, i) => (
            <Fragment key={x.name + i}>
              <Route path={x.path} element={<x.node />} />
              {x.group && x.group.map((y) => <Route key={x.name + y.name} path={y.path} element={<y.node />} />)}
            </Fragment>
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
