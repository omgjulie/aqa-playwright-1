import { USERS } from "../../../src/data/dict/users.js";
import { test } from "../../../src/fixtures/custom.fixture.js";
import APIClient from "../../../src/client/APIClient.js";
import { expect } from "@playwright/test";
import { VALID_BRANDS_RESPONSE_BODY } from "../../../src/data/dict/brands.js";
import { VALID_BRAND_MODELS } from "../../../src/data/dict/models.js";
import CreateCarModel from "../../../src/models/cars/CreateCarModel.js";
import UpdateCarModel from "../../../src/models/cars/UpdateCarModel.js";

test.describe("API Controller - PUT", () => {
  const userCredentials = {
    email: USERS.YULIIA_AQA.email,
    password: USERS.YULIIA_AQA.password,
    remember: false,
  };

  let client;
  const userCarIdList = [];

  let responseBody;
  let carId;

  test.beforeEach(async () => {
    client = await APIClient.authenticate(userCredentials);

    const carModel = CreateCarModel.createRandomCarData().extract();
    const response = await client.cars.createNewCar(carModel);

    responseBody = response.data.data;
    carId = responseBody.id;

    userCarIdList.push(carId);
  });

  test.afterEach(async () => {
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
    const updatedData = UpdateCarModel.createNewRandomCarData().extract();

    const response = await client.cars.editCarData(updatedData, carId);
    const body = response.data;

    const brand = VALID_BRANDS_RESPONSE_BODY.data.find(
      (brand) => brand.id === updatedData.carBrandId,
    );
    const model = VALID_BRAND_MODELS.data.find(
      (model) => model.id === updatedData.carModelId,
    );

    const expectedBody = {
      brand: brand.title,
      carBrandId: updatedData.carBrandId,
      carCreatedAt: expect.any(String),
      carModelId: updatedData.carModelId,
      id: responseBody.id,
      initialMileage: responseBody.initialMileage,
      logo: brand.logoFilename,
      mileage: updatedData.mileage,
      model: model.title,
      updatedMileageAt: expect.any(String),
    };

    expect(response.status, "Response status code should be 200").toBe(201);
    expect(body.data).toMatchObject(expectedBody);
  });

  test("logged out user can't delete the car", async () => {
    const updatedData = UpdateCarModel.createNewRandomCarData().extract();
    client = await APIClient.authenticate({});
    const response = await client.cars.editCarData(updatedData, carId);
    const body = response.data;

    expect(response.status, "Response status code should be 401").toBe(401);
    expect(body.message).toBe("Not authenticated");
  });
});
