/* ======   interface   ====== */

import { Button, Combo, ModalWithBtn } from '@library-frontend/ui';
import { createLogger } from '@package-frontend/utils';
import { useState } from 'react';

interface ModalContentFirmwareProps {
  tid?: number;
}

/* ======    global     ====== */
const logger = createLogger('pages/ModalContentFirmware');

const ModalContentFirmware = ({ tid }: ModalContentFirmwareProps) => {
  /* ======   variables   ====== */
  const [selectedFile, setSelectedFile] = useState('');
  const [backupFiles, setBackupFiles] = useState<string[]>(['file1.txt', 'file2.txt', 'file3.txt']);

  /* ======   function    ====== */
  const handleFileSelect = (selectedFileName: string) => {
    setSelectedFile(selectedFileName);
  };

  const handleFileDelete = () => {
    setBackupFiles(backupFiles.filter((file) => file !== selectedFile));
    setSelectedFile('');
  };

  /* ======   useEffect   ====== */
  logger('render');
  return (
    <div className="flex items-center space-x-4">
      <Combo
        onChange={handleFileSelect}
        placeholder="Backup File"
        options={backupFiles.map((file) => ({
          value: file,
          label: file,
        }))}
      ></Combo>
      {selectedFile && (
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">선택된 파일: {selectedFile}</span>
          <ModalWithBtn
            hasButton={['OK', 'CANCEL']}
            button={
              <Button themeColor="secondary" themeSize="sm">
                Delete
              </Button>
            }
            onClose={(value) => {
              if (value === 'OK') {
                handleFileDelete();
              }
            }}
          >
            파일을 삭제하시겠습니까?
          </ModalWithBtn>
          <Button themeSize={'sm'}>Update</Button>
        </div>
      )}
    </div>
  );
};

export default ModalContentFirmware;
