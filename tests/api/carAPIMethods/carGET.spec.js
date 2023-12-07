import { USERS } from "../../../src/data/dict/users.js";
import { PORSCHE_CAR } from "../garage/fixtures/cars.js";
import { test } from "../../../src/fixtures/custom.fixture.js";
import APIClient from "../../../src/client/APIClient.js";
import { expect } from "@playwright/test";
import { VALID_BRANDS_RESPONSE_BODY } from "../../../src/data/dict/brands.js";
import { VALID_BRAND_MODELS } from "../../../src/data/dict/models.js";

test.describe("API Controllers - GET", () => {
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

  test("should return user's cars", async () => {
    const response = await client.cars.getUserCars();

    const body = response.data;

    const expectedBody = {
      brand: expect.any(String),
      carBrandId: expect.any(Number),
      carCreatedAt: expect.any(String),
      carModelId: expect.any(Number),
      id: expect.any(Number),
      initialMileage: expect.any(Number),
      logo: expect.any(String),
      mileage: expect.any(Number),
      model: expect.any(String),
      updatedMileageAt: expect.any(String),
    };

    expect(response.status, "Response status code should be 200").toEqual(200);

    for (const car of body.data) {
      expect(car).toMatchObject(expectedBody);
    }
  });

  test("user is not logged in", async () => {
    client = await APIClient.authenticate({});
    const response = await client.cars.getUserCars();

    expect(response.status, "Response status code should be 401").toEqual(401);
    expect(response.data.message).toBe("Not authenticated");
  });

  test("should return valid car brands", async () => {
    const response = await client.cars.getCarBrands();
    const body = response.data;

    expect(response.status, "Response status code should be 200").toEqual(200);
    expect(body).toEqual(VALID_BRANDS_RESPONSE_BODY);
  });

  for (const brand of VALID_BRANDS_RESPONSE_BODY.data) {
    test(`should return valid car ${brand.title} by id`, async () => {
      const carBrandId = brand.id;
      const carBrandData = brand;

      const response = await client.cars.getCarBrandId(carBrandId);
      const body = response.data;

      expect(response.status, "Response status code should be 200").toEqual(
        200,
      );

      expect(body.data).toEqual(carBrandData);
    });
  }

  test("No car brands found with unexciting id", async () => {
    const invalidId = VALID_BRANDS_RESPONSE_BODY.data.length + 1;

    const response = await client.cars.getCarBrandId(invalidId);

    expect(response.status, "Response status code should be 404").toEqual(404);
    expect(response.data.message).toBe("No car brands found with this id");
  });

  test("should return valid car models", async () => {
    const response = await client.cars.getCarModels();
    const body = response.data;

    expect(response.status, "Response status code should be 200").toEqual(200);
    expect(body).toEqual(VALID_BRAND_MODELS);
  });
  git;

  for (const model of VALID_BRAND_MODELS.data) {
    test(`should return valid car ${model.title} model by id`, async () => {
      const carModelId = model.id;
      const carModelData = model;

      const response = await client.cars.getCarModelId(carModelId);
      const body = response.data;

      expect(response.status, "Response status code should be 200").toEqual(
        200,
      );

      expect(body.data).toEqual(carModelData);
    });
  }

  test("No car brand model found with unexciting id", async () => {
    const invalidId = VALID_BRAND_MODELS.data.length + 1;

    const response = await client.cars.getCarModelId(invalidId);

    expect(response.status, "Response status code should be 404").toEqual(404);
    expect(response.data.message).toBe("No car models found with this id");
  });

  test("should return valid car info by id", async () => {
    const response = await client.cars.getCarById(carId);
    const body = response.data;

    const expectedBody = {
      brand: responseBody.brand,
      carBrandId: responseBody.carBrandId,
      carCreatedAt: expect.any(String),
      carModelId: responseBody.carModelId,
      id: responseBody.id,
      initialMileage: responseBody.initialMileage,
      logo: responseBody.logo,
      mileage: responseBody.mileage,
      model: responseBody.model,
      updatedMileageAt: expect.any(String),
    };

    expect(response.status, "Response status code should be 200").toBe(200);
    expect(body.data).toMatchObject(expectedBody);
  });
});
