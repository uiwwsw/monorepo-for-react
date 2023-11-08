import { faker } from '@faker-js/faker';
export const mockData = {
  session: faker.string.uuid(),
  name: faker.person.fullName(),
};

export type Auth = typeof mockData;
