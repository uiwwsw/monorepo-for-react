import { Button, Combo, ModalWithBtn } from '@library-frontend/ui';
import { createLogger } from '@package-frontend/utils';
import { Row } from '@tanstack/react-table';
import { useState } from 'react';
import { TCMInfo } from 'src/libs/control/domain';
/* ======   interface   ====== */
export interface TcmSubProps {
  row?: Row<TCMInfo>;
}
/* ======    global     ====== */
const logger = createLogger('pages/Control/TcmSub');
const TcmSub = ({ row }: TcmSubProps) => {
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

  logger('render');
  /* ======   useEffect   ====== */
  return (
    <div className="flex justify-end space-x-2">
      <div className="flex items-center space-x-4">
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
          </div>
        )}

        <Combo
          onChange={handleFileSelect}
          options={backupFiles.map((file) => ({
            value: file,
            label: file,
          }))}
        ></Combo>
      </div>
      <div>{row?.original.tid}</div>
      <Button>Update</Button>
      <Button>Process Kill</Button>
      <Button>Detail</Button>
      <Button>Logs</Button>
    </div>
  );
};

export default TcmSub;
