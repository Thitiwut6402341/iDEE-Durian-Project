import { Injectable } from '@nestjs/common';

@Injectable()
export class GpsTrackingService {
  async getCurrentTracking() {

    return {
      status: 'success',
      message: 'Current tracking',
      data: [
        {
          container_no: '2406052101',
          chargestatus: -1,
          odometer: 41733,
          latitude: 12.884552,
          servertime: 1718163412,
          accstatus: -1,
          datastatus: 4,
          battery: 1,
          speed: 0,
          hearttime: 1717758380,
          doorstatus: -1,
          imei: '358069580104464',
          course: 218,
          acctime: 1718163412,
          gpstime: 1717138770,
          systemtime: 1717138692,
          defencestatus: 0,
          longitude: 101.093714,
          oilpowerstatus: -1,
          mileage: 41733,
          created_at: new Date(),
          updated_at: new Date(),
          arrived_at: null,
        },
        {
          container_no: '2406052102',
          chargestatus: -1,
          odometer: 41733,
          latitude: 12.884552,
          servertime: 1718163412,
          accstatus: -1,
          datastatus: 4,
          battery: 1,
          speed: 0,
          hearttime: 1717758380,
          doorstatus: -1,
          imei: '358069580104465',
          course: 218,
          acctime: 1718163412,
          gpstime: 1717138770,
          systemtime: 1717138692,
          defencestatus: 0,
          longitude: 101.093814,
          oilpowerstatus: -1,
          mileage: 41733,
          created_at: new Date(),
          updated_at: new Date(),
          arrived_at: null,
        },
      ],
    };
  }

  async getCurrentContainerStatus() {
    return {
      status: 'success',
      message: 'Current transportation',
      data: [
        {
          container_no: '2406052101',
          export_date: '2024-06-12',
          gps_no: '358069580104464',
          status: [
            {
              location: 1,
              description: 'หนองคาย',
              is_arrived: false,
            },
            {
              location: 2,
              description: 'Container Yard (CY)',
              is_arrived: false,
            },
            {
              location: 3,
              description: 'สถานีรถไฟเวียงจันทร์ใต้ (ลาว)',
              is_arrived: false,
            },
            {
              location: 4,
              description: 'สถานีรถไฟบ่อเต็น (ลาว)',
              is_arrived: false,
            },
            {
              location: 5,
              description: 'สถานีรถไฟไม่ฮาน (จีน)',
              is_arrived: false,
            },
            {
              location: 6,
              description: 'คุนหมิง (จีน)',
              is_arrived: false,
            },
          ],
          exporter: 'Demeter Corporation Co., Ltd.',
          exporter_id: '1',
          //! packing house
          doa_no: '1234',
          doa_doc: 'https://sncservices.sncformer.com/data/test003.png', // image or pdf
          total_weight: 1000,
          cultivar: 'Monthong',
          temperature: 15,
          humidity: 20,
          origin: {
            name: 'Nong Khai',
            latitude: 17.878423,
            longitude: 102.741461,
          },
          destination: {
            name: 'Kunming',
            latitude: 25.038889,
            longitude: 102.718333,
          },
          current_location: {
            name: '',
            latitude: 20.0,
            longitude: 100.0,
          },
        },
        {
          container_no: '2406052102',
          export_date: '2024-06-12',
          gps_no: '358069580104465',
          status: [
            {
              location: 1,
              description: 'หนองคาย',
              is_arrived: false,
            },
            {
              location: 2,
              description: 'Container Yard (CY)',
              is_arrived: false,
            },
            {
              location: 3,
              description: 'สถานีรถไฟเวียงจันทร์ใต้ (ลาว)',
              is_arrived: false,
            },
            {
              location: 4,
              description: 'สถานีรถไฟบ่อเต็น (ลาว)',
              is_arrived: false,
            },
            {
              location: 5,
              description: 'สถานีรถไฟไม่ฮาน (จีน)',
              is_arrived: false,
            },
            {
              location: 6,
              description: 'คุนหมิง (จีน)',
              is_arrived: false,
            },
          ],
          exporter: 'Demeter Corporation Co., Ltd.',
          exporter_id: '1',
          //! packing house
          doa_no: '1234',
          doa_doc: 'https://sncservices.sncformer.com/data/test003.png', // image or pdf
          total_weight: 1000,
          cultivar: 'Monthong',
          temperature: 15,
          humidity: 20,
          origin: {
            name: 'Nong Khai',
            latitude: 17.878423,
            longitude: 102.741461,
          },
          destination: {
            name: 'Kunming',
            latitude: 25.038889,
            longitude: 102.718333,
          },
          current_location: {
            name: '',
            latitude: 20.0,
            longitude: 100.0,
          },
        },
      ],
    };
  }

  async getTrackingHistory() {
    return {
      status: 'success',
      message: 'Tracking history',
      data: [
        {
          lot_id: '1',
          gps_no: '358069580104464',
          container_no: '1',
          started_at: new Date('2024-06-12T02:00:00Z'),
          arrived_at: new Date('2024-06-15T02:00:00Z'),
        },
      ],
    };
  }
}
