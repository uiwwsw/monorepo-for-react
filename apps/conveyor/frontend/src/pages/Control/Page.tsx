import { useTcmInfo } from 'src/libs/control/application/get-tcm-info';
import { createLogger } from '@package-frontend/utils';
import Table from '@/Table';
import { useServerInfo } from 'src/libs/control/application/get-server-info';
import TcmSub from './TcmSub';
import TcmSelect from './TcmSelect';
import ServerSelect from './ServerSelect';
import ServerSub from './ServerSub';
import Upload from './Upload';
import { useUploadFirmware } from '../../libs/control/application/useUploadFirmware';
import { useCallback, useState } from 'react';
import { Button, Combo, ModalWithBtn } from '@library-frontend/ui';

/* ======   interface   ====== */
/* ======    global     ====== */

const logger = createLogger('pages/Control');
const Control = () => {
  /* ======   variables   ====== */
  const { data: tcmData } = useTcmInfo();
  const { data: serverData } = useServerInfo();
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [selectedRowsMapping, setSelectedRowsMapping] = useState<number[]>([]);
  const [selectedFile, setSelectedFile] = useState('');
  const { trigger: uploadTrigger } = useUploadFirmware();

  /* ======   function    ====== */

  const handleRowSelection = useCallback(
    (selectedRows: { [key: string]: boolean }) => {
      if (!tcmData) {
        console.warn('tcmData is undefined');
        return;
      }

      const selectedTids = Object.keys(selectedRows)
        .filter((key) => selectedRows[key])
        .map((key) => tcmData[parseInt(key)]?.tid)
        .filter((tid) => tid !== undefined);

      setSelectedRowsMapping(selectedTids);
    },
    [tcmData],
  );

  const onUpload = async (file: File) => {
    const fileName = await uploadTrigger({ file });

    if (fileName) {
      setUploadedFiles([...uploadedFiles, fileName]);
    }
  };

  const handleFileSelect = (selectedFileName: string) => {
    setSelectedFile(selectedFileName);
  };

  const handleFileDelete = () => {
    setUploadedFiles(uploadedFiles.filter((file) => file !== selectedFile));
    setSelectedFile('');
  };

  /* ======   useEffect   ====== */
  logger('render');
  return (
    <>
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">TCM Control</h2>
          <Upload onSubmit={onUpload} />
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="flex-grow">
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
            </div>

            <Combo
              onChange={handleFileSelect}
              options={uploadedFiles.map((file) => ({
                value: file,
                label: file,
              }))}
            ></Combo>
          </div>
        </div>

        <Table
          thead={['tid', 'status', 'version', 'AdjTCMConnection', 'Process']}
          data={tcmData}
          makePagination={true}
          makeColumnSelect={false}
          renderSelectComponent={<TcmSelect selectedFile={selectedFile} selectedRows={selectedRowsMapping} />}
          rowSelectionChange={handleRowSelection}
          renderSubComponent={<TcmSub />}
        ></Table>
      </div>
      <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Server Control</h2>
        <Table
          thead={['sid', 'name', 'status', 'version', 'StartedTime']}
          data={serverData}
          makePagination={false}
          makeColumnSelect={false}
          renderSelectComponent={<ServerSelect />}
          renderSubComponent={<ServerSub />}
        ></Table>
      </div>
    </>
  );
};

export default Control;
