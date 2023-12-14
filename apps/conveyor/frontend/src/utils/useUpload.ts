// import io from 'socket.io-client';
import { createLogger } from '@package-frontend/utils';
import { useState } from 'react';

/* ======   interface   ====== */
export type UseUploadProps = string;
// export type UPLOAD_STATUS = 'ERROR' | 'TIMEOUT' | 'LOAD' | 'LOADEND';
/* ======    global     ====== */
const logger = createLogger('utils/useUpload');

const useUpload = (url: UseUploadProps) => {
  /* ======   variables   ====== */
  const [process, setProcess] = useState<number>(0);
  // const [status, setStatus] = useState<UPLOAD_STATUS>();
  /* ======   function    ====== */
  const onUpload = async (file: File) => {
    logger(file, url);
    setProcess(0);
    let resolve: (value: boolean) => void;
    const promise = new Promise<boolean>((res) => (resolve = res));
    const formData = new FormData();
    formData.append('file', file);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', url);

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) {
        const percentComplete = (e.loaded / e.total) * 100;
        logger(percentComplete);
        setProcess(percentComplete);
        if (percentComplete >= 100) resolve(true);
      }
    });
    xhr.upload.addEventListener('timeout', () => {
      logger('timeout');
      resolve(false);
    });
    xhr.upload.addEventListener('error', () => {
      logger('error');
      resolve(false);
      setProcess(0);
    });

    // xhr.upload.addEventListener('error', () => setStatus('ERROR'));
    // xhr.upload.addEventListener('timeout', () => setStatus('TIMEOUT'));
    // xhr.upload.addEventListener('load', () => setStatus('LOAD'));
    // xhr.upload.addEventListener('loadend', () => setStatus('LOADEND'));

    xhr.send(formData);
    return promise;
  };
  // logger(status);

  /* ======   useEffect   ====== */
  return {
    onUpload,
    process,
  };
};

export default useUpload;
