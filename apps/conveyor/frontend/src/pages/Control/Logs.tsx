import Empty from '@/Empty';
import { Button, Tutorial, tutorialStorage } from '@library-frontend/ui';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
/* ======   interface   ====== */
export interface LogsProps {
  list?: string[];
  onView: (fileName: string) => void;
  onDownload: (fileName: string) => void;
}
/* ======    global     ====== */
const Logs = ({ list, onView, onDownload }: LogsProps) => {
  /* ======   variables   ====== */
  const { t } = useTranslation();
  const logRef = useRef<HTMLDivElement>(null);
  const tutorialToastMsg = t(
    '로그를 띄우거나 다운받을 수 있습니다. \n보기를 누르면 로그 당 창이 뜹니다. \n하나의 창으로 여러 로그를 보고 싶으면 설정을 변경해주세요.',
  );
  const toastTutorial = tutorialStorage.get(`tutorial-"${tutorialToastMsg.replace(/\n/g, '\\n')}"`);

  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  return (
    <>
      <Tutorial
        delay={1000}
        guide={[
          {
            ref: logRef,
            text: tutorialToastMsg,
          },
        ]}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {!toastTutorial && (
          <div
            ref={logRef}
            className="bg-green-200 text-black p-3 rounded-lg flex flex-col md:flex-row justify-between space-y-2 md:space-y-0 md:items-center"
          >
            <div className="truncate">
              <div className="font-medium">로그 이름</div>
            </div>
            <div className="flex space-x-2">
              <Button smoothLoading themeSize="sm" themeColor="secondary">
                {t('보기')}
              </Button>
              <Button smoothLoading themeSize="sm" themeColor="secondary">
                {t('다운로드')}
              </Button>
            </div>
          </div>
        )}
        {list?.length ? (
          list.map((fileName, index) => (
            <div
              key={index}
              className="bg-green-200 text-black p-3 rounded-lg flex flex-col md:flex-row justify-between space-y-2 md:space-y-0 md:items-center"
            >
              <div className="truncate">
                <div className="font-medium">{fileName}</div>
              </div>
              <div className="flex space-x-2">
                <Button smoothLoading onClick={() => onView(fileName)} themeSize="sm" themeColor="secondary">
                  {t('보기')}
                </Button>
                <Button smoothLoading onClick={() => onDownload(fileName)} themeSize="sm" themeColor="secondary">
                  {t('다운로드')}
                </Button>
              </div>
            </div>
          ))
        ) : (
          <Empty />
        )}
      </div>
    </>
  );
};

export default Logs;
