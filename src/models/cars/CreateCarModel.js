import { faker } from "@faker-js/faker";
import { VALID_BRANDS_RESPONSE_BODY } from "../../data/dict/brands.js";
import { VALID_BRAND_MODELS } from "../../data/dict/models.js";

export default class CreateCarModel {
  constructor(data) {
    this._data = data;
  }

  extract() {
    return structuredClone(this._data);
  }

  static createRandomCarData() {
    const brandId = faker.number.int({
      max: VALID_BRANDS_RESPONSE_BODY.data.length,
      min: 1,
    });
    const modelId = VALID_BRAND_MODELS.data.find(
      (model) => model.carBrandId === brandId,
    );

    return new CreateCarModel({
      carBrandId: brandId,
      carModelId: modelId.id,
      mileage: faker.number.int({ max: 500, min: 1 }),
    });
  }
}
