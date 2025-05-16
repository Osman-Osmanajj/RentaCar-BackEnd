'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION public.create_tenant_schema(tenant_id INT)
      RETURNS VOID AS $$
      DECLARE
        schema_name TEXT;
      BEGIN
        /* fetch schema name from public.tenants */
        SELECT t.schema_name INTO schema_name
          FROM public.tenants t
         WHERE t.id = tenant_id;

        /* create the schema if it doesn't exist */
        EXECUTE format('CREATE SCHEMA IF NOT EXISTS %I', schema_name);

        /* --------------------- core tables ------------------ */

        EXECUTE format($fmt$
          CREATE TABLE IF NOT EXISTS %I.car_types (
            id SERIAL PRIMARY KEY,
            name        VARCHAR(50) NOT NULL,
            description TEXT
          )
        $fmt$, schema_name);
        

        EXECUTE format($fmt$
          CREATE TABLE IF NOT EXISTS %I.cars (
            id SERIAL PRIMARY KEY,
            make            VARCHAR(100) NOT NULL,
            model           VARCHAR(100) NOT NULL,
            year            INT CHECK (year > 1900
                                   AND year <= EXTRACT(YEAR FROM CURRENT_DATE)),
            license_plate   VARCHAR(50) UNIQUE NOT NULL,
            status          VARCHAR(50) CHECK (status IN
                             ('Available','Rented','Maintenance')) NOT NULL,
            car_type_id INT REFERENCES %I.car_types(id),
            price           DECIMAL(10, 2) CHECK (price > 0)
          )
        $fmt$, schema_name, schema_name);

        EXECUTE format($fmt$
          CREATE TABLE IF NOT EXISTS %I.car_images (
            id SERIAL PRIMARY KEY,
            car_id    INT REFERENCES %I.cars(id) ON DELETE CASCADE,
            image_url TEXT NOT NULL
          )
        $fmt$, schema_name, schema_name);

        EXECUTE format($fmt$
          CREATE TABLE IF NOT EXISTS %I.locations (
            id SERIAL PRIMARY KEY,
            address      TEXT NOT NULL,
            city         VARCHAR(100),
            country      VARCHAR(100),
            phone_number VARCHAR(20)
          )
        $fmt$, schema_name);

        EXECUTE format($fmt$
          CREATE TABLE IF NOT EXISTS %I.location_inventory (
            location_id INT REFERENCES %I.locations(id),
            car_id      INT REFERENCES %I.cars(id),
            quantity_available INT DEFAULT 0,
            PRIMARY KEY (location_id, car_id)
        )
        $fmt$, schema_name, schema_name, schema_name);

        EXECUTE format($fmt$
          CREATE TABLE IF NOT EXISTS %I.bookings (
            id SERIAL PRIMARY KEY,
            user_id     INT NOT NULL,
            car_id      INT REFERENCES %I.cars(id) ON DELETE CASCADE,
            start_date  DATE NOT NULL,
            end_date    DATE NOT NULL,
            status      VARCHAR(50) CHECK (status IN
                        ('Pending','Confirmed','Cancelled','Completed')) NOT NULL,
            total_price DECIMAL(10,2) NOT NULL
          )
        $fmt$, schema_name, schema_name);

        EXECUTE format($fmt$
          CREATE TABLE IF NOT EXISTS %I.payments (
            id SERIAL PRIMARY KEY,
            booking_id INT REFERENCES %I.bookings(id) ON DELETE CASCADE,
            amount      DECIMAL(10,2) NOT NULL,
            status      VARCHAR(50) CHECK (status IN
                        ('Pending','Completed','Failed')) NOT NULL,
            payment_method VARCHAR(50) CHECK (payment_method IN
                        ('Card','Cash','PayPal')) NOT NULL
          )
        $fmt$, schema_name, schema_name);

        EXECUTE format($fmt$
          CREATE TABLE IF NOT EXISTS %I.reviews (
            id SERIAL PRIMARY KEY,
            user_id  INT NOT NULL REFERENCES public.users(id),
            car_id   INT REFERENCES %I.cars(id) ON DELETE CASCADE,
            rating   INT CHECK (rating BETWEEN 1 AND 5) NOT NULL,
            comment  TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        $fmt$, schema_name, schema_name);

        EXECUTE format($fmt$
          CREATE TABLE IF NOT EXISTS %I.maintenance_records (
            id SERIAL PRIMARY KEY,
            car_id        INT REFERENCES %I.cars(id),
            service_type  VARCHAR(100),
            service_date  DATE,
            description   TEXT,
            cost          DECIMAL(10,2)
          )
        $fmt$, schema_name, schema_name);

        EXECUTE format($fmt$
          CREATE TABLE IF NOT EXISTS %I.car_damage_reports (
            id SERIAL PRIMARY KEY,
            car_id      INT REFERENCES %I.cars(id),
            damage_type VARCHAR(100),
            description TEXT,
            cost        DECIMAL(10,2),
            status      VARCHAR(50)
          )
        $fmt$, schema_name, schema_name);

      END;
      $$ LANGUAGE plpgsql;
    `);


    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION public.create_tenant_schema_trigger()
      RETURNS TRIGGER AS $$
      BEGIN
        PERFORM public.create_tenant_schema(NEW.id);
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);


    await queryInterface.sequelize.query(`
      CREATE OR REPLACE TRIGGER trg_after_tenant_insert
      AFTER INSERT ON public.tenants
      FOR EACH ROW
      EXECUTE FUNCTION public.create_tenant_schema_trigger();
    `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS trg_after_tenant_insert ON public.tenants;
    `);
    await queryInterface.sequelize.query(`
      DROP FUNCTION IF EXISTS public.create_tenant_schema_trigger();
    `);
    await queryInterface.sequelize.query(`
      DROP FUNCTION IF EXISTS public.create_tenant_schema(INT);
    `);
  }
};
