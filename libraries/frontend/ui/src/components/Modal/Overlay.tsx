/* ======   interface   ====== */
export interface ModalOverlayProps {
  onClose: () => void;
}
/* ======    global     ====== */
const ModalOverlay = ({ onClose }: ModalOverlayProps) => {
  /* ======   variables   ====== */
  const overlayClassName =
    'bg-white bg-opacity-40 absolute left-0 top-0 w-full h-full transition-opacity opacity-0 [[data-smooth="SHOW"]>&]:opacity-100 [[data-smooth="SHOWING"]>&]:opacity-100';
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  return <i aria-label="modal back overlay" onClick={() => onClose && onClose()} className={overlayClassName} />;
};

export default ModalOverlay;
