import { Model } from 'mongoose';
import { Injectable ,NotFoundException } from '@nestjs/common';
// import { CreateQrDto } from './dto/create-qr.dto';
// import { Qr, QrDocument, } from 'src/qr/schemas/qr.schema';
import { DurianRegister, DurainRegisterDocument } from './schema/durian-register.schema';
import { InjectModel } from '@nestjs/mongoose';
import { QrMokup, QrMokupDocument } from 'src/qr/schema/qrmokup.schema';

@Injectable()
export class QrService {
  constructor(
    @InjectModel(DurianRegister.name) private readonly durianRegisterModel : Model<DurainRegisterDocument>,
    @InjectModel(QrMokup.name) private readonly qrMokupModel : Model<QrMokupDocument>
  ) {}
  //TODO [GET] /qr/productqr
  async findAll(fruitcode: string): Promise<any> {
    try {
        const aggregationResult = await this.durianRegisterModel.aggregate([
            {
                '$match': {
                    'fruit_code': fruitcode
                }
            },
            {
                '$lookup': {
                    'from': 'TreesRegistration',
                    'localField': 'tree_code',
                    'foreignField': 'tree_code',
                    'as': 'TreesRegistration_result',
                    'pipeline': [
                        {
                            '$project': {
                                '_id': 0,
                                'cultivar': 1
                            }
                        }
                    ]
                }
            }, {
                '$replaceRoot': {
                    'newRoot': {
                        '$mergeObjects': [
                            {
                                '$arrayElemAt': [
                                    '$TreesRegistration_result', 0
                                ]
                            }, '$$ROOT'
                        ]
                    }
                }
            }, {
                '$lookup': {
                    'from': 'DepartmentofProvincialAdministration',
                    'localField': 'sub_district_id',
                    'foreignField': 'tree_code',
                    'as': 'DepartmentofProvincialAdministration_result',
                    'pipeline': [
                        {
                            '$project': {
                                '_id': 0,
                                'province_name_en': 1
                            }
                        }
                    ]
                }
            }, {
                '$replaceRoot': {
                    'newRoot': {
                        '$mergeObjects': [
                            {
                                '$arrayElemAt': [
                                    '$DepartmentofProvincialAdministration_result', 0
                                ]
                            }, '$$ROOT'
                        ]
                    }
                }
            }, {
                '$addFields': {
                    'registered_at': {
                        '$cond': {
                            'if': { '$eq': ['$is_passed', true] },
                            'then': { '$toDate': '$registered_at' },
                            'else': null
                        }
                    },
                    'duration_ripeness': {
                        '$cond': {
                            'if': { '$eq': ['$is_passed', true] },
                            'then': {
                                '$round': [
                                    {
                                        '$divide': [
                                            {
                                                '$subtract': [
                                                    new Date(),
                                                    '$registered_at'
                                                ]
                                            },
                                            1000 * 60 * 60 * 24
                                        ]
                                    },
                                    0
                                ]
                            },
                            'else': null
                        }
                    }
                }
            },
            {
                '$project': {
                    '_id': 0,
                    'fruit_code': 1,
                    'province_name_en': 1,
                    'cultivar': {$cond: [{$gt: ['$cultivar', null]}, '$cultivar', null]},
                    'is_passed': 1,
                    'registered_at': 1,
                    'duration_ripeness': 1,
                    'repiness': 1
                }
            }
        ]);

        if (aggregationResult.length === 0) {
            return {
                'status': 'error',
                'message': 'No entries found with the provided fruit code.',
                'data': []
            };
        }
        return {
            'status': 'success',
            'message': 'Get Product-qr successfully!',
            'data': aggregationResult
        };
    } catch (error) {
        return {
            status: 'error',
            message: error.message,
            data: [],
        };
    }
}
// //TODO [GET] /qr/fruitcode
async getfruitstatus(fruitcode: string): Promise<any> {
  try {
    const pipeline = [
      {
        '$match': {
          'fruit_code': fruitcode 
        }
      }, {
        '$lookup': {
          'from': 'vwQualityControlsProcess', 
          'localField': 'fruit_code', 
          'foreignField': 'fruit_code', 
          'as': 'vwQualityControlsProcess_result', 
          'pipeline': [
            {
              '$project': {
                '_id': 0, 
                'timestamp_quality': '$created_at', 
                'status_quality': '$is_passed'
              }
            }
          ]
        }
      }, {
        '$replaceRoot': {
          'newRoot': {
            '$mergeObjects': [
              {
                '$arrayElemAt': [
                  '$vwQualityControlsProcess_result', 0
                ]
              }, '$$ROOT'
            ]
          }
        }
      }, {
        '$lookup': {
          'from': 'vwPackingProcess', 
          'localField': 'fruit_code', 
          'foreignField': 'fruit_code', 
          'as': 'vwPackingProcess_result', 
          'pipeline': [
            {
              '$project': {
                '_id': 0, 
                'timestamp_packing': '$created_at'
              }
            }
          ]
        }
      }, {
        '$replaceRoot': {
          'newRoot': {
            '$mergeObjects': [
              {
                '$arrayElemAt': [
                  '$vwPackingProcess_result', 0
                ]
              }, '$$ROOT'
            ]
          }
        }
      }, {
        '$lookup': {
          'from': 'vwArrivedProcess', 
          'localField': 'fruit_code', 
          'foreignField': 'fruit_code', 
          'as': 'vwArrivedProcess_result', 
          'pipeline': [
            {
              '$project': {
                '_id': 0, 
                'timestamp_arrived': '$created_at'
              }
            }
          ]
        }
      }, {
        '$replaceRoot': {
          'newRoot': {
            '$mergeObjects': [
              {
                '$arrayElemAt': [
                  '$vwArrivedProcess_result', 0
                ]
              }, '$$ROOT'
            ]
          }
        }
      }, {
        '$lookup': {
          'from': 'vwDeparture', 
          'localField': 'fruit_code', 
          'foreignField': 'fruit_code', 
          'as': 'vwDeparture_result', 
          'pipeline': [
            {
              '$project': {
                '_id': 0, 
                'timestamp_departure': '$created_at'
              }
            }
          ]
        }
      }, {
        '$replaceRoot': {
          'newRoot': {
            '$mergeObjects': [
              {
                '$arrayElemAt': [
                  '$vwDeparture_result', 0
                ]
              }, '$$ROOT'
            ]
          }
        }
      }, {
        '$addFields': {
          'status_quality': {
            '$cond': {
              'if': {
                '$or': [
                  {
                    '$eq': [
                      '$timestamp_quality', null
                    ]
                  }, {
                    '$eq': [
                      {
                        '$size': '$vwQualityControlsProcess_result'
                      }, 0
                    ]
                  }
                ]
              }, 
              'then': null, 
              'else': true
            }
          }, 
          'timestamp_quality': {
            '$cond': {
              'if': {
                '$or': [
                  {
                    '$eq': [
                      '$status_quality', null
                    ]
                  }, {
                    '$eq': [
                      {
                        '$size': '$vwQualityControlsProcess_result'
                      }, 0
                    ]
                  }
                ]
              }, 
              'then': null, 
              'else': '$timestamp_quality'
            }
          }
        }
      }, {
        '$addFields': {
          'status_packing': {
            '$cond': {
              'if': {
                '$or': [
                  {
                    '$eq': [
                      '$timestamp_packing', null
                    ]
                  }, {
                    '$eq': [
                      {
                        '$size': '$vwPackingProcess_result'
                      }, 0
                    ]
                  }
                ]
              }, 
              'then': null, 
              'else': true
            }
          }, 
          'timestamp_packing': {
            '$cond': {
              'if': {
                '$or': [
                  {
                    '$eq': [
                      '$status_packing', null
                    ]
                  }, {
                    '$eq': [
                      {
                        '$size': '$vwPackingProcess_result'
                      }, 0
                    ]
                  }
                ]
              }, 
              'then': null, 
              'else': '$timestamp_packing'
            }
          }
        }
      }, {
        '$addFields': {
          'status_arrived': {
            '$cond': {
              'if': {
                '$or': [
                  {
                    '$eq': [
                      '$timestamp_arrived', null
                    ]
                  }, {
                    '$eq': [
                      {
                        '$size': '$vwArrivedProcess_result'
                      }, 0
                    ]
                  }
                ]
              }, 
              'then': null, 
              'else': true
            }
          }, 
          'timestamp_arrived': {
            '$cond': {
              'if': {
                '$or': [
                  {
                    '$eq': [
                      '$status_arrived', null
                    ]
                  }, {
                    '$eq': [
                      {
                        '$size': '$vwArrivedProcess_result'
                      }, 0
                    ]
                  }
                ]
              }, 
              'then': null, 
              'else': '$timestamp_arrived'
            }
          }
        }
      }, {
        '$addFields': {
          'status_departure': {
            '$cond': {
              'if': {
                '$or': [
                  {
                    '$eq': [
                      '$timestamp_departure', null
                    ]
                  }, {
                    '$eq': [
                      {
                        '$size': '$vwDeparture_result'
                      }, 0
                    ]
                  }
                ]
              }, 
              'then': null, 
              'else': true
            }
          }, 
          'timestamp_departure': {
            '$cond': {
              'if': {
                '$or': [
                  {
                    '$eq': [
                      '$status_departure', null
                    ]
                  }, {
                    '$eq': [
                      {
                        '$size': '$vwDeparture_result'
                      }, 0
                    ]
                  }
                ]
              }, 
              'then': null, 
              'else': '$timestamp_departure'
            }
          }
        }
      }, {
        '$addFields': {
          'best_before': {
            '$add': [
              '$registered_at', {
                '$multiply': [
                  10, 24, 60, 60, 1000
                ]
              }
            ]
          }
        }
      }, {
        '$project': {
          '_id': 0, 
          'status_picking': '$is_passed', 
          'timestamp_picking': '$registered_at', 
          'status_quality': 1, 
          'timestamp_quality': 1, 
          'status_packing': 1, 
          'timestamp_packing': 1, 
          'status_arrived': 1, 
          'timestamp_arrived': 1, 
          'status_departure': 1, 
          'timestamp_departure': 1, 
          'best_before': 1
        }
      }
    ];

    const data = await this.durianRegisterModel.aggregate(pipeline).exec();

    return {
      'status': 'success',
      'message': 'Get Fruit-code successfully!',
      'data': data.length > 0 ? data : null
    };
  } catch (error) {
    return {
      'status': 'error',
      'message': error.message,
      'data': null
    };
  }
}
// //TODO [GET] /qr/fruitcode
async getfruitlevel(fruitCode: string): Promise<any> {

  try {
    const currentDate: Date = new Date();
    const pipeline: any[] = [
      {
        '$match': {
          'fruit_code': fruitCode
        }
      },
      {
        '$project': {
          'registered_at': 1
        }
      }
    ];
    const data: any[] = await this.durianRegisterModel.aggregate(pipeline).exec();

    if (data.length === 0) {
      throw new Error('Fruit-code not found');
    }
 
    const registeredDate: Date = new Date(data[0].registered_at);
    const diffTime: number = Math.abs(currentDate.getTime() - registeredDate.getTime());
    const diffDays: number = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const levelsData: any[] = [];

    // Calculate end dates for each level
    const endDates: Date[] = [
      new Date(registeredDate.getTime() + (5 * 24 * 60 * 60 * 1000)),
      new Date(registeredDate.getTime() + (7 * 24 * 60 * 60 * 1000)),
      new Date(registeredDate.getTime() + (9 * 24 * 60 * 60 * 1000)),
      new Date(registeredDate.getTime() + (10 * 24 * 60 * 60 * 1000)) // Level 4
    ];

    // let current_level = null;

      for (let i = 0; i < endDates.length; i++) {
        if (i === endDates.length - 1) {
          levelsData.push({
            level: i + 1,
            start_date: endDates[i].toISOString()
          });
        } else {
          const startDate = i === 0 ? registeredDate : new Date(endDates[i - 1].getTime() + 1);
          levelsData.push({
            level: i + 1,
            start_date: startDate.toISOString(),
            end_date: new Date(endDates[i].getTime() - 1).toISOString()
          });
        }
      }
      
      let level_present = 0; 
    if (diffDays > 2) { 
      for (let i = 0; i < levelsData.length; i++) {
        if (diffDays > 0 && diffDays <= 2) {
          level_present = 0;
        } else if (diffDays > 3 && diffDays <= 5) {
          level_present = 1;
        } else if (diffDays > 5 && diffDays <= 7) {
          level_present = 2;
        } else if (diffDays > 7 && diffDays <= 9) {
          level_present = 3;
        } else if (diffDays > 9) {
          level_present = 4;
        }
      }
    }
    return {
      'status': 'success',
      'message': 'Get Fruit-level successfully!',
      'data': [
        {
          current_level: level_present,
          levels: levelsData.length > 0 ? levelsData : []
        }
      ]
    };
  } catch (error) {
    return {
      'status': 'error',
      'message': error.message,
      'data': null
    };
  }
}

// //TODO [GET] /qr/fruitcodelevel new
async getchinafruitlevel(fruitCode: string): Promise<any> {
  try {
    const currentDate: Date = new Date();
    const pipeline: any[] = [
      {
        '$match': {
          'fruit_code': fruitCode
        }
      },
      {
        '$project': {
          'registered_at': 1
        }
      }
    ];
    const data: any[] = await this.durianRegisterModel.aggregate(pipeline).exec();

    if (data.length === 0) {
      throw new Error('Fruit-code not found');
    }
 
    const registeredDate: Date = new Date(data[0].registered_at);
    const diffTime: number = Math.abs(currentDate.getTime() - registeredDate.getTime());
    const diffDays: number = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const levelsData: any[] = [];

    // Calculate end dates for each level
    const endDates: Date[] = [
      new Date(registeredDate.getTime() + (2 * 24 * 60 * 60 * 1000)),
      new Date(registeredDate.getTime() + (4 * 24 * 60 * 60 * 1000)),
      new Date(registeredDate.getTime() + (6 * 24 * 60 * 60 * 1000)),
      new Date(registeredDate.getTime() + (8 * 24 * 60 * 60 * 1000)) 
    ];
    // let current_level = null;

      for (let i = 0; i < endDates.length; i++) {
        if (i === endDates.length - 1) {
          levelsData.push({
            level: i + 1,
            start_date: endDates[i].toISOString()
          });
        } else {
          const startDate = i === 0 ? registeredDate : new Date(endDates[i - 1].getTime() + 1);
          levelsData.push({
            level: i + 1,
            start_date: startDate.toISOString(),
            end_date: new Date(endDates[i].getTime() - 1).toISOString()
          });
        }
      }
      let level_present = 1;
if (diffDays >= 0 && diffDays <= 2) {
  level_present = 1;
} else if (diffDays > 3 && diffDays <= 4) {
  level_present = 2;
} else if (diffDays > 5 && diffDays <= 6) {
  level_present = 3;
} else if (diffDays > 7) {
  level_present = 4;
}
    return {
      'status': 'success',
      'message': 'Get Fruit-level successfully!',
      'data': [
        {
          current_level: level_present ?? null,
          levels: levelsData.length > 0 ? levelsData : []
        }
      ]
    };
  } catch (error) {
    return {
      'status': 'error',
      'message': error.message,
      'data': null
    };
  }
}

// //TODO [GET] /qr/mokup-fruitlevel
async mokupfindAll(fruitcode: string): Promise<any> {
  try {
    const pipeline = [
      {
        '$match': {
          'fruit_code': fruitcode
        }
      }, 
      {
        '$project': {
          '_id': 0, 
          'province_name_en': 1, 
          'fruit_code': 1, 
          'repiness': 1, 
          'is_passed': 1, 
          'registered_at': 1, 
          'duration_ripeness': 1, 
          'cultivar': 1
        }
      }
    ]
    const aggregationResult = await this.qrMokupModel.aggregate(pipeline)
         

      if (aggregationResult.length === 0) {
          return {
              'status': 'error',
              'message': 'No entries found with the provided fruit code.',
              'data': []
          };
      }
      return {
          'status': 'success',
          'message': 'Get Product-qr successfully!',
          'data': aggregationResult
      };
  } catch (error) {
      return {
          status: 'error',
          message: error.message,
          data: [],
      };
  }
}

// //TODO [GET] /qr/mokup-fruitcode
async mokupgetfruitstatus(fruitcode: string): Promise<any> {
  try {
    const pipeline =[
      {
        '$match': {
          'fruit_code': fruitcode
        }
      }, {
        '$project': {
          '_id': 0, 
          'timestamp_departure': 1, 
          'timestamp_arrived': 1, 
          'timestamp_packing': 1, 
          'timestamp_quality': 1, 
          'status_quality': 1, 
          'status_packing': 1, 
          'status_arrived': 1, 
          'status_departure': 1, 
          'best_before': 1, 
          'status_picking': 1, 
          'timestamp_picking': 1
        }
      }
    ]
  
    const data = await this.qrMokupModel.aggregate(pipeline).exec();

    return {
      'status': 'success',
      'message': 'Get Fruit-code successfully!',
      'data': data.length > 0 ? data : null
    };
  } catch (error) {
    return {
      'status': 'error',
      'message': error.message,
      'data': null
    };
  }
}

// //TODO [GET] /qr/mokup-chinafruitlevel
async mokupchinafruitlevel(fruitcode: string): Promise<any> {
  try {
    const pipeline =[
      {
        '$match': {
          'fruit_code': fruitcode
        }
      }, 
      {
        '$project': {
          '_id': 0, 
          'current_level': 1, 
          'levels': 1
        }
      }
    ]
  
    const data = await this.qrMokupModel.aggregate(pipeline).exec();

    return {
      'status': 'success',
      'message': 'Get Fruit-code successfully!',
      'data': data.length > 0 ? data : null
    };
  } catch (error) {
    return {
      'status': 'error',
      'message': error.message,
      'data': null
    };
  }
}



}


    //   level: level.level,
    //   start_date: level.start_date,
    //   end_date: level.end_date ? level.end_date : undefined
    // }));

    // const levelsData = formattedLevels.map(level => ({
    //   'start_date': level.start_date,
    //   'end_date': level.end_date,
    //   'level': level.level
    // }));





    // {
    //   '$addFields': {
    //     'status_departure': {
    //       '$ifNull': ['$vwQualityControlsProcess_result.is_passed', null]
    //     },
    //     'timestamp_departure': {
    //       '$ifNull': ['$vwQualityControlsProcess_result.created_at', null]
    //     },
    //     'best_before': {
    //       '$dateAdd': {
    //         'startDate': '$registered_at',
    //         'unit': 'day',
    //         'amount': 10
    //       }
    //     }
    //   }
    // },


    // {
    //   '$addFields': {
    //     'status_arrived': {
    //       '$ifNull': ['$vwQualityControlsProcess_result.is_passed', null]
    //     },
    //     'timestamp_arrived': {
    //       '$ifNull': ['$vwQualityControlsProcess_result.created_at', null]
    //     }
    //   }
    // },


     // {
      //   '$addFields': {
      //     'status_quality': {
      //       '$ifNull': ['$vwQualityControlsProcess_result.is_passed', null]
      //     },
      //     'timestamp_quality': {
      //       '$ifNull': ['$vwQualityControlsProcess_result.created_at', null]
      //     }
      //   }
      // },
      // {
      //   '$addFields': {
      //     'status_packing': {
      //       '$ifNull': ['$vwQualityControlsProcess_result.is_passed', null]
      //     },
      //     'timestamp_packing': {
      //       '$ifNull': ['$vwQualityControlsProcess_result.created_at', null]
      //     }
      //   }
      // },