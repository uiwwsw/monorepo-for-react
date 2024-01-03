import PageCenter from '@/PageCenter';
import { useTranslation } from 'react-i18next';
import { createLogger } from '@package-frontend/utils';
import { useGetEquipmentValue } from '!/redis/application/get-equipment-value';
import { Button, Input, useToasts } from '@library-frontend/ui';
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
  const { register, handleSubmit: formSubmit, reset } = useForm<FormState>();
  const { data, mutate } = useGetEquipmentValue();
  const { trigger, isMutating, error } = useSetEquipmentValue();

  /* ======   function    ====== */
  const handleSubmit = async (arg: FormState) => {
    Object.entries(arg)
      .filter(([_, value]) => value)
      .map(async ([key, value]) => {
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
        {data && (
          <>
            <WarningMessage show={!isMutating}>{t(error?.message)}</WarningMessage>
            <form className="flex flex-col gap-3">
              {Object.entries(data).map(([key, value]) => (
                <label key={key}>
                  <p className="font-medium">{key}</p>
                  <Input {...register(key as EquipmentName, {})} placeholder={value} className="w-full" />
                </label>
              ))}

              <Button smoothLoading onClick={formSubmit(handleSubmit)}>
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
