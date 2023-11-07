import { useTest } from '!/test/application/test';
import { Accordion, Tooltip } from '@library-frontend/ui';
import { createLogger } from '@package-frontend/utils';

/* ======   interface   ====== */
/* ======    global     ====== */
const logger = createLogger('pages/Help');
const Help = () => {
  /* ======   variables   ====== */
  const { data } = useTest();
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  logger('render', data);
  return (
    <div className="flex flex-col gap-24 py-3">
      <div className="flex flex-col sticky top-0 bg-black text-white p-4 z-10">
        <a href="#qna">자주하는 질문</a>
        <a href="#layout">레이아웃</a>
        <a href="#stats">통계 페이지</a>
      </div>
      <div>
        <h2 id="qna" className="font-bold text-xl bg-white">
          자주하는 질문
        </h2>
        <Accordion title="빨간 물음표는 뭔가요?">
          해당 영역의 정보를 나타내는 ui로 마우스를 올리면 그 부분의 정보를 노출합니다.
          <Tooltip>툴팁은 이런거에요</Tooltip>
        </Accordion>
        <Accordion title="아이디가 없습니다">/sign-up 페이지에 가서 회원가입을 진행해 주세요.</Accordion>
      </div>
      <div className="relative">
        <h2 id="layout" className="font-bold text-xl bg-white">
          레이아웃 설명
        </h2>
        <iframe src="/" className="w-full h-[600px] border-2 my-8"></iframe>
        <span className="absolute bg-opacity-25 text-5xl after:absolute after:text-white after:w-fit after:h-fit after:m-auto after:inset-0 bg-gray-700 left-44 -right-8 top-36 bottom-0 after:content-['컨텐츠']" />
        <span className="absolute bg-opacity-25 text-5xl after:absolute after:text-white after:w-fit after:h-fit after:m-auto after:inset-0 bg-red-700 -left-8 w-60 top-8 bottom-0 after:content-['사이드바']" />
        <span className="absolute bg-opacity-25 text-5xl after:absolute after:text-white after:w-fit after:h-fit after:m-auto after:inset-0 bg-green-700 left-44 -right-8 top-8 h-36 after:content-['헤더']" />
        <span className="absolute bg-opacity-25 text-5xl after:absolute after:text-white after:w-fit after:h-fit after:m-auto after:inset-0 bg-blue-700 -right-8 bottom-0 w-36 h-36 after:content-['토스트']" />
      </div>
      <div className="relative">
        <h2 id="stats" className="font-bold text-xl bg-white">
          통계 페이지 설명
        </h2>
        <iframe src="/stats?side-nav=disabled" className="w-full h-[600px] border-2 my-8"></iframe>
        <span className="absolute bg-opacity-25 text-5xl after:absolute after:text-white after:w-fit after:h-fit after:m-auto after:inset-0 bg-gray-700 left-44 -right-8 top-36 bottom-0 after:content-['그래프']" />
      </div>
    </div>
  );
};

export default Help;
