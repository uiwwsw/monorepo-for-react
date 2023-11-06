import { createLogger } from '@package-frontend/utils';
import { createElement } from 'react';
import logo from '../assets/logo.png';
import { NavLink } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { authRoutes, commonRoutes } from '../routes';
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
    <div className="sticky z-10 flex flex-col top-0 basis-52 bg-gray-700 text-slate-200 h-screen">
      <nav className="flex flex-col flex-auto">
        <div className="flex-auto">
          <Link to="/" className="block p-4">
            <img src={logo} alt="Logo" className="block w-32 m-auto" />
          </Link>
          <hr />
          <div className="p-2 flex flex-col gap-5">
            {authRoutes.map((tab, index) =>
              createElement(tab.group ? 'span' : NavLink, {
                key: tab.path + index,
                to: tab.path,
                className: tab.group
                  ? ''
                  : ({ isActive }) => 'text-gray-400 hover:text-gray-300' + (isActive ? ' text-white' : ''),
                children: (
                  <>
                    <span className="mr-2">{tab.icon}</span>
                    {tab.name}
                    {tab.group?.map((x) => (
                      <NavLink
                        key={x.path}
                        className={({ isActive }) =>
                          'text-gray-400 hover:text-gray-300' + (isActive ? 'text-white' : '')
                        }
                        to={`${tab.path}/${x.path}`}
                      >
                        {x.name}
                      </NavLink>
                    ))}
                  </>
                ),
              }),
            )}
          </div>
        </div>
        <hr className="border-dashed" />
        <div className="p-2 flex flex-col gap-5 flex-0">
          {commonRoutes.map((tab, index) =>
            createElement(tab.group ? 'span' : NavLink, {
              key: tab.path + index,
              to: tab.path,
              className: tab.group
                ? ''
                : ({ isActive }) => `text-gray-400 hover:text-gray-300` + (isActive ? 'text-white' : ''),
              children: (
                <>
                  <span className="mr-2">{tab.icon}</span>
                  {tab.name}
                  {tab.group?.map((x) => (
                    <NavLink
                      key={x.path}
                      className={({ isActive }) =>
                        'text-gray-400 hover:text-gray-300' + (isActive ? ' text-white' : '')
                      }
                      to={`${tab.path}/${x.path}`}
                    >
                      {x.name}
                    </NavLink>
                  ))}
                </>
              ),
            }),
          )}
        </div>
      </nav>
      <hr />
      <footer className="text-white text-[10px] p-2 pt-0 text-center">
        © 2023 semi-ts, Inc. all rights reserved.
      </footer>
    </div>
  );
};

export default Nav;
