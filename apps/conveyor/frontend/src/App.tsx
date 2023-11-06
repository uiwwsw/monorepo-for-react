import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NormalLayout from './layouts/NormalLayout';
import Main from './pages/Main';
import NotFound from './pages/NotFound';
import { authRoutes, commonRoutes } from './routes';
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
        <Route element={<NormalLayout />}>
          <Route path="/" element={<Main />} />
          {authRoutes.map((x) => (
            <Route key={x.name} path={x.path} element={<x.node />} />
          ))}
        </Route>
        {commonRoutes.map((x) => (
          <Route key={x.name} path={x.path} element={<x.node />} />
        ))}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
