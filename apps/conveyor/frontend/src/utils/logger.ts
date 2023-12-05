import { createLogger as baseCreateLogger } from '@package-frontend/utils';
export const createLogger = (name: string) => baseCreateLogger(name, 'service');
