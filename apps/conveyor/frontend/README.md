# 배포 가이드

1. `pnpm do @app-conveyor/frontend deploy ./배포폴더명`
1. ./배포폴더명 으로 이동 후 `pnpm build`
1. `./dist폴더와 index.js 파일말고 다 지움`
1. `pnpm init && pnpm add express path`
1. `node index.js` 실행
1. 최종 배포때 필요한 파일 `./dist` , `index.js`, `express path 만 들어있는 ./node_modules`

# 개발자 가이드

1. tsx 파일 생성하기
   `pnpm create-tsx components Test2`

```tsx
import { HTMLAttributes } from 'react';
import { createLogger } from '@package-frontend/utils';
/* ======   interface   ====== */
export interface componentNameProps extends HTMLAttributes<HTMLElement> {}
/* ======    global     ====== */
const logger = createLogger('ComponentDirectory/ComponentName');
const ComponentName = (props: ComponentNameProps) => {
  /* ======   variables   ====== */
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  logger('render');
  return <div {...props}>ComponentName Component</div>;
};

export default ComponentName;
```
