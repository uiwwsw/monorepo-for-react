import { createLogger } from '@package-frontend/utils';
import logo from '../../assets/logo.png';
import { Link } from 'react-router-dom';
import { authRoutes, commonRoutes } from '../../routes';
import GroupLink from './GroupLink';
/* ======   interface   ====== */
export interface NavProps {}

/* ======    global     ====== */
const logger = createLogger('components/Nav');
const Nav = (_: NavProps) => {
  /* ======   variables   ====== */
  // const [openTabs, setOpenTabs] = useState<number[]>([]);

  /* ======   function    ====== */
  // const handleTabClick = (index: number) => {
  //   if (openTabs.includes(index)) {
  //     setOpenTabs(openTabs.filter((x) => x !== index));
  //   } else {
  //     setOpenTabs([...openTabs, index]);
  //   }
  // };

  /* ======   useEffect   ====== */
  logger('render');
  return (
    <div className="sticky z-20 flex flex-col top-0 basis-52 bg-gray-700 text-slate-200 h-screen shadow-2xl">
      <nav className="flex flex-col flex-auto">
        <div className="flex-auto">
          <Link to="/" className="block p-4">
            <img src={logo} alt="Logo" className="block w-32 m-auto" />
          </Link>
          <hr />
          <GroupLink routes={authRoutes} />
        </div>
        <hr className="border-dashed" />
        <GroupLink routes={commonRoutes} />
      </nav>
      <hr />
      <footer className="text-white text-[10px] p-2 pt-0 text-center">
        © 2023 semi-ts, Inc. all rights reserved.
      </footer>
    </div>
  );
};

export default Nav;
