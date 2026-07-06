import { faker } from "@faker-js/faker";

import { createStay } from "@/mocks/factories";

faker.seed(20260702);

const stayIds = Array.from({ length: 24 }, () => faker.string.uuid());

export const mockStays = stayIds.map((id) => createStay({ id }));
