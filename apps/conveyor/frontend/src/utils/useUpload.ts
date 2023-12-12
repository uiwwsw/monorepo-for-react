// import io from 'socket.io-client';
import { createLogger } from '@package-frontend/utils';
import { useState } from 'react';

/* ======   interface   ====== */
export type UseUploadProps = string;
/* ======    global     ====== */
const logger = createLogger('utils/useUpload');

const useUpload = (url: UseUploadProps) => {
  /* ======   variables   ====== */
  const [process, setProcess] = useState<number>(0);
  /* ======   function    ====== */
  const onUpload = (file: File) => {
    logger(file, url);
    const formData = new FormData();
    formData.append('file', file);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', url);

    // 진행 상태 이벤트
    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) {
        const percentComplete = (e.loaded / e.total) * 100;
        logger(percentComplete);
        setProcess(percentComplete);
      }
    });

    xhr.send(formData);
  };
  /* ======   useEffect   ====== */
  return {
    onUpload,
    process,
  };
};

export default useUpload;
