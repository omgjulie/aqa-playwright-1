import { USERS } from "../../../src/data/dict/users.js";
import { PORSCHE_CAR } from "../garage/fixtures/cars.js";
import { test } from "../../../src/fixtures/custom.fixture.js";
import APIClient from "../../../src/client/APIClient.js";
import { expect } from "@playwright/test";

test.describe("API Controller - POST", () => {
  const userCredentials = {
    email: USERS.YULIIA_AQA.email,
    password: USERS.YULIIA_AQA.password,
    remember: false,
  };

  const createRequestBody = {
    carBrandId: PORSCHE_CAR.carBrandId,
    carModelId: PORSCHE_CAR.carModelId,
    mileage: PORSCHE_CAR.mileage,
  };

  let client;
  const userCarIdList = [];

  test.beforeEach(async () => {
    client = await APIClient.authenticate(userCredentials);
  });

  test.afterAll(async () => {
    client = await APIClient.authenticate(userCredentials);

    for (const id of userCarIdList) {
      await client.cars.deleteCar(id);
    }

    for (const id of userCarIdList) {
      const response = await client.cars.getCarById(id);
      const body = response.data;

      expect(body.message).toBe("Car not found");
    }
  });

  test("should create new car", async () => {
    const expectedBody = {
      id: expect.any(Number),
      carBrandId: createRequestBody.carBrandId,
      carCreatedAt: expect.any(String),
      carModelId: createRequestBody.carModelId,
      initialMileage: expect.any(Number),
      updatedMileageAt: expect.any(String),
      mileage: createRequestBody.mileage,
      brand: expect.any(String),
      model: expect.any(String),
      logo: expect.any(String),
    };

    const response = await client.cars.createNewCar(createRequestBody);

    const body = response.data;

    userCarIdList.push(body.data.id);

    expect(
      body.data,
      "Response body should contain the data from request body",
    ).toEqual(expectedBody);

    expect(response.status, "Response status code should be 201").toEqual(201);
  });

  test("empty body is not allowed", async () => {
    const response = await client.cars.createNewCar({});

    const body = await response.data;
    await expect(response.status, "Response status code should be 400").toEqual(
      400,
    );

    await expect(body.status, "Error status").toBe("error");
    await expect(body.message, "Message: Car brand id is required").toBe(
      "Car brand id is required",
    );
  });
});
