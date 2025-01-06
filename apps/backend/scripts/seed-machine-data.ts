import { db } from '../src/db';
import { machineData, type NewMachineData } from '../src/db/schema';
import { parse } from 'csv-parse';
import fs from 'fs';
import path from 'path';

const INTERVAL_MS = 10000; // 10 seconds interval between inserts

async function seedMachineData() {
  try {
    const csvPath = path.join(__dirname, '../dataset_with_timestamps.csv');
    const fileContent = fs.readFileSync(csvPath, 'utf-8');

    const records: any[] = await new Promise((resolve, reject) => {
      parse(
        fileContent,
        {
          columns: true,
          skip_empty_lines: true,
          cast: true,
        },
        (err, records) => {
          if (err) reject(err);
          resolve(records);
        }
      );
    });

    console.log(`Found ${records.length} records to insert`);

    for (const [index, record] of records.entries()) {
      const newMachineData: NewMachineData = {
        timestamp: new Date(),
        airTemperature: record['Air temperature [K]'].toString(),
        processTemperature: record['Process temperature [K]'].toString(),
        rotationalSpeed: parseInt(record['Rotational speed [rpm]']),
        torque: record['Torque [Nm]'].toString(),
        toolWear: parseInt(record['Tool wear [min]']),
        machineStatus: true,
        predictionStatus: 'pending',
      };

      await db.insert(machineData).values(newMachineData);
      console.log(`Inserted record ${index + 1}/${records.length}`);

      if (index < records.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, INTERVAL_MS));
      }
    }

    console.log('Machine data seeded successfully');
  } catch (error) {
    console.error('Error seeding machine data:', error);
    process.exit(1);
  }

  process.exit(0);
}

seedMachineData();
