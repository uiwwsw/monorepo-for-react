import { ReactNode } from 'react';
/* ======   interface   ====== */
export interface H3Props {
  children: ReactNode;
}

/* ======    global     ====== */
const H3 = ({ children }: H3Props) => {
  /* ======   variables   ====== */
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  return <h3 className="text-2xl font-bold first-letter:uppercase">{children}</h3>;
};

export default H3;
