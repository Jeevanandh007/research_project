import pandas as pd 
import psycopg2
from datetime import datetime

df = pd.read_csv('machine_data_9000.csv')

conn = psycopg2.connect(
    dbname ="insightengine",
    user ="postgres",
    password ="12345",
    host ="172.27.226.187"

)


print("Available columns:", df.columns.tolist())
print("\n first few rows: ")
print(df.head())
        

cur = conn.cursor()

for index, row in df.iterrows():
        cur.execute("""
            INSERT INTO machine_data VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            datetime.strptime(row['Timestamp'], '%d-%m-%y %H:%M'),
            row['UID'],
            row['Type'],
            row['Air temperature [K]'],
            row['Process temperature [K]'],
            row['Rotational speed [rpm]'],
            row['Torque [Nm]'],
            row['Tool wear [min]'],
            row['Machine failure'],
            row['TWF'],
            row['HDF'],
            row['PWF'],
            row['OSF'],
            row['RNF']
        ))
conn.commit()
cur.close()
conn.close()
 