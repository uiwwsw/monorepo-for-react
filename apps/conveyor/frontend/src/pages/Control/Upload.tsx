import { Button, Input } from '@library-frontend/ui';
import { useState } from 'react';
import { createLogger } from '@package-frontend/utils';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import WarningMessage from '@/Typography/WarningMessage';
const logger = createLogger('pages/Control/Upload');

/* ======   interface   ====== */
interface UploadProps {
  onSubmit: (file: File) => Promise<unknown>;
  onCancel?: () => unknown;
}
interface FormState {
  fileList: FileList;
}
/* ======    global     ====== */

const Upload = ({ onSubmit, onCancel }: UploadProps) => {
  /* ======   variables   ====== */
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormState>();
  const [loading, setLoading] = useState(false);

  /* ======   function    ====== */
  const adapterSubmit = async ({ fileList }: FormState) => {
    const file = fileList[0];
    if (file) {
      setLoading(true);
      try {
        await onSubmit(file);
        logger('upload file success');
        reset();
      } catch (e) {
        logger('failed to upload file');
      }
      setLoading(false);
    }
  };
  /* ======   useEffect   ====== */
  return (
    <div>
      <div className="flex items-center gap-2">
        <form className="flex items-center gap-2">
          <Input
            {...register('fileList', {
              required: t('파일이 없어요'),
            })}
            type="file"
          />
          <Button themeSize={'sm'} disabled={loading} onClick={handleSubmit(adapterSubmit)}>
            {loading ? 'Updating...' : 'Update'}
          </Button>
        </form>
        <Button themeSize={'sm'} onClick={onCancel} disabled={!loading}>
          Stop
        </Button>
      </div>
      <WarningMessage>{errors?.fileList?.message}</WarningMessage>
    </div>
  );
};

export default Upload;
