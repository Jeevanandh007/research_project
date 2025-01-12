import { db } from '../src/db';
import { machineData, type NewMachineData } from '../src/db/schema';
import { parse } from 'csv-parse';
import fs from 'fs';
import path from 'path';
import moment from 'moment';
import { get, keys } from 'lodash';

const INTERVAL_MS = 10000; // 10 seconds interval between inserts

async function seedMachineData() {
  try {
    const csvPath = path.join(__dirname, '../dataset_with_timestamps.csv');
    console.log(csvPath);
    const fileContent = fs.readFileSync(csvPath, 'utf-8');

    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      // cast: true,
    });

    for await (const record of records) {
      console.log('Inserting', record);
      const timestamp = moment(get(record, keys(record)[0]), 'DD-MM-YY HH:mm');

      const newMachineData: NewMachineData = {
        timestamp: timestamp.toDate(),
        productId: record['Product ID'],
        type: record['Type'],
        airTemperature: record['Air temperature [K]'].toString(),
        processTemperature: record['Process temperature [K]'].toString(),
        rotationalSpeed: parseInt(record['Rotational speed [rpm]']),
        torque: record['Torque [Nm]'].toString(),
        toolWear: parseInt(record['Tool wear [min]']),
        twf: Boolean(parseInt(record['TWF'])),
        hdf: Boolean(parseInt(record['HDF'])),
        pwf: Boolean(parseInt(record['PWF'])),
        osf: Boolean(parseInt(record['OSF'])),
        rnf: Boolean(parseInt(record['RNF'])),
        machineStatus: !Boolean(parseInt(record['Machine failure'])),
        predictionStatus: 'pending',
      };

      await db.insert(machineData).values(newMachineData);

      await new Promise((resolve) => setTimeout(resolve, INTERVAL_MS));
    }

    console.log('Machine data seeded successfully');
  } catch (error) {
    console.error('Error seeding machine data:', error);
    process.exit(1);
  }

  process.exit(0);
}

seedMachineData();
