// import { createLogger } from '@package-frontend/utils';
import { ReactNode } from 'react';
import Sidebar from '@/Sidebar/index';
// import { useCheckAuth } from '!/auth/application/get-check-auth';
/* ======   interface   ====== */
export interface LayoutWrapProps {
  children?: ReactNode;
}

/* ======    global     ====== */
// const logger = createLogger('components/Layout/Wrap');
const LayoutWrap = ({ children }: LayoutWrapProps) => {
  /* ======   variables   ====== */
  // const { t } = useTranslation();
  // const { data } = useCheckAuth();
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-auto flex flex-col max-lg:max-w-full">{children}</div>
    </div>
  );
};

export default LayoutWrap;
