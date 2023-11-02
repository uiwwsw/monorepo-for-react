import { createLogger } from '@package-frontend/utils';
import Menu from '@/Menu';
import Tooltip from '@/Tooltip';
import Button from '@/Button';
import Image from '@/Image';
import Skeleton from '@/Skeleton';
import ModalWithBtn from '@/Modal/WithBtn';
import Input from '@/Input';
import '@package-frontend/pretendard';
import '@package-frontend/noto-emoji';
import RadioGroup from '@/Radio/Group';
import Checkbox from '@/Checkbox';
import Chip from '@/Chip';
import PaginationWithMenu from '@/Pagination/WithMenu';
/* ======   interface   ====== */
/* ======    global     ====== */
const logger = createLogger('pages/Main');
const App = () => {
  /* ======   variables   ====== */
  /* ======   function    ====== */
  const handleClick = async () => {
    await new Promise((res) => setTimeout(() => res(true), 100000));
    console.log('dawd');
  };
  /* ======   useEffect   ====== */
  logger('test');
  return (
    <div className="p-10">
      <PaginationWithMenu
        totalPageNum={29}
        hasDoubleArrow
        onChange={(e) => {
          console.log(e);
        }}
      />
      <Input type="search" />
      <br />
      <br />
      <Checkbox>우하</Checkbox>
      <br />
      <br />
      <Button onClick={handleClick} smoothLoading={true}>
        ㅇㅇㅇㅇ
      </Button>
      <Chip labels={[1, 2, 3]}></Chip>
      <RadioGroup labels={['1', 3]} defaultChecked={1} />
      <Skeleton col="2.5rem 2.5rem">
        <div className="w-10 h-10"></div>
        <div className="w-10 h-10"></div>
        <div className="w-10 h-10"></div>
      </Skeleton>
      <Image width={300} height={300} src="https://source.unsplash.com/random/300×300​" />
      <Menu>
        <Button onClick={() => alert('블라브랄')}>ㅇㅇㅇㅇ</Button>
      </Menu>
      <Tooltip>블라블라 안녕하세요</Tooltip>
      <ModalWithBtn>dddd</ModalWithBtn>
      <Button onClick={() => alert('블라브랄')}>ㅇㅇㅇㅇ</Button>
    </div>
  );
};
export default App;
