module.exports = {
  AcarsType: {
    FLIGHT_PATH: 0,
    ROUTE: 1,
    LOG: 2,
  },
  ActiveState : {
    INACTIVE: 0,
    ACTIVE: 1,
  },
  AircraftState: {
    PARKED: 0,
    IN_USE: 1,
    IN_AIR: 2,
  },
  AircraftStatus: {
    ACTIVE: 'A',
    MAINTENANCE: 'M',
    STORED: 'S',
    RETIRED: 'R',
    SCRAPPED: 'C',
    WRITTEN_OFF: 'W',
  },
  PirepSource: {
    MANUAL: 0,
    ACARS: 1,
  },
  PirepState: {
    IN_PROGRESS: 0,  // flight is ongoing
    PENDING: 1,  // waiting admin approval
    ACCEPTED: 2,
    CANCELLED: 3,
    DELETED: 4,
    DRAFT: 5,
    REJECTED: 6,
    PAUSED: 7,
  },
  PirepStatus: {
    INITIATED: 'INI',
    SCHEDULED: 'SCH',
    BOARDING: 'BST',
    RDY_START: 'RDT',
    PUSHBACK_TOW: 'PBT',
    DEPARTED: 'OFB', // Off block
    RDY_DEICE: 'DIR',
    STRT_DEICE: 'DIC',
    GRND_RTRN: 'GRT', // Ground return
    TAXI: 'TXI', // Taxi
    TAKEOFF: 'TOF',
    INIT_CLIM: 'ICL',
    AIRBORNE: 'TKO',
    ENROUTE: 'ENR',
    DIVERTED: 'DV',
    APPROACH: 'TEN',
    APPROACH_ICAO: 'APR',
    ON_FINAL: 'FIN',
    LANDING: 'LDG',
    LANDED: 'LAN',
    ARRIVED: 'ONB', // On block
    CANCELLED: 'DX',
    EMERG_DESCENT: 'EMG',
    PAUSED: 'PSD',
  },
  UserState: {
    PENDING: 0,
    ACTIVE: 1,
    REJECTED: 2,
    ON_LEAVE: 3,
    SUSPENDED: 4,
    DELETED: 5,
  },
}