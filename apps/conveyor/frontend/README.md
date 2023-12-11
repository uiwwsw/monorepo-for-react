# 배포 가이드

1. `node deploy.cjs`
1. root에 생성된 /deploy 폴더에 index.js 를 실행하면 됩니다. `node index`
1. deploy/dist에 config.json을 변경할 수 있습니다.

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
