# 초기세팅

pnpm 설치

`pnpm i`

`pnpm prepare`

prepare 경우 commit 메세지를 린트하는 기능입니다. 설치 후 `commitlint.config.js` 참조하여 알맞는 커밋 메세지를 작성해주세요.

# 브렌치 네이밍 관련

1. feature/package명/피쳐이름

`feature/conveyor/backend/#1`

# 기본 사용법

pnpm do {패키지명} {스크립트}

`pnpm do @app-conveyor/frontend dev`

```javascript
// package.json
{
  "name": "@app-conveyor/frontend",
   //... 생략
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview",
    "create-tsx": "node cmd/create-tsx/create.cjs",
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build"
  },
  //... 생략
}
// 패키지명은 해당 package.json의 name입니다.
// 스크립트는 scripts중 하나입니다.

// 패키지명 지을땐
// root폴더 단수형 / 패키지명
// root폴더 단수형 - 폴더명 / 패키지명
```

# monorepo

1. apps

- 서비스
- 서비스를 사용하기 위해서는 library패키지 설치 및 빌드가 필요합니다.

2. libraries

- 라이브러리(빌드 필요)

1. packages

- 빌드 없이 바로 가져다 쓸 수 있는 패키지들은 이곳에 저장합니다.
