import { createLogger } from '@package-frontend/utils';
import { createElement } from 'react';
import { NavLink } from 'react-router-dom';
import { ParentTab } from '../../routes';
/* ======   interface   ====== */
export interface GroupLinkProps {
  routes: ParentTab[];
}

/* ======    global     ====== */
const logger = createLogger('components/GroupLink');
const GroupLink = ({ routes }: GroupLinkProps) => {
  /* ======   variables   ====== */
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  logger('render');
  return (
    <div className="p-2 flex flex-col gap-5">
      {routes.map((tab, index) =>
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
                  className={({ isActive }) => 'text-gray-400 hover:text-gray-300' + (isActive ? ' text-white' : '')}
                  to={`${x.path}`}
                >
                  {x.name}
                </NavLink>
              ))}
            </>
          ),
        }),
      )}
    </div>
  );
};

export default GroupLink;
