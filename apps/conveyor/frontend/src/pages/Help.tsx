import { useUploadFirmware } from '!/auth/application';
import { Accordion, Tooltip } from '@library-frontend/ui';
import { createLogger } from '@package-frontend/utils';

/* ======   interface   ====== */
/* ======    global     ====== */
const logger = createLogger('pages/Help');
const Help = () => {
  /* ======   variables   ====== */
  const { data } = useUploadFirmware();
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  logger('render', data);
  return (
    <div className="grid grid-cols-2 grid-rows-2 h-screen gap-3 bg-black">
      <div className="bg-white">
        <h2>레이아웃 설명</h2>
      </div>
      <div className="bg-white">
        <h2>페이지 설명</h2>
      </div>
      <div className="bg-white col-span-2">
        <h2>자주하는 질문</h2>
        <Accordion title="빨간 물음표는 뭔가요?">
          해당 영역의 정보를 나타내는 ui로 마우스를 올리면 그 부분의 정보를 노출합니다.
          <Tooltip>툴팁은 이런거에요</Tooltip>
        </Accordion>
        <Accordion title="아이디가 없습니다">/sign-up 페이지에 가서 회원가입을 진행해 주세요.</Accordion>
      </div>
    </div>
  );
};

export default Help;
