-- Create the affiliates table
CREATE TABLE IF NOT EXISTS affiliates (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- Create the campaigns table
CREATE TABLE IF NOT EXISTS campaigns (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- Create the clicks table
CREATE TABLE IF NOT EXISTS clicks (
    id SERIAL PRIMARY KEY,
    affiliate_id INT REFERENCES affiliates(id),
    campaign_id INT REFERENCES campaigns(id),
    click_id VARCHAR(255) UNIQUE NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create the conversions table with affiliate_id column
CREATE TABLE IF NOT EXISTS conversions (
    id SERIAL PRIMARY KEY,
    click_id INT REFERENCES clicks(id),
    amount NUMERIC(10, 2) NOT NULL,
    currency VARCHAR(10) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    affiliate_id INT REFERENCES affiliates(id) -- Added this column
);

-- Insert sample data
INSERT INTO affiliates (id, name) VALUES
    (1, 'Marketing Masters'),
    (2, 'Traffic Titans')
ON CONFLICT (id) DO NOTHING;

INSERT INTO campaigns (id, name) VALUES
    (101, 'Summer Sale'),
    (102, 'Winter Clearance')
ON CONFLICT (id) DO NOTHING;
