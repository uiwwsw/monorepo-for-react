import { createLogger } from '@package-frontend/utils';
import { createElement } from 'react';
import { NavLink } from 'react-router-dom';
import { ParentTab } from '../../routes';
import { useTranslation } from 'react-i18next';
/* ======   interface   ====== */
export interface GroupLinkProps {
  routes: ParentTab[];
}

/* ======    global     ====== */
const logger = createLogger('components/GroupLink');
const GroupLink = ({ routes }: GroupLinkProps) => {
  /* ======   variables   ====== */
  const { t } = useTranslation();

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
            ? 'text-gray-400'
            : ({ isActive }) => 'text-gray-400 hover:text-gray-300' + (isActive ? ' text-white' : ''),
          children: (
            <>
              <span className="mr-2">{tab.icon}</span>
              {t(tab.name)}
              {tab.group?.map((x) => (
                <NavLink
                  key={x.path}
                  className={({ isActive }) => 'text-gray-400 hover:text-gray-300' + (isActive ? ' text-white' : '')}
                  to={`${x.path}`}
                >
                  {t(x.name)}
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
