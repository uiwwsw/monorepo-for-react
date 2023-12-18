import { ReactNode } from 'react';

/* ======   interface   ====== */
export interface ControlItemProps {
  title: string;
  children?: ReactNode;
  on?: boolean;
}
/* ======    global     ====== */
const ControlItem = ({ title, children, on = true }: ControlItemProps) => {
  /* ======   variables   ====== */
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  return (
    <div>
      <h3>{title}</h3>
      <div className="flex gap-2 [&>*]:uppercase items-center">
        <span className="bg-lime-600 text-white font-bold p-2 rounded-lg">{on ? 'on' : 'off'}</span>
        {children}
      </div>
    </div>
  );
};

export default ControlItem;
