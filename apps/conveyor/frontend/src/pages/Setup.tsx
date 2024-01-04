import PageCenter from '@/PageCenter';
import { useTranslation } from 'react-i18next';
import { createLogger } from '@package-frontend/utils';
import { useGetEquipmentValue } from '!/redis/application/get-equipment-value';
import { Button, Input, Tooltip, useToasts } from '@library-frontend/ui';
import { useForm } from 'react-hook-form';
import { EquipmentName, EquipmentValue } from '!/redis/domain';
import { useSetEquipmentValue } from '!/redis/application/set-equipment-value';
import WarningMessage from '@/Typography/WarningMessage';
// import useSocket from '#/useSocket';
// import { SocketSubscript } from '!/socket/domain';
// import { CTRL_SOCKET_NAME } from '!/control/domain';
/* ======   interface   ====== */
type FormState = Partial<Record<EquipmentName, string>>;
/* ======    global     ====== */
const logger = createLogger('pages/Setup');

const Setup = () => {
  /* ======   variables   ====== */
  const { t } = useTranslation();
  const { Toasts, showToast } = useToasts();
  const {
    register,
    handleSubmit: formSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<FormState>();
  const { data, mutate } = useGetEquipmentValue();
  const { trigger, isMutating, error } = useSetEquipmentValue();
  // const state = watch();
  /* ======   function    ====== */
  const handleSubmit = async (arg: FormState) => {
    const entries = Object.entries(arg).filter(([_, value]) => value);
    if (!entries.length) return setError('root', { message: '변경할 필드값 하나 이상을 입력해야 합니다.' });

    entries.map(async ([key, value]) => {
      logger(key, value);
      await trigger({ target: EquipmentName[key as keyof EquipmentValue], value });
      await mutate();

      showToast({
        message: t('{{key}}={{value}}값으로 변경에 성공했어요.', { key, value }),
      });
    });
    reset();
    logger('handleSubmit', arg);
  };
  /* ======   useEffect   ====== */

  return (
    <>
      {Toasts}
      <PageCenter icon="💾" title={t('셋업')}>
        <span>
          <Tooltip>placeholder는 현재 장비의 설정된 값입니다.</Tooltip>
        </span>
        {data && (
          <>
            <WarningMessage show={!isMutating}>{t(error?.message ?? errors?.root?.message)}</WarningMessage>
            <form className="flex flex-col gap-3">
              {Object.entries(data).map(([key, value]) => (
                <label key={key}>
                  <p className="font-medium">{t(key)}</p>
                  <Input {...register(key as EquipmentName, {})} placeholder={value} className="w-full" />
                </label>
              ))}

              <Button
                // disabled={!Object.values(state).filter((x) => x).length}
                smoothLoading
                onClick={formSubmit(handleSubmit)}
              >
                {t('설정')}
              </Button>
            </form>
          </>
        )}
      </PageCenter>
    </>
  );
};

export default Setup;
