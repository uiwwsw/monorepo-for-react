// import { http } from '#/http';
// import { createLogger } from '@package-frontend/utils';
// import useSWR from 'swr/mutation';

// const logger = createLogger('control/useUploadFirm');
// export interface Arg {
//   fileName: string;
//   address: string;
//   port: number;
// }
// async function fetcher(
//   url: string,
//   {
//     arg,
//   }: {
//     arg: Arg & { file: File };
//   },
// ) {
//   logger(arg, url);
//   const res = await http<Arg>({
//     url,
//     file: arg.file,
//     method: 'PUT',
//     params: {
//       fileName: arg.fileName,
//       address: arg.address,
//       port: arg.port,
//     },
//   });
//   logger(res, arg.file.name, 1234);
//   if (res) return arg.file.name;
//   logger(res, 1234);

//   return '';
// }

// // export function useUploadFirm() {
// //   const url = '/api/api/tcm/file/upload';
// //   const { process, onUpload } = useUpload(url);
// //   const swr = useSWR(url, (url, { arg }: { arg: Arg }) => fetcher(url, { arg }, onUpload));
// //   return {
// //     ...swr,
// //     process,
// //   };
// // }
// export function useUploadFirm() {
//   return useSWR('/api/api/tcm/file/upload', fetcher);
// }
