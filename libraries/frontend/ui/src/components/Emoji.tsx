import { HTMLAttributes } from 'react';

/* ======   interface   ====== */
export interface EmojiProps extends HTMLAttributes<HTMLElement> {
  children?: string;
}
/* ======    global     ====== */

const Emoji = ({ children, style, ...props }: EmojiProps) => {
  /* ======   variables   ====== */
  /* ======   function    ====== */
  /* ======   useEffect   ====== */
  return (
    <i {...props} style={{ ...style, fontFamily: 'noto-emoji', fontStyle: 'normal' }}>
      {children}
    </i>
  );
};

export default Emoji;
