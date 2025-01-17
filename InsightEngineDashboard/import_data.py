import pandas as pd
import psycopg2
from datetime import datetime


df = pd.read_csv('machine_data_9000.csv')

# Database connection
conn = psycopg2.connect(
    dbname="insightengine",
    user="postgres",
    password="postgres",
    host="postgres"
)

print("Available columns:", df.columns.tolist())
print("\nFirst few rows:")
print(df.head())

cur = conn.cursor()

# Insert data 
for index, row in df.iterrows():
    cur.execute("""
        INSERT INTO machine_data
                (
            "timestamp",
            air_temperature,
            process_temperature,
            rotational_speed,
            torque,
            tool_wear,
            machine_status,
            prediction_status,
            product_id,
            type,
            twf,
            hdf,
            pwf,
            osf,
            rnf)
                VALUES 
                (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """, (
        datetime.strptime(row['Timestamp'], '%d-%m-%y %H:%M'),
        row['Air temperature [K]'],
        row['Process temperature [K]'],
        row['Rotational speed [rpm]'],
        row['Torque [Nm]'],
        row['Tool wear [min]'],
        row['Machine failure'],
        row['Machine failure'],
        row['Product ID'],
        row['Type'],
        row['TWF'],
        row['HDF'],
        row['PWF'],
        row['OSF'],
        row['RNF']
    ))

conn.commit()
cur.close()
conn.close()