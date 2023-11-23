import { Button, Input } from '@library-frontend/ui';
import { FormEventHandler, useRef, useState } from 'react';
import { createLogger } from '@package-frontend/utils';
const logger = createLogger('pages/Control/Upload');

/* ======   interface   ====== */
interface UploadProps {
  onSubmit: (file: File) => Promise<unknown>;
}

/* ======    global     ====== */

const Upload = ({ onSubmit }: UploadProps) => {
  /* ======   variables   ====== */
  const [loading, setLoading] = useState(false);
  const inputFileRef = useRef<HTMLInputElement>(null);

  /* ======   function    ====== */
  const adapterSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    const inputElement = inputFileRef.current;
    if (inputElement && inputElement.files && inputElement.files.length > 0) {
      const file = inputElement.files[0];
      setLoading(true);
      try {
        await onSubmit(file);
        logger('upload file sucess');
      } catch (e) {
        logger('failed to upload file');
      }
      setLoading(false);

      inputElement.value = '';
    }
  };
  /* ======   useEffect   ====== */
  return (
    <form className="flex items-center space-x-3 mr-3" onSubmit={adapterSubmit}>
      <Input ref={inputFileRef} className="form-input" type="file" />
      <Button themeSize={'sm'} disabled={loading} type="submit">
        {loading ? 'Updating...' : 'Update'}
      </Button>
    </form>
  );
};

export default Upload;
