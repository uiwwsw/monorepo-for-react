# 배포 가이드

1. `pnpm do @library* build`
1. `pnpm do @app-conveyor/frontend build`
1. `./dist폴더와 index.js 파일말고 다 지움`
1. `npm init -y && npm add express path`
1. `node index.js` 실행

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
  return <div {...props}>ComponentName Component</div>;
};

export default ComponentName;
```
