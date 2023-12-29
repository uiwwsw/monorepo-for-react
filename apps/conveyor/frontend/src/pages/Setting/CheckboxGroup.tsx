import { CheckboxGroup, CheckboxGroupProps } from '@library-frontend/ui';

/* ======   interface   ====== */
export interface SettingCheckGroupProps<T> extends CheckboxGroupProps<T> {
  label: string;
}
/* ======    global     ====== */
const SettingCheckGroup = <T,>({ label, ...props }: SettingCheckGroupProps<T>) => {
  /* ======   variables   ====== */
  /* ======   function    ====== */

  /* ======   useEffect   ====== */
  return (
    <div className="flex items-center">
      <span className="text-lg">{label}</span>:
      <div className="ml-3">
        <CheckboxGroup {...props} />
      </div>
    </div>
  );
};

export default SettingCheckGroup;
