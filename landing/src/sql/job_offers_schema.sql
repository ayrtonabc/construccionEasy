-- Esquema SQL para la funcionalidad de ofertas de trabajo

-- 1. Añadir columna 'interested_in_jobs' a la tabla 'clients' si no existe
ALTER TABLE clients
ADD COLUMN IF NOT EXISTS interested_in_jobs BOOLEAN DEFAULT FALSE;

-- 2. Crear tabla 'job_offers' para almacenar las ofertas de trabajo
CREATE TABLE IF NOT EXISTS job_offers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  hourly_pay TEXT NOT NULL,
  benefits TEXT,
  city TEXT NOT NULL,
  image_url TEXT,
  whatsapp_url TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Crear tabla de relación entre clientes y ofertas de trabajo (opcional)
CREATE TABLE IF NOT EXISTS client_job_interests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  job_offer_id UUID NOT NULL REFERENCES job_offers(id) ON DELETE CASCADE,
  is_interested BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(client_id, job_offer_id)
);

-- 4. Crear función para actualizar el timestamp 'updated_at'
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 5. Crear triggers para actualizar automáticamente 'updated_at'
CREATE TRIGGER update_job_offers_updated_at
BEFORE UPDATE ON job_offers
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_client_job_interests_updated_at
BEFORE UPDATE ON client_job_interests
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- 6. Crear índices para mejorar el rendimiento de las consultas
CREATE INDEX IF NOT EXISTS idx_job_offers_is_active ON job_offers(is_active);
CREATE INDEX IF NOT EXISTS idx_client_job_interests_client_id ON client_job_interests(client_id);
CREATE INDEX IF NOT EXISTS idx_client_job_interests_job_offer_id ON client_job_interests(job_offer_id);

-- 7. Comentarios para documentar las tablas
COMMENT ON TABLE job_offers IS 'Almacena las ofertas de trabajo disponibles para los clientes';
COMMENT ON TABLE client_job_interests IS 'Almacena las relaciones entre clientes y ofertas de trabajo';
COMMENT ON COLUMN clients.interested_in_jobs IS 'Indica si el cliente está interesado en recibir ofertas de trabajo';

-- 8. Datos de ejemplo para ofertas de trabajo (opcional)
INSERT INTO job_offers (title, hourly_pay, benefits, city, image_url, whatsapp_url)
VALUES 
('Operario de Producción', '20-25 PLN/hora', 'Alojamiento incluido, transporte a la planta', 'Varsovia', 'https://example.com/images/production_worker.jpg', 'https://wa.me/48123456789?text=Interesado%20en%20oferta%20de%20Operario'),
('Ayudante de Cocina', '18-22 PLN/hora', 'Comidas incluidas, horario flexible', 'Cracovia', 'https://example.com/images/kitchen_helper.jpg', 'https://wa.me/48123456790?text=Interesado%20en%20oferta%20de%20Ayudante%20de%20Cocina'),
('Limpieza de Oficinas', '19-21 PLN/hora', 'Horario part-time, posibilidad de horas extras', 'Wroclaw', 'https://example.com/images/office_cleaner.jpg', 'https://wa.me/48123456791?text=Interesado%20en%20oferta%20de%20Limpieza')
ON CONFLICT DO NOTHING;
