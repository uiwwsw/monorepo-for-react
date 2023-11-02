import { createLogger } from '@package-frontend/utils';
import Button from './Button';
import { useState } from 'react';
import { WithEval } from '#/componentTypes';

/* ======   interface   ====== */
export interface ChipProps extends WithEval<number> {
  labels: (string | number)[];
  className?: string;
  defaultValue?: number;
}
/* ======    global     ====== */
const logger = createLogger('components/Chip');
const Chip = ({ labels, className, defaultValue, onEval }: ChipProps) => {
  /* ======   variables   ====== */
  const [active, setActive] = useState(defaultValue ?? -1);
  const chipClassName = `[&>*+*]:ml-2 ${className ? ` ${className}` : ''}`;
  /* ======   function    ====== */
  const handleClick = (index: number) => {
    setActive(index);
    onEval && onEval(index);
  };
  /* ======   useEffect   ====== */
  logger('render');
  return (
    <div className={chipClassName}>
      {labels.map((x, index) => (
        <Button
          onClick={() => handleClick(index)}
          themeColor={active === index ? 'secondary' : 'tertiary'}
          themeSize="xs"
          // className='bg-transparent'
        >
          {x}
        </Button>
      ))}
    </div>
  );
};

export default Chip;
