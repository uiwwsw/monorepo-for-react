import { useGetAuth } from '!/auth/application/get-auth';
import { ROUTES_PATH } from '!/routes/domain';
import { lazy, Fragment } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PrivateLayout from 'src/layouts/PrivateLayout';
import PublicLayout from 'src/layouts/PublicLayout';
import { authRoutes, commonRoutes, filterGradeRoute } from 'src/routes';
const Main = lazy(() => import('./pages/Main'));
const NotFound = lazy(() => import('src/pages/NotFound'));
const Loading = lazy(() => import('src/pages/Loading'));
const Error = lazy(() => import('src/pages/Error'));
const SignOut = lazy(() => import('src/pages/SignOut'));
// import { createLogger } from '@package-frontend/utils';
/* ======   interface   ====== */
/* ======    global     ====== */
// const logger = createLogger('Pages');

const Pages = () => {
  /* ======   variables   ====== */
  const { data: auth } = useGetAuth();
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  return (
    <Router>
      <Routes>
        <Route element={<PrivateLayout />}>
          {authRoutes
            .filter((x) => filterGradeRoute(x, auth))
            .map((x, i) => (
              <Fragment key={x.name + i}>
                <Route path={x.path} element={<x.node />} />
                {x.group &&
                  x.group
                    .filter((x) => filterGradeRoute(x, auth))
                    .map((y) => <Route key={x.name + y.name} path={y.path} element={<y.node />} />)}
              </Fragment>
            ))}
        </Route>

        <Route element={<PublicLayout />}>
          {commonRoutes.map((x) => (
            <Route key={x.name} path={x.path} element={<x.node />} />
          ))}
          <Route path={ROUTES_PATH['/']} element={<Main />} />
          <Route path="/loading" element={<Loading />} />
          <Route path="/error" element={<Error />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="/sign-out" element={<SignOut />} />
      </Routes>
    </Router>
  );
};

export default Pages;
