'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION create_tenant_schema(tenant_id INT)
      RETURNS VOID AS $$
      DECLARE
          schema_name TEXT;
      BEGIN
          -- Get schema name from tenants table
          SELECT tenants.schema_name INTO schema_name FROM tenants WHERE id = tenant_id;

          -- Create schema if not exists
          EXECUTE format('CREATE SCHEMA IF NOT EXISTS %I', schema_name);

          -- Cars Table
          EXECUTE format('
              CREATE TABLE %I.cars (
                  id SERIAL PRIMARY KEY,
                  make VARCHAR(100) NOT NULL,
                  model VARCHAR(100) NOT NULL,
                  year INT CHECK (year > 1900 AND year <= EXTRACT(YEAR FROM CURRENT_DATE)),
                  license_plate VARCHAR(50) UNIQUE NOT NULL,
                  status VARCHAR(50) CHECK (status IN (''Available'', ''Rented'', ''Maintenance'')) NOT NULL,
                  car_type_id INT
              )', schema_name);

          -- Car Types
          EXECUTE format('
              CREATE TABLE %I.car_types (
                  id SERIAL PRIMARY KEY,
                  name VARCHAR(50) NOT NULL,
                  description TEXT
              )', schema_name);

          -- Car Images
          EXECUTE format('
              CREATE TABLE %I.car_images (
                  id SERIAL PRIMARY KEY,
                  car_id INT REFERENCES %I.cars(id) ON DELETE CASCADE,
                  image_url TEXT NOT NULL
              )', schema_name, schema_name);

          -- Locations
          EXECUTE format('
              CREATE TABLE %I.locations (
                  id SERIAL PRIMARY KEY,
                  address TEXT NOT NULL,
                  city VARCHAR(100),
                  country VARCHAR(100),
                  phone_number VARCHAR(20)
              )', schema_name);

          -- Location Inventory
          EXECUTE format('
              CREATE TABLE %I.location_inventory (
                  location_id INT REFERENCES %I.locations(id),
                  car_id INT REFERENCES %I.cars(id),
                  quantity_available INT DEFAULT 0,
                  PRIMARY KEY (location_id, car_id)
              )', schema_name, schema_name, schema_name);

          -- Bookings Table
          EXECUTE format('
              CREATE TABLE %I.bookings (
                  id SERIAL PRIMARY KEY,
                  user_id INT NOT NULL,
                  car_id INT REFERENCES %I.cars(id) ON DELETE CASCADE,
                  start_date DATE NOT NULL,
                  end_date DATE NOT NULL,
                  status VARCHAR(50) CHECK (status IN (''Pending'', ''Confirmed'', ''Cancelled'', ''Completed'')) NOT NULL,
                  total_price DECIMAL(10,2) NOT NULL
              )', schema_name, schema_name);

          -- Payments Table
          EXECUTE format('
              CREATE TABLE %I.payments (
                  id SERIAL PRIMARY KEY,
                  booking_id INT REFERENCES %I.bookings(id) ON DELETE CASCADE,
                  amount DECIMAL(10,2) NOT NULL,
                  status VARCHAR(50) CHECK (status IN (''Pending'', ''Completed'', ''Failed'')) NOT NULL,
                  payment_method VARCHAR(50) CHECK (payment_method IN (''Card'', ''Cash'', ''PayPal'')) NOT NULL
              )', schema_name, schema_name);

          -- Reviews
          EXECUTE format('
              CREATE TABLE %I.reviews (
                  id SERIAL PRIMARY KEY,
                  user_id INT NOT NULL,
                  car_id INT REFERENCES %I.cars(id) ON DELETE CASCADE,
                  rating INT CHECK (rating BETWEEN 1 AND 5) NOT NULL,
                  comment TEXT,
                  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
              )', schema_name, schema_name);

          -- Maintenance Records
          EXECUTE format('
              CREATE TABLE %I.maintenance_records (
                  id SERIAL PRIMARY KEY,
                  car_id INT REFERENCES %I.cars(id),
                  service_type VARCHAR(100),
                  service_date DATE,
                  description TEXT,
                  cost DECIMAL(10, 2)
              )', schema_name, schema_name);

          -- Damage Reports
          EXECUTE format('
              CREATE TABLE %I.car_damage_reports (
                  id SERIAL PRIMARY KEY,
                  car_id INT REFERENCES %I.cars(id),
                  damage_type VARCHAR(100),
                  description TEXT,
                  cost DECIMAL(10, 2),
                  status VARCHAR(50)
              )', schema_name, schema_name);

          -- Permissions
          EXECUTE format('GRANT USAGE ON SCHEMA %I TO admin, manager', schema_name);
          EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA %I TO admin, manager', schema_name);
          EXECUTE format('GRANT SELECT ON ALL TABLES IN SCHEMA %I TO customer', schema_name);
      END;
      $$ LANGUAGE plpgsql;
    `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`DROP FUNCTION IF EXISTS create_tenant_schema(INT);`);
  }
};
