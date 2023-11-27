import { test } from "../../../src/fixtures/userAPIRequest.fixture.js";
import { expect } from "@playwright/test";
import { PORSCHE_CAR } from "./fixtures/cars.js";

test.describe.only("API", () => {
  test("should create new car", async ({ userAPIRequest }) => {
    const requestBody = {
      carBrandId: PORSCHE_CAR.carBrandId,
      carModelId: PORSCHE_CAR.carModelId,
      mileage: PORSCHE_CAR.mileage,
    };

    const response = await userAPIRequest.post("/api/cars", {
      data: requestBody,
    });

    const body = await response.json();

    await expect(
      body.data,
      "Response body should contain the data from request body",
    ).toMatchObject(requestBody);
    await expect(
      response.status(),
      "Response status code should be 201",
    ).toEqual(201);
  });

  test("empty body is not allowed", async ({ userAPIRequest }) => {
    const response = await userAPIRequest.post("/api/cars", {
      data: {},
    });

    const body = await response.json();
    await expect(
      response.status(),
      "Response status code should be 400",
    ).toEqual(400);

    await expect(body.status, "Error status").toBe("error");
    await expect(body.message, "Message: Car brand id is required").toBe(
      "Car brand id is required",
    );
  });

  test("user should be logged in", async ({ request }) => {
    const requestBody = {
      carBrandId: PORSCHE_CAR.carBrandId,
      carModelId: PORSCHE_CAR.carModelId,
      mileage: PORSCHE_CAR.mileage,
    };

    const response = await request.post("/api/cars", {
      data: requestBody,
    });

    const body = await response.json();

    await expect(
      response.status(),
      "Response status code should be 401",
    ).toEqual(401);

    await expect(body.status, "Error status").toBe("error");
    await expect(body.message, "Message: Not authenticated").toBe(
      "Not authenticated",
    );
  });
});
