const mapRank = (flightSeconds) => {
    const hours = ((flightSeconds / 60) / 60);
    let code, rank;
    if (hours >= 0 && hours < 1) {
        code = '01';
        rank = 'New Pilot';
    } else if (hours >= 1 && hours < 15) {
        code = '02';
        rank = 'PreSOLO Student';
    } else if (hours >= 15 && hours < 45) {
        code = '03';
        rank = 'Fase Maniobras';
    } else if (hours >= 45 && hours < 60) {
        code = '04';
        rank = 'Fase Cruceros VFR';
    } else if (hours >= 60 && hours < 120) {
        code = '05';
        rank = 'Fase Entrenamiento IFR';
    } else if (hours >= 120 && hours < 180) {
        code = '06';
        rank = 'Fase Cruceros IFR';
    } else if (hours >= 180 && hours < 200) {
        code = '07';
        rank = 'Fase Nocturno';
    } else if (hours >= 200) {
        code = '08';
        rank = 'Commercial Pilot';
    }
    return { code, rank };
}

const splitUserName = (username) => {
    const splitted = username.split(' ');
    return `${splitted[0]} ${splitted[1].substring(0, 1)}`;
};

const getPilotId = (numId) => {
  const power = numId < 1000 ? 10 ** 3 : 10 ** (String(numId).length )
  const strId = String(power + numId).substring(1);
  return `LTS${strId}`
}

module.exports = {
    mapRank,
    splitUserName,
    getPilotId,
};