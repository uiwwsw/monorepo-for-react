import { createLogger } from '@package-frontend/utils';
import Button from './Button';
import { useState } from 'react';
import { WithEval } from '#/componentTypes';
import { Size } from './Size';

/* ======   interface   ====== */
export interface ChipProps extends WithEval<number> {
  labels: (string | number)[];
  className?: string;
  defaultValue?: number[];
  multiChoice?: boolean;
  themeSize?: Size;
  onChange?: (index: number) => void;
}
/* ======    global     ====== */
const logger = createLogger('components/Chip');
const Chip = ({ labels, className, defaultValue = [], multiChoice = true, themeSize = 'xs', onChange }: ChipProps) => {
  /* ======   variables   ====== */
  const [active, setActive] = useState(defaultValue);
  const chipClassName = `[&>*+*]:ml-2 ${className ? ` ${className}` : ''}`;
  /* ======   function    ====== */
  const handleClick = (index: number) => {
    multiChoice
      ? setActive((prev) => (prev.includes(index) ? prev.filter((x) => x !== index) : [...prev, index]))
      : setActive([index]);
    onChange && onChange(index);
  };
  /* ======   useEffect   ====== */
  logger('render');
  return (
    <div className={chipClassName}>
      {labels.map((x, index) => (
        <Button
          key={`${x}_${index}`}
          onClick={() => handleClick(index)}
          themeColor={active.includes(index) ? 'secondary' : 'tertiary'}
          themeSize={themeSize}
          // className='bg-transparent'
        >
          {x}
        </Button>
      ))}
    </div>
  );
};

export default Chip;
