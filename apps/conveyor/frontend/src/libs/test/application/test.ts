import { http } from '@package-frontend/utils';
import { createLogger } from '@package-frontend/utils';
import useSWR from 'swr';
const logger = createLogger('test/useTest');

async function fetcher(url: string) {
  await new Promise((res) => setTimeout(res, 5000));
  const random = Math.round(Math.random()) > 0;
  logger(url, random);
  if (!random) throw new Error('렌덤으로 에러를 만들어봄');
  return true;
  // 필요에 따라 데이터를 변경하여 내보냅니다.
  // 서버리스펀스가 Another이었다면 Something타입으로 변경하여 프론트에서 사용하는 타입으로 변경하는건 어플리케이션 레벨에서 진행합니다.
  // data.map(x => ({} as Something) ) // 이건 Something[]으로 추론될겁니다.
}

export function useTest() {
  return useSWR('/test', fetcher);
}
