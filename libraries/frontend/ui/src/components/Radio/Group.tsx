import { WithTheme } from '#/componentTypes';
import Radio from '@/Radio/Base';
import { createLogger } from '@package-frontend/utils';
/* ======   interface   ====== */
export interface RadioGroupProps extends WithTheme {
  labels: (string | number)[];
  className?: string;
  defaultChecked?: number;
}
/* ======    global     ====== */
const logger = createLogger('components/RadioGroup');
const RadioGroup = ({
  labels,
  defaultChecked,
  themeColor = 'primary',
  themeSize = 'xl',
  className,
}: RadioGroupProps) => {
  /* ======   variables   ====== */
  const groupClassName = `[&>*]:m-2${className ? ` ${className}` : ''}`;
  const uuid = `${new Date().valueOf()}`;
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  logger('render');
  return (
    <div className={groupClassName} data-size={themeSize} data-color={themeColor}>
      {labels.map((label, index) => (
        <Radio key={uuid + label + index} name={uuid} defaultChecked={defaultChecked === index}>
          {`${label}`}
        </Radio>
      ))}
    </div>
  );
};

export default RadioGroup;
