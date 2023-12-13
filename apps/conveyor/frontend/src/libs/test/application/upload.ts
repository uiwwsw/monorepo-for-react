import { createLogger, wait } from '@package-frontend/utils';
import useSWR from 'swr/mutation';
import useUpload from '#/useUpload';
const logger = createLogger('test/useUploadTest');
async function fetcher(_: string, { arg }: { arg: { file: File } }, process: number, trigger: (file: File) => void) {
  trigger(arg.file);
  setTimeout(() => {
    throw new Error('타임 아웃 에러');
  }, 30000);
  try {
    while (true) {
      await wait(500);
      logger(process);
      if (process >= 100) break;
    }
    return true;
  } catch {
    return false;
  }
}
export function useUploadTest() {
  const url = '/api/users/heartbeat';
  const { process, onUpload } = useUpload(url);
  const swr = useSWR(url, (url, { arg }) => fetcher(url, { arg }, process, onUpload));
  return {
    ...swr,
    process,
  };
}
