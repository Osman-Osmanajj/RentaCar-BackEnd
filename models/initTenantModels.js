import CarModel from './Car.js';
import BookingModel from './Booking.js';
import CarDamageReportModel from './CarDamageReport.js';
import CarImageModel from './CarImage.js';
import LocationInventoryModel from './LocationInventory.js';
import MaintenanceRecordModel from './MaintenanceRecord.js';
import PaymentModel from './Payment.js';
import ReviewModel from './Review.js';
import CarTypeModel from './CarType.js';
import LocationModel from './Location.js';
import { sequelize } from '../config/database.js';

export const initTenantModels = (schemaName) => {
  const options = {
    schema: schemaName,
    searchPath: schemaName,
  };

  const Car = CarModel(sequelize, options);
  const Booking = BookingModel(sequelize, options);
  const CarDamageReport = CarDamageReportModel(sequelize, options);
  const CarImage = CarImageModel(sequelize, options);
  const CarType = CarTypeModel(sequelize, options);
  const Location = LocationModel(sequelize, options);
  const LocationInventory = LocationInventoryModel(sequelize, options);
  const MaintenanceRecord = MaintenanceRecordModel(sequelize, options);
  const Payment = PaymentModel(sequelize, options);
  const Review = ReviewModel(sequelize, options);


    Car.associate({ CarType, Booking, CarImage, CarDamageReport, MaintenanceRecord });
    Booking.associate({ Car, Payment, Review });
    CarDamageReport.associate({ Car });
    CarImage.associate({ Car });
    CarType.associate({ Car });
    LocationInventory.associate({ Location, Car });
    MaintenanceRecord.associate({ Car });
    Payment.associate({ Booking });
    Review.associate({ Car, Booking });
    Location.associate({ LocationInventory });



  return { Car, Booking,CarDamageReport,CarImage,CarType,Location,LocationInventory,MaintenanceRecord,Payment,Review,};
};
