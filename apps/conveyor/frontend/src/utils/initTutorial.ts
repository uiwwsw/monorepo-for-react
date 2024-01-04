// import io from 'socket.io-client';
import { useMemo, useState } from 'react';
import { ContextProps } from '@/TutorialContext';
import { storage } from './storage';
import { STORAGE } from '!/storage/domain';
/* ======   interface   ====== */

/* ======    global     ====== */
const initTutorial = (): ContextProps => {
  /* ======   variables   ====== */
  const [ids, setIds] = useState<string[]>(storage.get<string[]>(STORAGE['tutorial']) ?? []);
  const [guides, setGuides] = useState<ContextProps['guides']>([]);
  const uniqueGuides = useMemo(
    () => guides.filter((x, i, arr) => !ids.includes(x.text) && arr.findIndex((y) => y.text === x.text) === i),
    [guides, ids],
  );
  /* ======   function    ====== */
  const addGuides = async (param: ContextProps['guides']) => {
    await setGuides((prev) => [...prev, ...param]);
  };
  const onFinish = async (text?: string) => {
    if (!text) return;
    const param = [...ids, text].filter((x, i, arr) => arr.findIndex((y) => y === x) === i);
    await setIds(param);
    storage.set(STORAGE['tutorial'], param);
  };
  /* ======   useEffect   ====== */
  return {
    guides: uniqueGuides,
    addGuides,
    setGuides,
    onFinish,
  };
};

export default initTutorial;
