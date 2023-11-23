import { ButtonHTMLAttributes, MouseEvent, useCallback, useRef, useState } from 'react';
import { wait } from '@package-frontend/utils';
import useSmooth from '#/useSmooth';
import Spinner from '$/Spinner';
import generateRipple from '#/generateRipple';
import { createLogger } from '@package-frontend/utils';
import { WithTheme } from '#/componentTypes';

/* ======   interface   ====== */
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, WithTheme {
  disabled?: boolean;
  smoothLoading?: boolean;
}
/* ======    global     ====== */
const logger = createLogger('components/Button');
const textClassName =
  '[[data-smooth="SHOW"]>&]:invisible [[data-smooth="SHOWING"]>&]:animate-hide [[data-smooth="HIDING"]>&]:animate-show';
const spinnerClassName =
  'text-inherit absolute top-1/2 left-1/2 -m-2.5 [:not([data-smooth])>&]:hidden [[data-smooth="HIDE"]>&]:hidden [[data-smooth="SHOWING"]>&]:animate-show [[data-smooth="HIDING"]>&]:animate-hide';
const commonButtonClassName = `justify-center overflow-hidden relative transition border border-transparent`;
const ableButtonClassName = `
[&[data-color="primary"]]:bg-blue-500 [&[data-color="primary"]]:hover:bg-blue-600 
[&[data-color="secondary"]]:bg-slate-500 [&[data-color="secondary"]]:hover:bg-slate-600
[&[data-color="tertiary"]]:border-gray-300 [&[data-color="tertiary"]]:hover:border-gray-500
[&[data-color="quaternary"]]:bg-orange-500 [&[data-color="secondary"]]:hover:bg-orange-600
`;
const disabledButtonClassName = `
[&[data-color="primary"]]:bg-blue-300
[&[data-color="secondary"]]:bg-slate-300
[&[data-color="tertiary"]]:border-gray-100
[&[data-color="quaternary"]]:bg-orange-300
`;
const styledButtonClassName = `
[&[data-color="primary"]]:text-white
[&[data-color="secondary"]]:text-white
[&[data-color="tertiary"]]:text-gray-400
[&[data-color="quaternary"]]:text-white
`;
const sizeButtonClassName = `
[&[data-size="xs"]]:py-0 [&[data-size="xs"]]:px-3 [&[data-size="xs"]]:font-medium [&[data-size="xs"]]:text-xs [&[data-size="xs"]]:rounded-xs
[&[data-size="sm"]]:py-1 [&[data-size="sm"]]:px-4 [&[data-size="sm"]]:font-medium [&[data-size="sm"]]:text-sm [&[data-size="sm"]]:rounded-sm
[&[data-size="md"]]:py-2 [&[data-size="md"]]:px-5 [&[data-size="md"]]:font-medium [&[data-size="md"]]:text-md [&[data-size="md"]]:rounded-md
[&[data-size="xl"]]:py-3 [&[data-size="xl"]]:px-6 [&[data-size="xl"]]:font-medium [&[data-size="xl"]]:text-xl [&[data-size="xl"]]:rounded-xl
`;
const Button = ({
  themeColor = 'primary',
  themeSize = 'md',
  className,
  onClick,
  children,
  disabled,
  smoothLoading,
  type = 'button',
  ...props
}: ButtonProps) => {
  /* ======   variables   ====== */
  const elRef = useRef<HTMLButtonElement>(null);
  const [loading, setLoading] = useState(false);
  const buttonClassName = `${commonButtonClassName} ${styledButtonClassName} ${sizeButtonClassName} ${
    loading || disabled ? disabledButtonClassName : ableButtonClassName
  }${className ? ` ${className}` : ''}`;
  /* ======   function    ====== */
  const adapterClick = useCallback(
    async (e: MouseEvent<HTMLButtonElement>) => {
      if (loading || disabled) return;
      logger('버튼 클릭 시작');
      disabled = true;
      generateRipple(e);
      if (smoothLoading) {
        setLoading(true);
        try {
          await Promise.all([onClick && onClick(e), wait()]);
        } catch {}
      } else onClick && onClick(e);
      smoothLoading && setLoading(false);
      disabled = false;
      logger('버튼 클릭 끝');
    },
    [loading, disabled, smoothLoading, setLoading, onClick],
  );
  /* ======   useEffect   ====== */
  logger('render');
  useSmooth({ value: loading, delay: 500, ref: elRef });
  return (
    <button
      ref={elRef}
      role="button"
      className={buttonClassName}
      data-color={themeColor}
      data-size={themeSize}
      disabled={loading || disabled}
      onClick={adapterClick}
      {...props}
    >
      <span className={textClassName}>{children}</span>
      <span className={spinnerClassName}>
        <Spinner />
      </span>
    </button>
  );
};
export default Button;
