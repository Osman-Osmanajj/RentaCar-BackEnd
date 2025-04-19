'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION create_tenant_schema(tenant_id INT)
      RETURNS VOID AS $$
      DECLARE
          schema_name TEXT;
      BEGIN
          -- Explicitly reference the tenants table for schema_name
          SELECT tenants.schema_name INTO schema_name FROM tenants WHERE id = tenant_id;
          
          -- Create the schema
          EXECUTE format('CREATE SCHEMA IF NOT EXISTS %I', schema_name);
          
          -- Cars table
          EXECUTE format('
              CREATE TABLE %I.cars (
                  id SERIAL PRIMARY KEY,
                  make VARCHAR(100) NOT NULL,
                  model VARCHAR(100) NOT NULL,
                  year INT CHECK (year > 1900 AND year <= EXTRACT(YEAR FROM CURRENT_DATE)),
                  license_plate VARCHAR(50) UNIQUE NOT NULL,
                  status VARCHAR(50) CHECK (status IN (''Available'', ''Rented'', ''Maintenance'')) NOT NULL
              )', schema_name);

          -- Bookings table
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

          -- Payments table
          EXECUTE format('
              CREATE TABLE %I.payments (
                  id SERIAL PRIMARY KEY,
                  booking_id INT REFERENCES %I.bookings(id) ON DELETE CASCADE,
                  amount DECIMAL(10,2) NOT NULL,
                  status VARCHAR(50) CHECK (status IN (''Pending'', ''Completed'', ''Failed'')) NOT NULL,
                  payment_method VARCHAR(50) CHECK (payment_method IN (''Card'', ''Cash'', ''PayPal'')) NOT NULL
              )', schema_name, schema_name);

          -- Reviews table
          EXECUTE format('
              CREATE TABLE %I.reviews (
                  id SERIAL PRIMARY KEY,
                  user_id INT NOT NULL,
                  car_id INT REFERENCES %I.cars(id) ON DELETE CASCADE,
                  rating INT CHECK (rating BETWEEN 1 AND 5) NOT NULL,
                  comment TEXT,
                  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
