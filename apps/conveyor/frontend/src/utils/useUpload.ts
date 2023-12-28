// import io from 'socket.io-client';
import { createLogger } from '@package-frontend/utils';
import { useState } from 'react';

/* ======   interface   ====== */
// export type UseUploadProps = string;
// export type UPLOAD_STATUS = 'ERROR' | 'TIMEOUT' | 'LOAD' | 'LOADEND';
/* ======    global     ====== */
const logger = createLogger('utils/useUpload');

const useUpload = () => {
  /* ======   variables   ====== */
  const [process, setProcess] = useState<number>(0);
  // const [status, setStatus] = useState<UPLOAD_STATUS>();
  /* ======   function    ====== */
  const onUpload = async (url: string, file: File) => {
    logger(file, url);
    setProcess(0);
    let resolve: (value: boolean) => void;
    const promise = new Promise<boolean>((res) => (resolve = res));
    const formData = new FormData();
    formData.append('file', file);
    logger(1);
    const xhr = new XMLHttpRequest();

    xhr.open('PUT', url);
    logger(2);

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) {
        const percentComplete = (e.loaded / e.total) * 100;
        logger(percentComplete);
        setProcess(percentComplete);
        if (percentComplete >= 100) resolve(true);
      }
    });
    logger(3);

    xhr.upload.addEventListener('timeout', () => {
      logger('timeout');
      resolve(false);
    });
    xhr.upload.addEventListener('error', (e) => {
      logger('error', e);
      resolve(false);
      setProcess(0);
    });

    xhr.upload.addEventListener('error', () => logger('ERROR'));
    xhr.upload.addEventListener('timeout', () => logger('TIMEOUT'));
    xhr.upload.addEventListener('load', () => logger('LOAD'));
    xhr.upload.addEventListener('loadend', () => logger('LOADEND'));

    logger(4);
    xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
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
