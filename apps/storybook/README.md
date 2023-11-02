# 개발자 가이드

1. tsx 파일 생성하기
   `pnpm create-tsx components Test2`

```tsx
import { HTMLAttributes } from "react";
import { createLogger } from "@package-frontend/utils";
/* ======   interface   ====== */
export interface componentNameProps extends HTMLAttributes<HTMLElement> {}
/* ======    global     ====== */
const logger = createLogger("ComponentDirectory/ComponentName");
const ComponentName = (props: ComponentNameProps) => {
  /* ======   variables   ====== */
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  logger("render");
  return <div {...props}>ComponentName Component</div>;
};

export default ComponentName;
```
