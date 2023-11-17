/* ======   interface   ====== */
export interface ModalOverlayProps {
  onClose: () => void;
}
/* ======    global     ====== */
const ModalOverlay = ({ onClose }: ModalOverlayProps) => {
  /* ======   variables   ====== */
  /* ======   function    ====== */
  const handleClick = () => {
    onClose && onClose();
  };

  /* ======   useEffect   ====== */
  return (
    <i
      aria-label="modal back overlay"
      onClick={handleClick}
      className="bg-white bg-opacity-40 absolute left-0 top-0 w-full h-full transition-opacity opacity-0 [[data-smooth='SHOW']>&]:opacity-100 [[data-smooth='SHOWING']>&]:opacity-100"
    />
  );
};

export default ModalOverlay;
