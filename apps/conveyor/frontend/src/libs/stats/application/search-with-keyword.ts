// import { SearchArg, searchWithKeywordProps, KeywordFunction } from '../domain';
// import { useGetAlarmInfo } from '!/stats/application/get-alarmInfo';
// import { useGetCarrierInfo } from '!/stats/application/get-carrierInfo';
// import { useGetZoneInfo } from '!/stats/application/get-zoneInfo';

// export async function searchWithKeyword({
//   keyword,
//   currentRenderList,
//   setRenderList,
//   startTime,
//   endTime,
//   functionValue,
// }: searchWithKeywordProps) {
//   if (keyword === '') return;
//   const { trigger: zoneTrigger, error: zoneError, isMutating: zoneisMutating } = useGetZoneInfo();
//   const { trigger: alarmTrigger, error: alarmError, isMutating: alarmisMutating } = useGetAlarmInfo();
//   const { trigger: carrierTrigger, error: carrierError, isMutating: carrierisMutating } = useGetCarrierInfo();

//   const regex1 = new RegExp(keyword);
//   const find = [...currentRenderList.values()].filter((carrier) => {
//     let str = JSON.stringify(carrier);
//     if (regex1.exec(str) !== null) return true;
//     else return false;
//   });

//   const arg: SearchArg = {
//     startTime: startTime,
//     endTime: endTime,
//     character: keyword,
//   };

//   switch (functionValue) {
//     case KeywordFunction.ZONE:
//       let searchedCarrierList = await zoneTrigger(arg);
//       // if (searchedCarrierList && searchedCarrierList.length > 0) {
//       //     setRenderList(searchedCarrierList.concat(find));
//       //     return;
//       //   }
//       break;
//     case KeywordFunction.ALARM:
//       searchedCarrierList = await alarmTrigger(arg);
//       if (searchedCarrierList && searchedCarrierList.length > 0) {
//         setRenderList(searchedCarrierList.concat(find));
//         return;
//       }
//       break;
//     case KeywordFunction.CARRIER:
//       searchedCarrierList = await carrierTrigger(arg);
//       if (searchedCarrierList && searchedCarrierList.length > 0) {
//         setRenderList(searchedCarrierList.concat(find));
//         return;
//       }
//       break;
//   }

//   if (find.length > 0) {
//     setRenderList(find);
//   }
// }
