// Heat level determination based on temperature

export const getHeatLevel = (temperature) => {
  if (temperature < 35) {
    return {
      level: 'Normal',
      color: 'bg-green-100 text-green-800 border-green-300',
      emoji: '🟢'
    };
  } else if (temperature >= 35 && temperature < 40) {
    return {
      level: 'Moderate',
      color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      emoji: '🟡'
    };
  } else if (temperature >= 40 && temperature < 45) {
    return {
      level: 'High',
      color: 'bg-orange-100 text-orange-800 border-orange-300',
      emoji: '🟠'
    };
  } else {
    return {
      level: 'Extreme',
      color: 'bg-red-100 text-red-800 border-red-300',
      emoji: '🔴'
    };
  }
};

export const getHeatLevelDescription = (temperature) => {
  if (temperature < 35) {
    return 'Comfortable conditions';
  } else if (temperature >= 35 && temperature < 40) {
    return 'Warm conditions - stay hydrated';
  } else if (temperature >= 40 && temperature < 45) {
    return 'Hot conditions - take precautions';
  } else {
    return 'Extreme heat - avoid outdoor activities';
  }
};