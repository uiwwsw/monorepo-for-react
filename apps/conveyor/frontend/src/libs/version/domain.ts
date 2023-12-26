import { STORAGE } from '!/storage/domain';
import { storage } from '#/storage';
export enum CHANGE_VERSION {
  'SAME',
  'ETC',
  'MINOR',
  'MAJOR',
}
export const changeVersion = (): CHANGE_VERSION => {
  const localVersion = storage.get<string>(STORAGE.version);
  const newVersion = import.meta.env.PACKAGE_VERSION;
  if (!localVersion) return CHANGE_VERSION.MAJOR;

  const [NEW_MAJOR, NEW_MINOR, NEW_ETC] = newVersion.split('.');
  const [LOCAL_MAJOR, LOCAL_MINOR, LOCAL_ETC] = localVersion.split('.');
  if (LOCAL_MAJOR !== NEW_MAJOR) return CHANGE_VERSION.MAJOR;
  if (LOCAL_MINOR !== NEW_MINOR) return CHANGE_VERSION.MINOR;
  if (LOCAL_ETC !== NEW_ETC) return CHANGE_VERSION.ETC;
  return CHANGE_VERSION.SAME;
};
