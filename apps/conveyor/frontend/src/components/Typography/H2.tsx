import { ReactNode } from 'react';
/* ======   interface   ====== */
export interface H2Props {
  children: ReactNode;
}

/* ======    global     ====== */
const H2 = ({ children }: H2Props) => {
  /* ======   variables   ====== */
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  return <h2 className="text-xl font-bold first-letter:uppercase">{children}</h2>;
};

export default H2;
