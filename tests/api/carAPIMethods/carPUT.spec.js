import { USERS } from "../../../src/data/dict/users.js";
import { PORSCHE_CAR } from "../garage/fixtures/cars.js";
import { test } from "../../../src/fixtures/custom.fixture.js";
import APIClient from "../../../src/client/APIClient.js";
import { expect } from "@playwright/test";

test.describe("API Controller - PUT", () => {
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

  let responseBody;
  let carId;

  test.beforeEach(async () => {
    client = await APIClient.authenticate(userCredentials);

    const response = await client.cars.createNewCar(createRequestBody);

    responseBody = response.data.data;
    carId = responseBody.id;

    userCarIdList.push(carId);
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

  test("existing car should be updated", async () => {
    const updatedData = {
      carBrandId: 3,
      carModelId: 15,
      mileage: 4646,
    };

    const response = await client.cars.editCarData(updatedData, carId);
    const body = response.data;

    const expectedBody = {
      brand: body.data.brand,
      carBrandId: updatedData.carBrandId,
      carCreatedAt: expect.any(String),
      carModelId: updatedData.carModelId,
      id: responseBody.id,
      initialMileage: responseBody.initialMileage,
      logo: body.data.logo,
      mileage: updatedData.mileage,
      model: body.data.model,
      updatedMileageAt: expect.any(String),
    };

    expect(response.status, "Response status code should be 200").toBe(200);
    expect(body.data).toMatchObject(expectedBody);
  });

  test("logged out user can't delete the car", async () => {
    client = await APIClient.authenticate({});
    const response = await client.cars.editCarData(
      { carBrandId: 4, carModelId: 17, mileage: 453 },
      carId,
    );
    const body = response.data;

    expect(response.status, "Response status code should be 401").toBe(401);
    expect(body.message).toBe("Not authenticated");
  });
});
