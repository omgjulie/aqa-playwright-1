import BaseController from "./BaseController.js";

export default class CarsController extends BaseController {
  #CREATE_CAR_PATH = "/cars";

  #GET_CARS_PATH = "/cars";
  #GET_CAR_BRANDS_PATH = "/cars/brands";
  #GET_CAR_BRAND_ID_PATH = `/cars/brands/`;
  #GET_CAR_MODELS_PATH = "/cars/models";
  #GET_CAR_MODEL_ID_PATH = `/cars/models/`;
  #GET_USER_CAR_ID_PATH = `/cars/`;

  #EDIT_CAR_PATH = `/cars/`;

  #DELETE_CAR_PATH = `/cars/`;

  constructor(options) {
    super(options);
  }
  async createNewCar({ carBrandId, carModelId, mileage }) {
    return this._client.post(this.#CREATE_CAR_PATH, {
      carBrandId,
      carModelId,
      mileage,
    });
  }

  async getUserCars(path) {
    if (path != null) {
      return this._client.get(path);
    }
    return this._client.get(this.#GET_CARS_PATH);
  }

  async getCarBrands(path) {
    if (path != null) {
      return this._client.get(path);
    }
    return this._client.get(this.#GET_CAR_BRANDS_PATH);
  }

  async getCarBrandId(carBrandId) {
    return this._client.get(this.#GET_CAR_BRAND_ID_PATH + carBrandId);
  }

  async getCarModels(path) {
    if (path != null) {
      return this._client.get(path);
    }
    return this._client.get(this.#GET_CAR_MODELS_PATH);
  }

  async getCarModelId(carModelId) {
    return this._client.get(this.#GET_CAR_MODEL_ID_PATH + carModelId);
  }

  async getCarById(carId) {
    return this._client.get(this.#GET_USER_CAR_ID_PATH + carId);
  }

  async editCarData({ carBrandId, carModelId, mileage }, carId) {
    return this._client.put(this.#EDIT_CAR_PATH + carId, {
      carBrandId,
      carModelId,
      mileage,
    });
  }

  async deleteCar(carId) {
    return this._client.delete(this.#DELETE_CAR_PATH + carId);
  }
}
