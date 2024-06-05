import { Injectable } from '@nestjs/common';
import { DurianRegistration } from 'src/schema/durian-registration.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { FruitStatusDto } from './dto/fruit-status.dto';
import { HardwareDataCollection } from 'src/schema/hardware-data.schema';
import { ChemicalProcess1 } from 'src/schema/packing-schemas/chemical-process1.schema';
import { ChemicalProcess2 } from 'src/schema/packing-schemas/chemical-process2.schema';
import { ChemicalProcess3 } from 'src/schema/packing-schemas/chemical-process3.schema';
import { Packing } from 'src/schema/packing.schema';
import { Transportation } from 'src/schema/transportation.schema';
import { Departure } from 'src/schema/departure.schema';
import { Arrived } from 'src/schema/arrived';
import { FruitStatusByCodeDto } from './dto/fruit-status-by-code.dto';
import { NgCases } from 'src/schema/ng-cases.schema';
import { Weightings } from 'src/schema/weightings.schema';
import { FreezerProcess } from 'src/schema/packing-schemas/freezer-process.schema';
import { inspect } from 'util';

@Injectable()
export class FruitStatusService {
  constructor(
    @InjectModel(DurianRegistration.name) private durianRegisterModel: Model<DurianRegistration>,
    @InjectModel(HardwareDataCollection.name) private hardwareDataCollectionModel: Model<HardwareDataCollection>,
    @InjectModel(ChemicalProcess1.name) private chemicalProcess1Model: Model<ChemicalProcess1>,
    @InjectModel(ChemicalProcess2.name) private chemicalProcess2Model: Model<ChemicalProcess2>,
    @InjectModel(ChemicalProcess3.name) private chemicalProcess3Model: Model<ChemicalProcess3>,
    @InjectModel(Weightings.name) private weightingsModel: Model<Weightings>,
    @InjectModel(Packing.name) private packingProcessModel: Model<Packing>,
    @InjectModel(FreezerProcess.name) private freezerProcessModel: Model<FreezerProcess>,
    @InjectModel(Transportation.name) private transportationModel: Model<Transportation>,
    @InjectModel(Departure.name) private departureModel: Model<Departure>,
    @InjectModel(Arrived.name) private arrivedProcessModel: Model<Arrived>,
    @InjectModel(NgCases.name) private ngCasesModel: Model<NgCases>,
  ) { }

  // [POST] all status
  async FruitStatus(validator: FruitStatusDto): Promise<any> {
    try {
      let pipeline = []
      let pipelineHardware = []
      let from: any
      let to: any

      // select period
      if (validator.period.toLowerCase() === 'daily') {
        from = new Date(validator.from)
        to = new Date(validator.from)
        to.setDate(to.getDate() + 1)
      } else if (validator.period.toLowerCase() === 'monthly') {
        from = new Date(validator.from + "-01")
        const toDate = new Date(validator.from + "-01")
        to = new Date(toDate.getFullYear(), toDate.getMonth() + 1, 2)
      } else if (validator.period.toLowerCase() === 'period') {
        from = new Date(validator.from)
        to = new Date(validator.to)
        to.setDate(to.getDate() + 1)
      }

      // query all data
      pipeline = [
        {
          '$match': {
            'registered_at': {
              '$gte': from,
              '$lte': to
            }
          }
        },
        {
          '$lookup': {
            'from': 'OrchardRegisteration',
            'localField': 'orchard_code',
            'foreignField': 'orchard_code',
            'as': 'OrchardRegisteration'
          }
        }, {
          '$replaceRoot': {
            'newRoot': {
              '$mergeObjects': [
                {
                  '$arrayElemAt': [
                    '$OrchardRegisteration', 0
                  ]
                }, '$$ROOT'
              ]
            }
          }
        }, {
          '$lookup': {
            'from': 'PackingHouseRegisteration',
            'localField': 'packing_house_code',
            'foreignField': 'packing_house_code',
            'as': 'PackingHouseRegisteration'
          }
        }, {
          '$replaceRoot': {
            'newRoot': {
              '$mergeObjects': [
                {
                  '$arrayElemAt': [
                    '$PackingHouseRegisteration', 0
                  ]
                }, '$$ROOT'
              ]
            }
          }
        }, {
          '$lookup': {
            'from': 'TreesRegistration',
            'localField': 'tree_code',
            'foreignField': 'tree_code',
            'as': 'TreesRegistration'
          }
        }, {
          '$replaceRoot': {
            'newRoot': {
              '$mergeObjects': [
                {
                  '$arrayElemAt': [
                    '$TreesRegistration', 0
                  ]
                }, '$$ROOT'
              ]
            }
          }
        }, {
          '$lookup': {
            'from': 'ChemicalProcess1',
            'localField': 'rfid_code',
            'foreignField': 'rfid_code',
            'as': 'ChemicalProcess1'
          }
        }, {
          '$replaceRoot': {
            'newRoot': {
              '$mergeObjects': [
                {
                  '$arrayElemAt': [
                    '$ChemicalProcess1', 0
                  ]
                }, '$$ROOT'
              ]
            }
          }
        }, {
          '$lookup': {
            'from': 'ChemicalProcess2',
            'localField': 'rfid_code',
            'foreignField': 'rfid_code',
            'as': 'ChemicalProcess2'
          }
        }, {
          '$replaceRoot': {
            'newRoot': {
              '$mergeObjects': [
                {
                  '$arrayElemAt': [
                    '$ChemicalProcess2', 0
                  ]
                }, '$$ROOT'
              ]
            }
          }
        }, {
          '$lookup': {
            'from': 'ChemicalProcess3',
            'localField': 'rfid_code',
            'foreignField': 'rfid_code',
            'as': 'ChemicalProcess3'
          }
        }, {
          '$replaceRoot': {
            'newRoot': {
              '$mergeObjects': [
                {
                  '$arrayElemAt': [
                    '$ChemicalProcess3', 0
                  ]
                }, '$$ROOT'
              ]
            }
          }
        }, {
          '$lookup': {
            'from': 'WeightingsProcess',
            'localField': 'rfid_code',
            'foreignField': 'rfid_code',
            'as': 'WeightingsProcess'
          }
        }, {
          '$replaceRoot': {
            'newRoot': {
              '$mergeObjects': [
                {
                  '$arrayElemAt': [
                    '$WeightingsProcess', 0
                  ]
                }, '$$ROOT'
              ]
            }
          }
        }, {
          '$lookup': {
            'from': 'PackingProcess',
            'localField': 'rfid_code',
            'foreignField': 'rfid_code',
            'as': 'PackingProcess'
          }
        }, {
          '$replaceRoot': {
            'newRoot': {
              '$mergeObjects': [
                {
                  '$arrayElemAt': [
                    '$PackingProcess', 0
                  ]
                }, '$$ROOT'
              ]
            }
          }
        }, {
          '$lookup': {
            'from': 'FreezerProcess',
            'localField': 'rfid_code',
            'foreignField': 'rfid_code',
            'as': 'FreezerProcess'
          }
        }, {
          '$replaceRoot': {
            'newRoot': {
              '$mergeObjects': [
                {
                  '$arrayElemAt': [
                    '$FreezerProcess', 0
                  ]
                }, '$$ROOT'
              ]
            }
          }
        }, {
          '$lookup': {
            'from': 'Transportation',
            'localField': 'fruit_code',
            'foreignField': 'fruit_code',
            'as': 'Transportation'
          }
        }, {
          '$replaceRoot': {
            'newRoot': {
              '$mergeObjects': [
                {
                  '$arrayElemAt': [
                    '$Transportation', 0
                  ]
                }, '$$ROOT'
              ]
            }
          }
        }, {
          '$lookup': {
            'from': 'Departure',
            'localField': 'fruit_code',
            'foreignField': 'fruit_code',
            'as': 'Departure'
          }
        }, {
          '$replaceRoot': {
            'newRoot': {
              '$mergeObjects': [
                {
                  '$arrayElemAt': [
                    '$Departure', 0
                  ]
                }, '$$ROOT'
              ]
            }
          }
        }, {
          '$lookup': {
            'from': 'ArrivedProcess',
            'localField': 'fruit_code',
            'foreignField': 'fruit_code',
            'as': 'ArrivedProcess'
          }
        }, {
          '$replaceRoot': {
            'newRoot': {
              '$mergeObjects': [
                {
                  '$arrayElemAt': [
                    '$ArrivedProcess', 0
                  ]
                }, '$$ROOT'
              ]
            }
          }
        }, {
          '$lookup': {
            'from': 'ReserveTransportation',
            'localField': 'booking_ref',
            'foreignField': 'booking_ref',
            'as': 'ReserveTransportation'
          }
        }, {
          '$replaceRoot': {
            'newRoot': {
              '$mergeObjects': [
                {
                  '$arrayElemAt': [
                    '$ReserveTransportation', 0
                  ]
                }, '$$ROOT'
              ]
            }
          }
        }, {
          '$project': {
            '_id': 0,
            'fruit_code': 1,
            'rfid_code': 1,
            'harvest_timestamp': '$registered_at',
            'tree_code': '$tree_code',
            'cultivar': '$cultivar',
            'orchard_name': '$orchard_name',
            'packing_name': '$packing_house_name',
            'maturity': '$maturity',
            'segments': '$number_of_segments',
            'weight': 1,
            'inspected_grade': 1,
            'grade': '$export_grade',
            'qc_timestamp': '$updated_at',
            'remark_qc': '$remarks',
            'chemical1_timestamp': {
              '$arrayElemAt': [
                '$ChemicalProcess1.created_at', 0
              ]
            },
            'chemical2_timestamp': {
              '$arrayElemAt': [
                '$ChemicalProcess2.created_at', 0
              ]
            },
            'chemical3_timestamp': {
              '$arrayElemAt': [
                '$ChemicalProcess3.created_at', 0
              ]
            },
            'weighting_timestamp': {
              '$arrayElemAt': [
                '$WeightingsProcess.created_at', 0
              ]
            },
            'packing_timestamp': {
              '$arrayElemAt': [
                '$PackingProcess.created_at', 0
              ]
            },
            'freezer_timestamp': {
              '$arrayElemAt': [
                '$FreezerProcess.created_at', 0
              ]
            },
            'transport_timestamp': {
              '$arrayElemAt': [
                '$Transportation.created_at', 0
              ]
            },
            'packaging_type': 1,
            'delivery_name': { '$arrayElemAt': ['$ReserveTransportation.freight_forwarder', 0] },
            'booking_ref': 1,
            'depart_date_transport': { '$arrayElemAt': ['$ReserveTransportation.date_time', 0] },
            'departure_type': { '$arrayElemAt': ['$ReserveTransportation.export_type', 0] },
            'airline': { '$arrayElemAt': ['$ReserveTransportation.air_line', 0] },
            'flight': { '$arrayElemAt': ['$ReserveTransportation.flight', 0] },
            'flight_depart_date': { '$arrayElemAt': ['$ReserveTransportation.flight_depart_date', 0] },
            'flight_arrive_date': { '$arrayElemAt': ['$ReserveTransportation.flight_arrive_date', 0] },
            'arrival_timestamp': {
              '$arrayElemAt': [
                '$ArrivedProcess.created_at', 0
              ]
            },
          }
        }
      ]
      const result = await this.durianRegisterModel.aggregate(pipeline)

      // find fruit's current progress

      // all fruit that have been harvested
      const harvestData = []
      const progressHarverst = await this.durianRegisterModel.find({ inspected_grade: null }).exec()
      for (const i of progressHarverst) harvestData.push(i.rfid_code)

      // all fruits that have been qc
      const qcData = []
      const progressQc = await this.durianRegisterModel.find({ inspected_grade: { $ne: null } }).exec()
      for (const i of progressQc) qcData.push(i.rfid_code)

      // all fruits that have been chemical process 1
      const chemicalProcess1Data = []
      const chemicalProcess1 = await this.chemicalProcess1Model.find().exec()
      for (const i of chemicalProcess1) chemicalProcess1Data.push(i.rfid_code)

      // all fruits that have been chemical process 2
      const chemicalProcess2Data = []
      const chemicalProcess2 = await this.chemicalProcess2Model.find().exec()
      for (const i of chemicalProcess2) chemicalProcess2Data.push(i.rfid_code)

      // all fruits that have been chemical process 3
      const chemicalProcess3Data = []
      const chemicalProcess3 = await this.chemicalProcess3Model.find().exec()
      for (const i of chemicalProcess3) chemicalProcess3Data.push(i.rfid_code)

      // all fruits that have been weighting
      const weightingsData = []
      const progressWeightings = await this.weightingsModel.find().exec()
      for (const i of progressWeightings) weightingsData.push(i.rfid_code)

      // all fruits that have been packing
      const packingData = []
      const progressPacking = await this.packingProcessModel.find().exec()
      for (const i of progressPacking) packingData.push(i.rfid_code)

      // all fruits that have been freezer
      const freezerData = []
      const progressFreezer = await this.freezerProcessModel.find().exec()
      for (const i of progressFreezer) freezerData.push(i.rfid_code)

      // all fruit that have been transported
      const transportData = []
      const progressTransport = await this.transportationModel.find().exec()
      for (const i of progressTransport) {
        for (const f of i.rfid_code) transportData.push(f)
      }

      // all fruit that have been arrived
      const arrivalData = []
      const progressArrival = await this.arrivedProcessModel.find().select('-_id lot_id').exec()
      for (const i of progressArrival) {
        const fruit = await this.transportationModel.findOne({ lot_id: i.lot_id }).exec()
        for (const f of fruit.rfid_code) arrivalData.push(f)
      }

      // add data to show progress //

      // total progress
      const totalProgress = []

      // get hardware data
      let soilHumidity: any
      let soilTemp: any
      let soilConductivity: any
      let soilPh: any
      let soilNitrogen: any
      let soilPhosphorus: any
      let soilPotassium: any
      let soilSalinity: any
      let airHumidity: any
      let airTemp: any
      let airCo2: any
      let airPressure: any
      let rainFall: any

      const hwData = []
      for (let i = 0; i < result.length; i++) {
        // get sensor data
        pipelineHardware = [
          {
            '$match': {
              'created_at': {
                '$lte': result[i].harvest_timestamp
              }
            }
          }, {
            '$sort': {
              'created_at': -1
            }
          }, {
            '$limit': 1
          }, {
            '$project': {
              'soil_humidity': '$data.Soil_Moisture',
              'soil_temp': "$data.Soil_Temp",
              'soil_conductivity': "$data.Soil_Conductivity",
              'soil_ph': '$data.Soil_pH',
              'soil_nitrogen': '$data.Soil_Nitrogen',
              'soil_phosphorus': '$data.Soil_Phosphorus',
              'soil_potassium': '$data.Soil_Potassium',
              'soil_salinity': '$data.Soil_Salinity',
              'air_humidity': '$data.Air_Humidity',
              'air_temp': "$data.Air_Temperature",
              'air_co2': "$data.Air_CO2",
              'air_pressure': "$data.Air_Pressure",
              'rain_fall': '$data.Rain_Volumn',
            }
          }
        ]
        const hardwareData = await this.hardwareDataCollectionModel.aggregate(pipelineHardware)

        if (hardwareData.length === 0) {
          soilHumidity = null
          soilTemp = null
          soilConductivity = null
          soilPh = null
          soilNitrogen = null
          soilPhosphorus = null
          soilPotassium = null
          soilSalinity = null
          airHumidity = null
          airTemp = null
          airCo2 = null
          airPressure = null
          rainFall = null

        } else {
          soilHumidity = hardwareData[0].soil_humidity
          soilTemp = hardwareData[0].soil_temp
          soilConductivity = hardwareData[0].soil_conductivity
          soilPh = hardwareData[0].soil_ph
          soilNitrogen = hardwareData[0].soil_nitrogen
          soilPhosphorus = hardwareData[0].soil_phosphorus
          soilPotassium = hardwareData[0].soil_potassium
          soilSalinity = hardwareData[0].soil_salinity
          airHumidity = hardwareData[0].air_humidity
          airTemp = hardwareData[0].air_temp
          airCo2 = hardwareData[0].air_co2
          airPressure = hardwareData[0].air_pressure
          rainFall = hardwareData[0].rain_fall
        }

        hwData.push({
          fruit_code: result[i].fruit_code,
          soil_humidity: soilHumidity,
          soil_temp: soilTemp,
          soil_conductivity: soilConductivity,
          soil_ph: soilPh,
          soil_nitrogen: soilNitrogen,
          soil_phosphorus: soilPhosphorus,
          soil_potassium: soilPotassium,
          soil_salinity: soilSalinity,
          air_humidity: airHumidity,
          air_temp: airTemp,
          air_co2: airCo2,
          air_pressure: airPressure,
          rain_fall: rainFall
        })
      }

      // current harvest 
      const currentHarvestData = []
      const currentHarvest = harvestData.filter(item => !qcData.includes(item))
      for (let i = 0; i < result.length; i++) {
        if (currentHarvest.includes(result[i].rfid_code)) {
          const sensorData = hwData.find(entry => entry.fruit_code === result[i].fruit_code)
          currentHarvestData.push({
            fruit_code: result[i].fruit_code,
            timestamp: result[i].harvest_timestamp,
            tree_code: result[i].tree_code,
            cultivar: result[i].cultivar,
            orchard_name: result[i].orchard_name,
            maturity: result[i].maturity,
            segments: result[i].segments,

            soil_humidity: sensorData.soil_humidity,
            soil_temp: sensorData.soil_temp,
            soil_conductivity: sensorData.soil_conductivity,
            soil_ph: sensorData.soil_ph,
            soil_nitrogen: sensorData.soil_nitrogen,
            soil_phosphorus: sensorData.soil_phosphorus,
            soil_potassium: sensorData.soil_potassium,
            soil_salinity: sensorData.soil_salinity,
            air_humidity: sensorData.air_humidity,
            air_temp: sensorData.air_temp,
            air_co2: sensorData.air_co2,
            air_pressure: sensorData.air_pressure,
            rain_fall: sensorData.rain_fall,
          })

          totalProgress.push({
            fruit_code: result[i].fruit_code,
            timestamp: result[i].harvest_timestamp,
            registered_at: result[i].harvest_timestamp,
            tree_code: result[i].tree_code,
            cultivar: result[i].cultivar,
            orchard_name: result[i].orchard_name,
            packing_name: result[i].packing_name,
            maturity: result[i].maturity,
            inspected_grade: result[i].inspected_grade,
            export_grade: result[i].grade,
            status: 'Harvest',
            remark: null,

            soil_humidity: sensorData.soil_humidity,
            soil_temp: sensorData.soil_temp,
            soil_conductivity: sensorData.soil_conductivity,
            soil_ph: sensorData.soil_ph,
            soil_nitrogen: sensorData.soil_nitrogen,
            soil_phosphorus: sensorData.soil_phosphorus,
            soil_potassium: sensorData.soil_potassium,
            soil_salinity: sensorData.soil_salinity,
            air_humidity: sensorData.air_humidity,
            air_temp: sensorData.air_temp,
            air_co2: sensorData.air_co2,
            air_pressure: sensorData.air_pressure,
            rain_fall: sensorData.rain_fall,
          })
        }
      }

      // current QC
      const currentQcData = []
      const currentQc = qcData.filter(item => !chemicalProcess1Data.includes(item))
      for (let i = 0; i < result.length; i++) {
        if (currentQc.includes(result[i].rfid_code)) {
          const sensorData = hwData.find(entry => entry.fruit_code === result[i].fruit_code)
          currentQcData.push({
            fruit_code: result[i].fruit_code,
            timestamp: result[i].qc_timestamp,
            tree_code: result[i].tree_code,
            cultivar: result[i].cultivar,
            orchard_name: result[i].orchard_name,
            packing_name: result[i].packing_name,
            inspected_grade: result[i].inspected_grade,
            remark: result[i].remarks,
          })

          totalProgress.push({
            fruit_code: result[i].fruit_code,
            timestamp: result[i].qc_timestamp,
            registered_at: result[i].harvest_timestamp,
            tree_code: result[i].tree_code,
            cultivar: result[i].cultivar,
            orchard_name: result[i].orchard_name,
            packing_name: result[i].packing_name,
            maturity: result[i].maturity,
            inspected_grade: result[i].inspected_grade,
            export_grade: result[i].grade,
            status: 'QC',
            remark: result[i].remarks,

            soil_humidity: sensorData.soil_humidity,
            soil_temp: sensorData.soil_temp,
            soil_conductivity: sensorData.soil_conductivity,
            soil_ph: sensorData.soil_ph,
            soil_nitrogen: sensorData.soil_nitrogen,
            soil_phosphorus: sensorData.soil_phosphorus,
            soil_potassium: sensorData.soil_potassium,
            soil_salinity: sensorData.soil_salinity,
            air_humidity: sensorData.air_humidity,
            air_temp: sensorData.air_temp,
            air_co2: sensorData.air_co2,
            air_pressure: sensorData.air_pressure,
            rain_fall: sensorData.rain_fall,
          })
        }
      }


      // current chenical process 1
      const currentChemicalProcess1Data = []
      const currentChemicalProcess1 = chemicalProcess1Data.filter(item => !chemicalProcess2Data.includes(item))
      for (let i = 0; i < result.length; i++) {
        if (currentChemicalProcess1.includes(result[i].rfid_code)) {
          const sensorData = hwData.find(entry => entry.fruit_code === result[i].fruit_code)
          currentChemicalProcess1Data.push({
            fruit_code: result[i].fruit_code,
            timestamp: result[i].chemical1_timestamp,
            tree_code: result[i].tree_code,
            cultivar: result[i].cultivar,
            orchard_name: result[i].orchard_name,
            packing_name: result[i].packing_name,
            inspected_grade: result[i].inspected_grade,

            // dummy data
            chemical_formular1: "formula A", // need to get from database
          })

          totalProgress.push({
            fruit_code: result[i].fruit_code,
            timestamp: result[i].chemical1_timestamp,
            registered_at: result[i].harvest_timestamp,
            tree_code: result[i].tree_code,
            cultivar: result[i].cultivar,
            orchard_name: result[i].orchard_name,
            packing_name: result[i].packing_name,
            maturity: result[i].maturity,
            inspected_grade: result[i].inspected_grade,
            export_grade: result[i].grade,
            status: 'Chemical Process 1',
            remark: null,

            soil_humidity: sensorData.soil_humidity,
            soil_temp: sensorData.soil_temp,
            soil_conductivity: sensorData.soil_conductivity,
            soil_ph: sensorData.soil_ph,
            soil_nitrogen: sensorData.soil_nitrogen,
            soil_phosphorus: sensorData.soil_phosphorus,
            soil_potassium: sensorData.soil_potassium,
            soil_salinity: sensorData.soil_salinity,
            air_humidity: sensorData.air_humidity,
            air_temp: sensorData.air_temp,
            air_co2: sensorData.air_co2,
            air_pressure: sensorData.air_pressure,
            rain_fall: sensorData.rain_fall,
          })
        }
      }

      // current chenical process 2
      const currentChemicalProcess2Data = []
      const currentChemicalProcess2 = chemicalProcess2Data.filter(item => !chemicalProcess3Data.includes(item))
      for (let i = 0; i < result.length; i++) {
        if (currentChemicalProcess2.includes(result[i].rfid_code)) {
          const sensorData = hwData.find(entry => entry.fruit_code === result[i].fruit_code)
          currentChemicalProcess2Data.push({
            fruit_code: result[i].fruit_code,
            timestamp: result[i].chemical2_timestamp,
            tree_code: result[i].tree_code,
            cultivar: result[i].cultivar,
            orchard_name: result[i].orchard_name,
            packing_name: result[i].packing_name,
            inspected_grade: result[i].inspected_grade,
            maturity: result[i].maturity,
            segments: result[i].segments,

            // dummy data
            chemical_formular2: "formula B", // need to get from database
          })

          totalProgress.push({
            fruit_code: result[i].fruit_code,
            timestamp: result[i].chemical2_timestamp,
            registered_at: result[i].harvest_timestamp,
            tree_code: result[i].tree_code,
            cultivar: result[i].cultivar,
            orchard_name: result[i].orchard_name,
            packing_name: result[i].packing_name,
            maturity: result[i].maturity,
            inspected_grade: result[i].inspected_grade,
            export_grade: result[i].grade,
            status: 'Chemical Process 2',
            remark: null,

            soil_humidity: sensorData.soil_humidity,
            soil_temp: sensorData.soil_temp,
            soil_conductivity: sensorData.soil_conductivity,
            soil_ph: sensorData.soil_ph,
            soil_nitrogen: sensorData.soil_nitrogen,
            soil_phosphorus: sensorData.soil_phosphorus,
            soil_potassium: sensorData.soil_potassium,
            soil_salinity: sensorData.soil_salinity,
            air_humidity: sensorData.air_humidity,
            air_temp: sensorData.air_temp,
            air_co2: sensorData.air_co2,
            air_pressure: sensorData.air_pressure,
            rain_fall: sensorData.rain_fall,
          })
        }
      }

      // current chenical process 3
      const currentChemicalProcess3Data = []
      const currentChemicalProcess3 = chemicalProcess3Data.filter(item => !weightingsData.includes(item))
      for (let i = 0; i < result.length; i++) {
        if (currentChemicalProcess3.includes(result[i].rfid_code)) {
          const sensorData = hwData.find(entry => entry.fruit_code === result[i].fruit_code)
          currentChemicalProcess3Data.push({
            fruit_code: result[i].fruit_code,
            timestamp: result[i].chemical3_timestamp,
            tree_code: result[i].tree_code,
            cultivar: result[i].cultivar,
            orchard_name: result[i].orchard_name,
            packing_name: result[i].packing_name,
            inspected_grade: result[i].inspected_grade,
            matutity: result[i].maturity,
            segments: result[i].segments,

            // dummy data
            chemical_formular3: "formula C", // need to get from database
          })

          totalProgress.push({
            fruit_code: result[i].fruit_code,
            timestamp: result[i].chemical3_timestamp,
            registered_at: result[i].harvest_timestamp,
            tree_code: result[i].tree_code,
            cultivar: result[i].cultivar,
            orchard_name: result[i].orchard_name,
            packing_name: result[i].packing_name,
            maturity: result[i].maturity,
            inspected_grade: result[i].inspected_grade,
            export_grade: result[i].grade,
            status: 'Chemical Process 3',
            remark: null,

            soil_humidity: sensorData.soil_humidity,
            soil_temp: sensorData.soil_temp,
            soil_conductivity: sensorData.soil_conductivity,
            soil_ph: sensorData.soil_ph,
            soil_nitrogen: sensorData.soil_nitrogen,
            soil_phosphorus: sensorData.soil_phosphorus,
            soil_potassium: sensorData.soil_potassium,
            soil_salinity: sensorData.soil_salinity,
            air_humidity: sensorData.air_humidity,
            air_temp: sensorData.air_temp,
            air_co2: sensorData.air_co2,
            air_pressure: sensorData.air_pressure,
            rain_fall: sensorData.rain_fall,
          })
        }
      }

      // current weighting
      const currentWeightingData = []
      const currentWeighting = weightingsData.filter(item => !packingData.includes(item))
      for (let i = 0; i < result.length; i++) {
        if (currentWeighting.includes(result[i].rfid_code)) {
          const sensorData = hwData.find(entry => entry.fruit_code === result[i].fruit_code)
          currentWeightingData.push({
            fruit_code: result[i].fruit_code,
            timestamp: result[i].weighting_timestamp,
            tree_code: result[i].tree_code,
            cultivar: result[i].cultivar,
            orchard_name: result[i].orchard_name,
            packing_name: result[i].packing_name,
            inspected_grade: result[i].inspected_grade,
            maturity: result[i].maturity,
            segments: result[i].segments,
            weight: result[i].weight,
          })

          totalProgress.push({
            fruit_code: result[i].fruit_code,
            timestamp: result[i].chemical3_timestamp,
            registered_at: result[i].harvest_timestamp,
            tree_code: result[i].tree_code,
            cultivar: result[i].cultivar,
            orchard_name: result[i].orchard_name,
            packing_name: result[i].packing_name,
            maturity: result[i].maturity,
            inspected_grade: result[i].inspected_grade,
            export_grade: result[i].grade,
            status: 'Chemical Process 3',
            remark: null,

            soil_humidity: sensorData.soil_humidity,
            soil_temp: sensorData.soil_temp,
            soil_conductivity: sensorData.soil_conductivity,
            soil_ph: sensorData.soil_ph,
            soil_nitrogen: sensorData.soil_nitrogen,
            soil_phosphorus: sensorData.soil_phosphorus,
            soil_potassium: sensorData.soil_potassium,
            soil_salinity: sensorData.soil_salinity,
            air_humidity: sensorData.air_humidity,
            air_temp: sensorData.air_temp,
            air_co2: sensorData.air_co2,
            air_pressure: sensorData.air_pressure,
            rain_fall: sensorData.rain_fall,
          })
        }
      }


      // current packing
      const currentPackingData = []
      const currentPacking = packingData.filter(item => !freezerData.includes(item))
      for (let i = 0; i < result.length; i++) {
        if (currentPacking.includes(result[i].rfid_code)) {
          const sensorData = hwData.find(entry => entry.fruit_code === result[i].fruit_code)
          currentPackingData.push({
            fruit_code: result[i].fruit_code,
            timestamp: result[i].packing_timestamp,
            tree_code: result[i].tree_code,
            cultivar: result[i].cultivar,
            orchard_name: result[i].orchard_name,
            packing_name: result[i].packing_name,
            inspected_grade: result[i].inspected_grade,
            export_grade: result[i].grade,
            maturity: result[i].maturity,
            segment: result[i].segments,
            weight: result[i].weight,
            packaging_type: result[i].packaging_type,
          })

          totalProgress.push({
            fruit_code: result[i].fruit_code,
            timestamp: result[i].packing_timestamp,
            registered_at: result[i].harvest_timestamp,
            tree_code: result[i].tree_code,
            cultivar: result[i].cultivar,
            orchard_name: result[i].orchard_name,
            packing_name: result[i].packing_name,
            maturity: result[i].maturity,
            inspected_grade: result[i].inspected_grade,
            export_grade: result[i].grade,
            status: 'Packing',
            remark: null,

            soil_humidity: sensorData.soil_humidity,
            soil_temp: sensorData.soil_temp,
            soil_conductivity: sensorData.soil_conductivity,
            soil_ph: sensorData.soil_ph,
            soil_nitrogen: sensorData.soil_nitrogen,
            soil_phosphorus: sensorData.soil_phosphorus,
            soil_potassium: sensorData.soil_potassium,
            soil_salinity: sensorData.soil_salinity,
            air_humidity: sensorData.air_humidity,
            air_temp: sensorData.air_temp,
            air_co2: sensorData.air_co2,
            air_pressure: sensorData.air_pressure,
            rain_fall: sensorData.rain_fall,
          })
        }
      }

      // current freezer
      const currentFreezerData = []
      const currentFreezer = freezerData.filter(item => !transportData.includes(item))
      for (let i = 0; i < result.length; i++) {
        if (currentFreezer.includes(result[i].rfid_code)) {
          const sensorData = hwData.find(entry => entry.fruit_code === result[i].fruit_code)
          currentFreezerData.push({
            fruit_code: result[i].fruit_code,
            timestamp: result[i].packing_timestamp,
            tree_code: result[i].tree_code,
            cultivar: result[i].cultivar,
            orchard_name: result[i].orchard_name,
            packing_name: result[i].packing_name,
            inspected_grade: result[i].inspected_grade,
            export_grade: result[i].grade,
            maturity: result[i].maturity,
            segment: result[i].segments,
            weight: result[i].weight,
          })

          totalProgress.push({
            fruit_code: result[i].fruit_code,
            timestamp: result[i].packing_timestamp,
            registered_at: result[i].harvest_timestamp,
            tree_code: result[i].tree_code,
            cultivar: result[i].cultivar,
            orchard_name: result[i].orchard_name,
            packing_name: result[i].packing_name,
            maturity: result[i].maturity,
            inspected_grade: result[i].inspected_grade,
            export_grade: result[i].grade,
            status: 'Freeze',
            remark: null,

            soil_humidity: sensorData.soil_humidity,
            soil_temp: sensorData.soil_temp,
            soil_conductivity: sensorData.soil_conductivity,
            soil_ph: sensorData.soil_ph,
            soil_nitrogen: sensorData.soil_nitrogen,
            soil_phosphorus: sensorData.soil_phosphorus,
            soil_potassium: sensorData.soil_potassium,
            soil_salinity: sensorData.soil_salinity,
            air_humidity: sensorData.air_humidity,
            air_temp: sensorData.air_temp,
            air_co2: sensorData.air_co2,
            air_pressure: sensorData.air_pressure,
            rain_fall: sensorData.rain_fall,
          })
        }
      }

      // current transport
      const currentTransportData = []
      const currentTransport = transportData.filter(item => !arrivalData.includes(item))

      for (let i = 0; i < result.length; i++) {
        if (currentTransport.includes(result[i].rfid_code)) {
          const sensorData = hwData.find(entry => entry.fruit_code === result[i].fruit_code)
          currentTransportData.push({
            fruit_code: result[i].fruit_code,
            timestamp: result[i].transport_timestamp,
            tree_code: result[i].tree_code,
            cultivar: result[i].cultivar,
            orchard_name: result[i].orchard_name,
            packing_name: result[i].packing_name,
            transport_name: result[i].delivery_name,
            depart_date: result[i].depart_date_transport,
            container_no: "-", // if have container no, just add it
            departure_type: result[i].departure_type,
            airline: result[i].airline,
            flight: result[i].flight,
            flight_depart_date: result[i].flight_depart_date,
            flight_arrive_date: result[i].flight_arrive_date,
          })

          totalProgress.push({
            fruit_code: result[i].fruit_code,
            timestamp: result[i].transport_timestamp,
            registered_at: result[i].harvest_timestamp,
            tree_code: result[i].tree_code,
            cultivar: result[i].cultivar,
            orchard_name: result[i].orchard_name,
            packing_name: result[i].packing_name,
            maturity: result[i].maturity,
            inspected_grade: result[i].inspected_grade,
            export_grade: result[i].grade,
            status: 'Transportation',
            remark: null,

            soil_humidity: sensorData.soil_humidity,
            soil_temp: sensorData.soil_temp,
            soil_conductivity: sensorData.soil_conductivity,
            soil_ph: sensorData.soil_ph,
            soil_nitrogen: sensorData.soil_nitrogen,
            soil_phosphorus: sensorData.soil_phosphorus,
            soil_potassium: sensorData.soil_potassium,
            soil_salinity: sensorData.soil_salinity,
            air_humidity: sensorData.air_humidity,
            air_temp: sensorData.air_temp,
            air_co2: sensorData.air_co2,
            air_pressure: sensorData.air_pressure,
            rain_fall: sensorData.rain_fall,
          })
        }
      }


      // current departure
      const depart_date_Air = new Date("2024-04-19 10:45")
      const arrive_date_Air = new Date("2024-04-19 14:00")
      const differenceInMs_Air: number = arrive_date_Air.getTime() - depart_date_Air.getTime();
      const differenceInHours_Air: number = differenceInMs_Air / (1000 * 60 * 60);





      // current arrival
      const currentArrivalData = []
      const currentArrival = arrivalData.filter(item => harvestData.includes(item))
      for (let i = 0; i < result.length; i++) {
        if (currentArrival.includes(result[i].rfid_code)) {
          const sensorData = hwData.find(entry => entry.fruit_code === result[i].fruit_code)
          currentArrivalData.push({
            fruit_code: result[i].fruit_code,
            timestamp: result[i].arrival_timestamp,
            tree_code: result[i].tree_code,
            cultivar: result[i].cultivar,
            orchard_name: result[i].orchard_name,
            packing_name: result[i].packing_name,
            inspected_grade: result[i].inspected_grade,
            export_grade: result[i].grade,

            // dummy data
            importer_name: "Herun Technology (Yunnan) Co., Ltd.", // need to get from database
          })

          totalProgress.push({
            fruit_code: result[i].fruit_code,
            timestamp: result[i].arrival_timestamp,
            registered_at: result[i].harvest_timestamp,
            tree_code: result[i].tree_code,
            cultivar: result[i].cultivar,
            orchard_name: result[i].orchard_name,
            packing_name: result[i].packing_name,
            maturity: result[i].maturity,
            inspected_grade: result[i].inspected_grade,
            export_grade: result[i].grade,
            status: 'Completed',
            remark: null,

            soil_humidity: sensorData.soil_humidity,
            soil_temp: sensorData.soil_temp,
            soil_conductivity: sensorData.soil_conductivity,
            soil_ph: sensorData.soil_ph,
            soil_nitrogen: sensorData.soil_nitrogen,
            soil_phosphorus: sensorData.soil_phosphorus,
            soil_potassium: sensorData.soil_potassium,
            soil_salinity: sensorData.soil_salinity,
            air_humidity: sensorData.air_humidity,
            air_temp: sensorData.air_temp,
            air_co2: sensorData.air_co2,
            air_pressure: sensorData.air_pressure,
            rain_fall: sensorData.rain_fall,
          })
        }
      }

      return {
        status: 'success',
        message: 'Total status',
        data: {
          total_count: totalProgress.length,
          harvest_count: currentHarvest.length,
          qc_count: currentQc.length,
          chemical1_count: currentChemicalProcess1.length,
          chemical2_count: currentChemicalProcess2.length,
          chemical3_count: currentChemicalProcess3.length,
          weighting_count: currentWeighting.length,
          packing_count: currentPacking.length,
          freezer_count: currentFreezer.length,
          transport_count: currentTransport.length,
          arrival_count: currentArrival.length,

          total: totalProgress,
          harvest: currentHarvestData,
          qc: currentQcData,
          chemical1: currentChemicalProcess1Data,
          chemical2: currentChemicalProcess2Data,
          chemical3: currentChemicalProcess3Data,
          weighting: currentWeightingData,
          packing: currentPackingData,
          freezer: currentFreezerData,
          transport: currentTransportData,
          arrival: currentArrivalData,
        }
      }

    } catch (error) {
      return {
        status: 'error',
        message: error.message,
      }
    }
  }

  // [POST] all status for specidic fruit
  async FruitStatusByCode(validator: FruitStatusByCodeDto): Promise<any> {
    try {
      // get rfid code from fruit code
      const rfid = await this.durianRegisterModel.findOne({ fruit_code: validator.fruit_code }).exec()

      const depart_date_Car = new Date("2024-04-19 00:30")
      const arrive_date_Car = new Date("2024-04-19 03:50")
      const differenceInMs_Car: number = arrive_date_Car.getTime() - depart_date_Car.getTime();
      const differenceInHours_Car: number = differenceInMs_Car / (1000 * 60 * 60);

      const depart_date_Air = new Date("2024-04-19 10:45")
      const arrive_date_Air = new Date("2024-04-19 14:00")
      const differenceInMs_Air: number = arrive_date_Air.getTime() - depart_date_Air.getTime();
      const differenceInHours_Air: number = differenceInMs_Air / (1000 * 60 * 60);

      // harvest
      const pipelineHarvest = [
        {
          '$match': {
            'fruit_code': validator.fruit_code
          }
        }, {
          '$lookup': {
            'from': 'OrchardRegisteration',
            'localField': 'orchard_code',
            'foreignField': 'orchard_code',
            'as': 'OrchardRegisteration'
          }
        }, {
          '$replaceRoot': {
            'newRoot': {
              '$mergeObjects': [
                {
                  '$arrayElemAt': [
                    '$OrchardRegisteration', 0
                  ]
                }, '$$ROOT'
              ]
            }
          }
        }, {
          '$lookup': {
            'from': 'TreesRegistration',
            'localField': 'tree_code',
            'foreignField': 'tree_code',
            'as': 'TreesRegistration'
          }
        }, {
          '$replaceRoot': {
            'newRoot': {
              '$mergeObjects': [
                {
                  '$arrayElemAt': [
                    '$TreesRegistration', 0
                  ]
                }, '$$ROOT'
              ]
            }
          }
        }, {
          '$project': {
            '_id': 0,
            'harvest': '$registered_at',
            'orchard_name': 1,
            'orchard_code': 1,
            'tree_code': 1,
            'cultivar': 1,
            'province': 1
          }
        }
      ]

      // QC
      const pipelineQc = [
        {
          '$match': {
            'fruit_code': validator.fruit_code,
            'inspected_grade': { $ne: null }
          }
        }, {
          '$lookup': {
            'from': 'Users',
            'localField': 'inspected_by',
            'foreignField': '_id',
            'as': 'Users'
          }
        }, {
          '$replaceRoot': {
            'newRoot': {
              '$mergeObjects': [
                {
                  '$arrayElemAt': [
                    '$Users', 0
                  ]
                }, '$$ROOT'
              ]
            }
          }
        }, {
          '$project': {
            '_id': 0,
            'quality_control': '$updated_at',
            'qc_name': '$name',
            'inspected_grade': 1,
            'remarks': 1
          }
        }
      ]

      // chemical 1
      const pipelineChemical1 = [
        {
          '$match': {
            'rfid_code': rfid.rfid_code
          }
        }, {
          '$lookup': {
            'from': 'PackingHouseRegisteration',
            'localField': 'packing_house_code',
            'foreignField': 'packing_house_code',
            'as': 'PackingHouseRegisteration'
          }
        }, {
          '$replaceRoot': {
            'newRoot': {
              '$mergeObjects': [
                {
                  '$arrayElemAt': [
                    '$PackingHouseRegisteration', 0
                  ]
                }, '$$ROOT'
              ]
            }
          }
        }, {
          '$lookup': {
            'from': 'Users',
            'localField': 'inspected_by',
            'foreignField': '_id',
            'as': 'Users'
          }
        }, {
          '$replaceRoot': {
            'newRoot': {
              '$mergeObjects': [
                {
                  '$arrayElemAt': [
                    '$Users', 0
                  ]
                }, '$$ROOT'
              ]
            }
          }
        }, {
          '$project': {
            '_id': 0,
            'chemical_process1': '$created_at',
            'ph_name': '$packing_house_name',
            'ph_code': '$packing_house_code',
            'hormone': "Formular A",
            'created_by': '$name'
          }
        }
      ]

      // chemical 2
      const pipelineChemical2 = [
        {
          '$match': {
            'rfid_code': rfid.rfid_code
          }
        }, {
          '$lookup': {
            'from': 'Users',
            'localField': 'creator_id',
            'foreignField': '_id',
            'as': 'Users'
          }
        }, {
          '$replaceRoot': {
            'newRoot': {
              '$mergeObjects': [
                {
                  '$arrayElemAt': [
                    '$Users', 0
                  ]
                }, '$$ROOT'
              ]
            }
          }
        }, {
          '$project': {
            '_id': 0,
            'chemical_process2': '$created_at',
            'hormone': "Formular B",
            'created_by': '$name'
          }
        }
      ]

      // chemical 3
      const pipelineChemical3 = [
        {
          '$match': {
            'rfid_code': rfid.rfid_code
          }
        }, {
          '$lookup': {
            'from': 'Users',
            'localField': 'creator_id',
            'foreignField': '_id',
            'as': 'Users'
          }
        }, {
          '$replaceRoot': {
            'newRoot': {
              '$mergeObjects': [
                {
                  '$arrayElemAt': [
                    '$Users', 0
                  ]
                }, '$$ROOT'
              ]
            }
          }
        }, {
          '$project': {
            '_id': 0,
            'chemical_process3': '$created_at',
            'hormone': "Formular C",
            'created_by': '$name'
          }
        }
      ]

      // weighting
      const pipelineWeighting = [
        {
          '$match': {
            'rfid_code': rfid.rfid_code
          }
        }, {
          '$lookup': {
            'from': 'Users',
            'localField': 'creator_id',
            'foreignField': '_id',
            'as': 'Users'
          }
        }, {
          '$replaceRoot': {
            'newRoot': {
              '$mergeObjects': [
                {
                  '$arrayElemAt': [
                    '$Users', 0
                  ]
                }, '$$ROOT'
              ]
            }
          }
        }, {
          '$project': {
            '_id': 0,
            'weighting': '$created_at',
            'weight': 1,
            'matutity': 1,
            'segments': '$number_of_segments',
            'created_by': '$name'
          }
        }
      ]

      // packing
      const pipelinePacking = [
        {
          '$match': {
            'rfid_code': rfid.rfid_code
          }
        }, {
          '$lookup': {
            'from': 'Users',
            'localField': 'creator_id',
            'foreignField': '_id',
            'as': 'Users'
          }
        }, {
          '$replaceRoot': {
            'newRoot': {
              '$mergeObjects': [
                {
                  '$arrayElemAt': [
                    '$Users', 0
                  ]
                }, '$$ROOT'
              ]
            }
          }
        }, {
          '$lookup': {
            'from': 'WeightingsProcess',
            'localField': 'rfid_code',
            'foreignField': 'rfid_code',
            'as': 'WeightingsProcess'
          }
        }, {
          '$replaceRoot': {
            'newRoot': {
              '$mergeObjects': [
                {
                  '$arrayElemAt': [
                    '$vwWeightingsProcess', 0
                  ]
                }, '$$ROOT'
              ]
            }
          }
        }, {
          '$project': {
            '_id': 0,
            'packing': '$created_at',
            'packaging_type': 1,
            'export_grade': 1,
            'created_by': '$name'
          }
        }
      ]

      // freezer
      const pipelineFreezer = [
        {
          '$match': {
            'rfid_code': rfid.rfid_code
          }
        }, {
          '$project': {
            '_id': 0,
            'freezer': '$created_at',
          }
        }
      ]

      // transportation
      const pipelineTransPortation = [
        {
          '$match': {
            'lot_id': rfid.lot_id
          }
        }, {
          '$lookup': {
            'from': 'ReserveTransportation',
            'localField': 'booking_ref',
            'foreignField': 'booking_ref',
            'as': 'ReserveTransportation'
          }
        }, {
          '$replaceRoot': {
            'newRoot': {
              '$mergeObjects': [
                {
                  '$arrayElemAt': [
                    '$ReserveTransportation', 0
                  ]
                }, '$$ROOT'
              ]
            }
          }
        }, {
          '$project': {
            '_id': 0,
            'transportation': '$created_at',
            'delivery_name': { '$arrayElemAt': ['$ReserveTransportation.freight_forwarder', 0] },
            'container_no': "-",
            'depart_date': { '$arrayElemAt': ['$ReserveTransportation.date_time', 0] },
            'departure_type': { '$arrayElemAt': ['$ReserveTransportation.export_type', 0] },
            'airline': { '$arrayElemAt': ['$ReserveTransportation.air_line', 0] },
            'flight': 1,
            'flight_depart_date': 1,
            'flight_arrive_date': 1
          }
        }
      ]

      // arrival
      const pipelineArrival = [
        {
          '$match': {
            'lot_id': rfid.lot_id
          }
        }, {
          '$lookup': {
            'from': 'Transportation',
            'localField': 'lot_id',
            'foreignField': 'lot_id',
            'as': 'Transportation'
          }
        },
        {
          '$replaceRoot': {
            'newRoot': {
              '$mergeObjects': [
                {
                  '$arrayElemAt': [
                    '$Transportation', 0
                  ]
                }, '$$ROOT'
              ]
            }

          }
        }, {
          '$project': {
            '_id': 0,
            'arrived_to_chaina': '$created_at',
            'arrive_date': '$created_at',
            'importer': 'Herun Technology (Yunnan) Co., Ltd.',
          }
        }
      ]


      const harvest = await this.durianRegisterModel.aggregate(pipelineHarvest)
      const qc = await this.durianRegisterModel.aggregate(pipelineQc)
      const qcData = (qc.length === 0) ? [] : qc[0]
      const chemical1 = await this.chemicalProcess1Model.aggregate(pipelineChemical1)
      const chemical1Data = (chemical1.length === 0) ? [] : chemical1[0]
      const chemical2 = await this.chemicalProcess2Model.aggregate(pipelineChemical2)
      const chemical2Data = (chemical2.length === 0) ? [] : chemical2[0]
      const chemical3 = await this.chemicalProcess3Model.aggregate(pipelineChemical3)
      const chemical3Data = (chemical3.length === 0) ? [] : chemical3[0]
      const weightings = await this.weightingsModel.aggregate(pipelineWeighting)
      const weightingsData = (weightings.length === 0) ? [] : weightings[0]
      const packing = await this.packingProcessModel.aggregate(pipelinePacking)
      const packingData = (packing.length === 0) ? [] : packing[0]
      const freezer = await this.freezerProcessModel.aggregate(pipelineFreezer)
      const freezerData = (freezer.length === 0) ? [] : freezer[0]
      const transportation = await this.transportationModel.aggregate(pipelineTransPortation)
      const transportationData = (transportation.length === 0) ? [] : transportation[0]
      const arrived = await this.arrivedProcessModel.aggregate(pipelineArrival)
      const arrivedData = (arrived.length === 0) ? [] : arrived[0]

      // calculate progress
      const progress_no = (harvest.length === 0) ? 0 : (qc.length === 0) ? 1 : (chemical1.length === 0) ? 2 : (chemical2.length === 0) ? 3 : (chemical3.length === 0) ? 4 : (weightings.length === 0) ? 5 : (packing.length === 0) ? 6 : (freezer.length === 0) ? 7 : (transportation.length === 0) ? 8 : (arrived.length === 0) ? 9 : 10

      return {
        statuts: 'success',
        message: 'Flow',
        data: {
          progress_no: progress_no,
          harvest: harvest[0],
          qc: qcData,
          chemical1: chemical1Data,
          chemical2: chemical2Data,
          chemical3: chemical3Data,
          weighting: weightingsData,
          packing: packingData,
          freezer: freezerData,
          transportation: transportationData,
          arrived: arrivedData
        }
      }


    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        data: []
      }
    }
  }
}
