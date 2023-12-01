import { STORAGE } from '!/storage/domain';
import { Storage } from '@package-frontend/utils';
export const storage = new Storage<STORAGE>(localStorage);
