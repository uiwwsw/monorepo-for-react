// import { createLogger } from '@package-frontend/utils';

// import renderObject from '#/renderObject';
// import { useSocketDataContext } from '@/SocketDataContext';
import { createLogger } from '@package-frontend/utils';
import ControlItem from './Item';
import { Button } from '@library-frontend/ui';

/* ======   interface   ====== */
/* ======    global     ====== */
// const logger = createLogger('pages/Control');
const Control = () => {
  /* ======   variables   ====== */
  // const { data, tcmInfo, moduleState } = useSocketDataContext();

  /* ======   function    ====== */
  /* ======   useEffect   ====== */

  // logger(data, tcmInfo, moduleState);
  return (
    <>
      <ControlItem title="Communication">
        <Button themeColor="quaternary">enable</Button>
        <Button themeColor="quaternary">disabled</Button>
      </ControlItem>
      <ControlItem title="control">
        <Button themeColor="quaternary">offline</Button>
        <Button themeColor="quaternary">local</Button>
        <Button themeColor="quaternary">remote</Button>
      </ControlItem>
      <ControlItem title="DCM">
        <Button themeColor="quaternary">stop</Button>
        <Button themeColor="quaternary">start</Button>
        <Button themeColor="quaternary">restart</Button>
        <Button themeColor="quaternary">reload</Button>
        <Button themeColor="quaternary">log</Button>
      </ControlItem>
      <ControlItem title="HIM">
        <Button themeColor="quaternary">stop</Button>
        <Button themeColor="quaternary">start</Button>
        <Button themeColor="quaternary">restart</Button>
        <Button themeColor="quaternary">reload</Button>
        <Button themeColor="quaternary">log</Button>
      </ControlItem>
      {/* <div>{renderObject(data, 'initialmodulestate', 'ID')}</div>
      <div>{renderObject(data, 'initialmodulestate', 'StateType')}</div>
      <div>{renderObject(data, 'initialmodulestate', 'StateType3')}</div> */}
    </>
  );
};

export default Control;
