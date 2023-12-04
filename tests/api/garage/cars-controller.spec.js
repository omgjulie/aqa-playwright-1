import { test } from "../../../src/fixtures/custom.fixture.js";
import { expect } from "@playwright/test";
import { USERS } from "../../../src/data/dict/users.js";
import APIClient from "../../../src/client/APIClient.js";
import { VALID_BRANDS_RESPONSE_BODY } from "../../../src/data/dict/brands.js";
import { PORSCHE_CAR } from "./fixtures/cars.js";
import { VALID_BRAND_MODELS } from "../../../src/data/dict/models.js";

let client;

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

test.afterAll(async () => {
  client = await APIClient.authenticate(userCredentials);

  const userCarIdList = [];

  await test.step("get list all user car ids", async () => {
    const response = await client.cars.getUserCars();
    const body = response.data;

    for (const car of body.data) {
      userCarIdList.push(car.id);
    }
  });

  await test.step("delete all user cars", async () => {
    for (const id of userCarIdList) {
      await client.cars.deleteCar(id);
    }

    const response = await client.cars.getUserCars();
    const body = response.data;

    expect(body.data).toEqual([]);
  });
});

test.describe("API Controller - POST", () => {
  test.beforeEach(async () => {
    client = await APIClient.authenticate(userCredentials);
  });

  test("should create new car", async () => {
    const expectedBody = {
      id: expect.any(Number),
      carBrandId: PORSCHE_CAR.carBrandId,
      carCreatedAt: expect.any(String),
      carModelId: PORSCHE_CAR.carModelId,
      initialMileage: expect.any(Number),
      updatedMileageAt: expect.any(String),
      mileage: PORSCHE_CAR.mileage,
      brand: expect.any(String),
      model: expect.any(String),
      logo: expect.any(String),
    };

    const response = await client.cars.createNewCar(createRequestBody);

    const body = response.data;

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

test.describe("API Controllers - GET", () => {
  test.beforeEach(async () => {
    client = await APIClient.authenticate(userCredentials);
    await client.cars.createNewCar(createRequestBody);
  });

  test("should return user's cars", async () => {
    const response = await client.cars.getUserCars();

    expect(response.status, "Response status code should be 200").toEqual(200);
  });

  test("user is not logged in", async () => {
    client = await APIClient.authenticate({});
    const response = await client.cars.getUserCars();

    expect(response.status, "Response status code should be 401").toEqual(401);
    expect(response.data.message).toBe("Not authenticated");
  });

  test("user car route not found", async () => {
    const response = await client.cars.getUserCars("");

    expect(response.status, "Response status code should be 404").toEqual(404);
    expect(response.data.message).toBe("Not found");
  });

  test("should return valid car brands", async () => {
    const response = await client.cars.getCarBrands();
    const body = response.data;

    expect(response.status, "Response status code should be 200").toEqual(200);
    expect(body).toEqual(VALID_BRANDS_RESPONSE_BODY);
  });

  test("car brand route not found", async () => {
    const response = await client.cars.getCarBrands("");

    expect(response.status, "Response status code should be 404").toEqual(404);
    expect(response.data.message).toBe("Not found");
  });

  test("should return valid car brands by id", async () => {
    const carBrandId = 2;
    let carBrandData;

    const response = await client.cars.getCarBrandId(carBrandId);
    const body = response.data;

    expect(response.status, "Response status code should be 200").toEqual(200);

    for (const brand of VALID_BRANDS_RESPONSE_BODY.data) {
      if (brand.id === carBrandId) {
        carBrandData = brand;
      }
    }

    expect(body.data).toEqual(carBrandData);
  });

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

  test("car model route not found", async () => {
    const response = await client.cars.getCarModels("");

    expect(response.status, "Response status code should be 404").toEqual(404);
    expect(response.data.message).toBe("Not found");
  });

  test("should return valid car brand model by id", async () => {
    const carModelId = 2;
    let carModelData;

    const response = await client.cars.getCarModelId(carModelId);
    const body = response.data;

    expect(response.status, "Response status code should be 200").toEqual(200);

    for (const brand of VALID_BRAND_MODELS.data) {
      if (brand.id === carModelId) {
        carModelData = brand;
      }
    }

    expect(body.data).toEqual(carModelData);
  });

  test("No car brand model found with unexciting id", async () => {
    const invalidId = VALID_BRAND_MODELS.data.length + 1;

    const response = await client.cars.getCarModelId(invalidId);

    expect(response.status, "Response status code should be 404").toEqual(404);
    expect(response.data.message).toBe("No car models found with this id");
  });

  test("should return valid car info by id", async () => {
    let responseBody;
    let carId;

    await test.step("create new car", async () => {
      const response = await client.cars.createNewCar(createRequestBody);

      responseBody = response.data.data;
      carId = responseBody.id;
    });

    await test.step("return created car by id", async () => {
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
});

test.describe("API Controller - PUT", () => {
  test.beforeEach(async () => {
    client = await APIClient.authenticate(userCredentials);
  });

  test("existing car should be updated", async () => {
    let responseBody;
    let carId;

    await test.step("create new car", async () => {
      const response = await client.cars.createNewCar(createRequestBody);

      responseBody = response.data.data;
      carId = responseBody.id;
    });

    await test.step("return updated car info", async () => {
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
  });

  test("carBrandId, carModelId, mileage fields are required for updating ", async () => {
    let responseBody;
    let carId;

    await test.step("create new car", async () => {
      const response = await client.cars.createNewCar(createRequestBody);

      responseBody = response.data.data;
      carId = responseBody.id;
    });

    await test.step("return error message", async () => {
      const response = await client.cars.editCarData({}, carId);
      const body = response.data;

      expect(response.status, "Response status code should be 400").toBe(400);
      expect(body.message).toBe(
        "Unacceptable fields only or empty body are not allowed",
      );
    });
  });
});

test.describe("API Controller - DELETE", () => {
  test.beforeEach(async () => {
    client = await APIClient.authenticate(userCredentials);
  });

  test("should delete existing car", async () => {
    let responseBody;
    let carId;

    await test.step("create new car", async () => {
      const response = await client.cars.createNewCar(createRequestBody);

      responseBody = response.data.data;
      carId = responseBody.id;
    });

    await test.step("delete created car", async () => {
      const response = await client.cars.deleteCar(carId);
      const body = response.data;

      const expectedBody = {
        carId: responseBody.id,
      };

      expect(response.status, "Response status code should be 200").toBe(200);
      expect(body.data).toEqual(expectedBody);
    });
  });

  test("logged out user can't delete the car", async () => {
    let responseBody;
    let carId;

    await test.step("create new car", async () => {
      const response = await client.cars.createNewCar(createRequestBody);

      responseBody = response.data.data;
      carId = responseBody.id;
    });

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
