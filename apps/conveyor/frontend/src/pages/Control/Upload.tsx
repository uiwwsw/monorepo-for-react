import { Button, Input, ModalWithBtn } from '@library-frontend/ui';
import { useState } from 'react';
import { createLogger } from '@package-frontend/utils';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import WarningMessage from '@/Typography/WarningMessage';
const logger = createLogger('pages/Control/Upload');

/* ======   interface   ====== */
interface UploadProps {
  disabled?: boolean;
  onSubmit: (file: File) => Promise<unknown>;
  onCancel?: () => unknown;
}
interface FormState {
  fileList: FileList;
}
/* ======    global     ====== */

const Upload = ({ onSubmit, onCancel, disabled }: UploadProps) => {
  /* ======   variables   ====== */
  const { t } = useTranslation();
  const {
    register,
    handleSubmit: formSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<FormState>();
  const [loading, setLoading] = useState(false);

  /* ======   function    ====== */
  const submit = async ({ fileList }: FormState) => {
    const file = fileList[0];
    if (file) {
      setLoading(true);
      try {
        await onSubmit(file);
        logger('upload file success');
        reset();
      } catch (e) {
        logger('failed to upload file', e);
      }
      setLoading(false);
    }
  };
  const handleSubmit = formSubmit(submit);
  /* ======   useEffect   ====== */
  return (
    <div>
      <div className="flex items-center gap-2">
        <form className="flex items-center gap-2 flex-1">
          <Input
            {...register('fileList', {
              required: t('파일이 없어요'),
            })}
            type="file"
            className="flex-1"
            disabled={disabled}
          />
          <ModalWithBtn
            hasButton={['OK', 'CANCEL']}
            button={
              <Button
                type="button"
                themeSize={'sm'}
                disabled={!isValid || disabled || loading}
                onClick={(e) => e.preventDefault()}
              >
                {loading ? 'Updating...' : 'Update'}
              </Button>
            }
            onClose={(value) => value === 'OK' && handleSubmit()}
          >
            파일을 업데이트 하시겠습니까?
          </ModalWithBtn>
        </form>
        <Button themeSize={'sm'} onClick={onCancel} disabled={disabled || !loading}>
          Stop
        </Button>
      </div>
      <WarningMessage>{errors?.fileList?.message}</WarningMessage>
    </div>
  );
};

export default Upload;
