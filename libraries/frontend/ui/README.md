# 사용 가이드

인스톨 후 `import '@library-frontend/ui/dist/style.css';` 형태로 패키지의 스타일을 적용 후 `import {Button} from '@library-frontend';` 형태로 사용합니다.

# 개발자 가이드

1. tsx 파일 생성하기
   `pnpm create-tsx components Test`

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

1. build 후 dist 폴더 생성해야 다른 프로젝트에서 접근 가능합니다.
