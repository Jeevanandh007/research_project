import axios from 'axios';
import { parse } from 'csv-parse';
import fs from 'fs';
import path from 'path';
import moment from 'moment';
import { get, keys } from 'lodash';

const INTERVAL_MS = 10000; // 10 seconds interval between inserts
const API_URL = process.env.API_URL || 'http://localhost:3000';

async function seedMachineData() {
  try {
    const csvPath = path.join(__dirname, '../dataset_with_timestamps.csv');
    console.log(csvPath);
    const fileContent = fs.readFileSync(csvPath, 'utf-8');

    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
    });

    for await (const record of records) {
      console.log('Inserting', record);
      const timestamp = moment(get(record, keys(record)[0]), 'DD-MM-YY HH:mm');
      // const timestamp = moment();

      const machineData = {
        timestamp: timestamp.toISOString(),
        productId: record['Product ID'],
        type: parseInt(record['Type']),
        airTemperature: parseFloat(record['Air temperature [K]']),
        processTemperature: parseFloat(record['Process temperature [K]']),
        rotationalSpeed: parseInt(record['Rotational speed [rpm]']),
        torque: parseFloat(record['Torque [Nm]']),
        toolWear: parseInt(record['Tool wear [min]']),
        twf: parseInt(record['TWF']),
        hdf: parseInt(record['HDF']),
        pwf: parseInt(record['PWF']),
        osf: parseInt(record['OSF']),
        rnf: parseInt(record['RNF']),
      };

      try {
        await axios.post(`${API_URL}/api/machine-data`, machineData, {
          headers: {
            'Content-Type': 'application/json',
            // Add auth token if required
            // 'Authorization': `Bearer ${process.env.API_TOKEN}`
          },
        });
        console.log('Successfully inserted record');
      } catch (error) {
        console.error(
          'Failed to insert record:',
          error.response?.data || error.message
        );
      }

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
