import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { Tab } from 'src/routes';
import Link from './Link';
/* ======   interface   ====== */
export interface GroupLinkProps {
  routes: Tab[];
}

/* ======    global     ====== */
// const logger = createLogger('components/GroupLink');
const GroupLink = ({ routes }: GroupLinkProps) => {
  /* ======   variables   ====== */
  const { t } = useTranslation();

  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  return (
    <div className="p-2 flex flex-col gap-3">
      {routes.map((tab) => (
        <Fragment key={tab.path}>
          <Link
            to={tab.path}
            commonClassName="text-gray-400 hover:text-gray-300 text-xl"
            className={({ isActive }) => (isActive ? ' !text-white' : '')}
          >
            <div className="text-xl">
              <span className="mr-2 text-lg">{tab.icon}</span>
              {t(tab.name)}
            </div>
          </Link>
          {tab.group && (
            <div className="flex flex-col gap-0 -mt-2">
              {tab.group.map((x) => (
                <Link
                  key={x.path}
                  commonClassName="text-gray-400 hover:text-gray-300 ml-7 text-base"
                  className={({ isActive }) => `${isActive ? '!text-white' : ''}`}
                  to={x.path}
                >
                  {t(x.name)}
                </Link>
              ))}
            </div>
          )}
        </Fragment>
      ))}
    </div>
  );
};

export default GroupLink;
