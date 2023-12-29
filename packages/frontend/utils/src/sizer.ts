export const getScrollbarWidth = () => {
  const body = document.body;
  if (body.style.overflow === 'hidden' || body.scrollHeight <= window.innerHeight) return 0;
  const outer = document.createElement('div');
  outer.style.visibility = 'hidden';
  outer.style.overflow = 'scroll';
  body.appendChild(outer);
  //body.style.paddingRight
  const inner = document.createElement('div');
  outer.appendChild(inner);

  const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;

  outer.parentNode?.removeChild(outer);
  return scrollbarWidth;
};
export const getScrollbarHeight = () => {
  const body = document.body;
  if (body.style.overflow === 'hidden' || body.scrollWidth <= window.innerWidth) return 0;
  const outer = document.createElement('div');
  outer.style.visibility = 'hidden';
  outer.style.overflow = 'scroll';
  body.appendChild(outer);
  //body.style.paddingRight
  const inner = document.createElement('div');
  outer.appendChild(inner);

  const scrollbarHeight = outer.offsetHeight - inner.offsetHeight;

  outer.parentNode?.removeChild(outer);
  return scrollbarHeight;
};
