import { USERS } from "../../../src/data/dict/users.js";
import { PORSCHE_CAR } from "../garage/fixtures/cars.js";
import { test } from "../../../src/fixtures/custom.fixture.js";
import APIClient from "../../../src/client/APIClient.js";
import { expect } from "@playwright/test";
import CreateCarModel from "../../../src/models/cars/CreateCarModel.js";

test.describe("API Controller - DELETE", () => {
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

    const body = response.data;
    userCarIdList.push(body.data.id);
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

  test("should delete existing car", async () => {
    const response = await client.cars.deleteCar(carId);
    const body = response.data;

    const expectedBody = {
      carId: responseBody.id,
    };

    expect(response.status, "Response status code should be 200").toBe(200);
    expect(body.data).toEqual(expectedBody);
  });

  test("logged out user can't delete the car", async () => {
    await test.step("delete created car", async () => {
      client = await APIClient.authenticate({});
      const response = await client.cars.deleteCar(carId);

      expect(response.status, "Response status code should be 401").toBe(401);
    });

    await test.step("get created car by id", async () => {
      client = await APIClient.authenticate(userCredentials);

      const response = await client.cars.getCarById(carId);

      expect(response.status, "Created car should be existed").toBe(200);
    });
  });
});
