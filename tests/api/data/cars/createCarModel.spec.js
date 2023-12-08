import { expect, test } from "@playwright/test";
import APIClient from "../../../../src/client/APIClient.js";
import { USERS } from "../../../../src/data/dict/users.js";
import CreateCarModel from "../../../../src/models/cars/CreateCarModel.js";
import { VALID_BRAND_MODELS } from "../../../../src/data/dict/models.js";
import { VALID_BRANDS_RESPONSE_BODY } from "../../../../src/data/dict/brands.js";

test.describe("Cars", () => {
  const userCredentials = {
    email: USERS.YULIIA_AQA.email,
    password: USERS.YULIIA_AQA.password,
    remember: false,
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

  test("should create car with valid data", async () => {
    const carModel = new CreateCarModel({
      carBrandId: 1,
      carModelId: 1,
      mileage: 564,
    });
    const brand = VALID_BRANDS_RESPONSE_BODY.data.find(
      (brand) => brand.id === carModel.carBrandId,
    );
    const model = VALID_BRAND_MODELS.data.find(
      (model) => model.id === carModel.carModelId,
    );

    const response = await client.cars.createNewCar(carModel);
    const expectedBody = {
      ...carModel,
      id: expect.any(Number),
      carCreatedAt: expect.any(String),
      updatedMileageAt: expect.any(String),
      initialMileage: carModel.mileage,
      brand: brand.title,
      model: model.title,
      logo: brand.logoFilename,
    };

    expect(response.data.data, "Returned car object should be valid").toEqual(
      expectedBody,
    );
  });
});
