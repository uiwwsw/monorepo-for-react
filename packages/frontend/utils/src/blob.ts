export const onDownload = (blob: Blob, fileName: string = 'unknown-file') => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName; // 저장할 파일 이름
  document.body.appendChild(a);
  a.click(); // 프로그래밍 방식으로 클릭 이벤트 발생
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url); // URL 해제
};
export const onView = (blob: Blob) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.target = '_blank';
  document.body.appendChild(a);
  a.click(); // 프로그래밍 방식으로 클릭 이벤트 발생
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url); // URL 해제
};
