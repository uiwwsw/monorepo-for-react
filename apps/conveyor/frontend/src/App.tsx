import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PrivateLayout from './layouts/PrivateLayout';
import PublicLayout from './layouts/PublicLayout';
import Main from './pages/Main';
import NotFound from './pages/NotFound';
import { authRoutes, commonRoutes } from './routes';
import Loading from './pages/Loading';
import Error from './pages/Error';
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
          {authRoutes.map((x) =>
            x.group ? (
              x.group.map((y) => <Route key={y.name} path={y.path} element={<y.node />} />)
            ) : (
              <Route key={x.name} path={x.path} element={<x.node />} />
            ),
          )}
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
      </Routes>
    </Router>
  );
};

export default App;
