import { faker } from "@faker-js/faker";

import { createStay } from "@/mocks/factories";

faker.seed(20260702);

const fixtureStayIds = ["nordhaven-loft", "atlas-cabin", "maison-solis"] as const;

export const mockStays = fixtureStayIds.map((id) => createStay({ id }));

export const findStay = (stayId: string) => mockStays.find((stay) => stay.id === stayId);
