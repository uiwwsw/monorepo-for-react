export const onDownload = (blob: Blob, fileName: string = 'unknown-file') => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName; // 저장할 파일 이름
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url); // URL 해제
};
export const onView = (
  blob: Blob,
  popupName: string = '',
  warningMsg = '팝업이 차단되어 열 수 없습니다. 브라우저 설정을 확인해 주세요.',
) => {
  const url = window.URL.createObjectURL(blob);

  if (popupName) {
    const newWindow = window.open(
      url,
      popupName,
      'top=10, left=10, width=500, height=600, status=no, menubar=no, toolbar=no, resizable=no',
    );
    window.URL.revokeObjectURL(url);
    if (newWindow) return;

    alert(warningMsg);
  }

  const a = document.createElement('a');
  a.href = url;
  a.target = '_blank';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url); // URL 해제
};
