import pandas as pd 
import psycopg2
from datetime import datetime

df = pd.read_csv('machine_data.csv')

conn = psycopg2.connect(
    dbname ="insightengine",
    user ="postgres",
    password ="12345",
    host ="172.27.226.187"

)

cur = conn.cursor()

for index, row in df.iterrows():
        cur.execute("""
            INSERT INTO machine_data VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            datetime.strptime(row['timestamp'], '%Y-%m-%d %H:%M:%S'),
            row['udi'],
            row['type'],
            row['air_temperature'],
            row['process_temperature'],
            row['rotational_speed'],
            row['torque'],
            row['tool_wear'],
            row['machine_failure'],
            row['twf'],
            row['hdf'],
            row['pwf'],
            row['osf'],
            row['rnf']
        ))
conn.commit()
cur.close()
conn.close()