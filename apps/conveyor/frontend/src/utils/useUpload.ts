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
    // const formData = new FormData();
    // formData.append('file', file);
    // formData.append('fileName', 'tcm_231228_01');
    // formData.append('address', '192.168.5.3');
    // formData.append('port', '');

    logger(1, file);
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.open('PUT', url);
    xhr.timeout = 30000;
    logger(2, url);

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
    xhr.upload.addEventListener('error', () => {
      logger('error');
      resolve(false);
      setProcess(0);
    });

    // xhr.upload.addEventListener('error', () => logger('ERROR'));
    // xhr.upload.addEventListener('timeout', () => logger('TIMEOUT'));
    // xhr.upload.addEventListener('load', () => logger('LOAD'));
    // xhr.upload.addEventListener('loadend', () => logger('LOADEND'));

    logger(4, xhr);
    xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
    // xhr.setRequestHeader(
    //   'X-Access-Token',
    //   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEwMDAwMiwidXNlcl9pZCI6Im1hdHRoZXcxIiwiZ3JhZGUiOjEsImNsaWVudF90eXBlIjoxLCJrZXkiOiJlNmFhZjQ1N2YyMmE1ZWQ0NDE5ZDI3MmUxODMwYjM4ZCIsImlhdCI6MTcwMzc0NTQzNCwiZXhwIjoxNzAzODMxODM0fQ.F35-wuLKKYvFj9Ne26R82i5QgqiDp9W4NYfYsC_Q9vA',
    // );
    xhr.send([file] as unknown as XMLHttpRequestBodyInit);

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
