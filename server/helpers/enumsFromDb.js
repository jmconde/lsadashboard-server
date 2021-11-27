module.exports = {
  AcarsType: {
    0: 'FLIGHT_PATH',
    1: 'ROUTE',
    2: 'LOG',
  },
  ActiveState: {
    0: 'INACTIVE',
    1: 'INACTIVE',
  },
  AircraftState: {
    0: 'PARKED',
    1: 'IN_USE',
    2: 'IN_AIR',
  },
  AircraftStatus: {
    A: 'ACTIVE',
    M: 'MAINTENANCE',
    S: 'STORED',
    R: 'RETIRED',
    C: 'SCRAPPED',
    W: 'WRITTEN_OFF',
  },
  PirepSource: {
    0: 'MANUAL',
    1: 'ACARS',
  },
  PirepState: {
    0: 'IN_PROGRESS',  // flight is ongoing
    1: 'PENDING',  // waiting admin approval
    2: 'ACCEPTED',
    3: 'CANCELLED',
    4: 'DELETED',
    5: 'DRAFT',
    6: 'REJECTED',
    7: 'PAUSED',
  },
  PirepStatus: {
    INI: 'INITIATED',
    SCH: 'SCHEDULED',
    BST: 'BOARDING',
    RDT: 'RDY_START',
    PBT: 'PUSHBACK_TOW',
    OFB: 'DEPARTED', // Off block
    DIR: 'RDY_DEICE',
    DIC: 'STRT_DEICE',
    GRT: 'GRND_RTRN', // Ground return
    TXI: 'TAXI', // Taxi
    TOF: 'TAKEOFF',
    ICL: 'INIT_CLIM',
    TKO: 'AIRBORNE',
    ENR: 'ENROUTE',
    DV: 'DIVERTED',
    TEN: 'APPROACH',
    APR: 'APPROACH_ICAO',
    FIN: 'ON_FINAL',
    LDG: 'LANDING',
    LAN: 'LANDED',
    ONB: 'ARRIVED', // On block
    DX: 'CANCELLED',
    EMG: 'EMERG_DESCENT',
    PSD: 'PAUSED',
  },
  UserState: {
    0: 'PENDING',
    1: 'ACTIVE',
    2: 'REJECTED',
    3: 'ON_LEAVE',
    4: 'SUSPENDED',
    5: 'DELETED',
  },
};