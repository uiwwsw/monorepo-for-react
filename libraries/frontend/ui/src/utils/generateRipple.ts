export const generateRipple = (e: React.MouseEvent) => {
  const target = e.currentTarget;
  const ripple = document.createElement('i');
  const rect = target.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  console.log(size);
  ripple.style.width = ripple.style.height = `${size}px`;
  ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
  ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
  ripple.className = 'ripple';

  target.appendChild(ripple);

  ripple.addEventListener('animationend', () => {
    ripple.remove();
  });
};
