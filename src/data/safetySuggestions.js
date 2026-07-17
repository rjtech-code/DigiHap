// Safety suggestions based on temperature ranges
// These are hardcoded and do not come from the weather API

export const getSafetySuggestions = (temperature) => {
  if (temperature < 35) {
    return {
      title: 'Normal Conditions',
      icon: '☀️',
      suggestions: [
        'Enjoy your day with normal precautions',
        'Stay hydrated by drinking water regularly',
        'Wear comfortable, light clothing',
        'Use sunscreen when going outdoors',
        'Take breaks in shaded areas if needed'
      ],
      alertLevel: 'low'
    };
  } else if (temperature >= 35 && temperature < 40) {
    return {
      title: 'Moderate Heat - Stay Alert',
      icon: '🌤️',
      suggestions: [
        'Drink plenty of water throughout the day',
        'Wear light-colored, loose-fitting clothes',
        'Avoid prolonged exposure to direct sunlight',
        'Take frequent breaks in cool or shaded areas',
        'Watch for signs of heat exhaustion',
        'Limit outdoor activities during peak hours (12 PM - 4 PM)'
      ],
      alertLevel: 'moderate'
    };
  } else if (temperature >= 40 && temperature < 45) {
    return {
      title: 'High Heat - Take Precautions',
      icon: '🌡️',
      suggestions: [
        'Avoid outdoor activities as much as possible',
        'Drink water every 15-20 minutes, even if not thirsty',
        'Wear a hat, sunglasses, and sunscreen (SPF 30+)',
        'Stay in air-conditioned or well-ventilated areas',
        'Check on elderly family members and neighbors',
        'Never leave children or pets in parked vehicles',
        'Reschedule outdoor work to early morning or evening',
        'Recognize signs of heat stroke: high body temperature, confusion, loss of consciousness'
      ],
      alertLevel: 'high'
    };
  } else {
    return {
      title: 'Extreme Heat Alert - Danger',
      icon: '🚨',
      suggestions: [
        'STAY INDOORS - Avoid all outdoor activities',
        'Drink water continuously - do not wait until thirsty',
        'Keep your environment cool with fans or AC',
        'Wear minimal, lightweight, light-colored clothing',
        'Check on vulnerable people: elderly, children, sick individuals',
        'Know the signs of heat emergency and call emergency services if needed',
        'Avoid alcohol, caffeine, and sugary drinks',
        'Take cool showers or baths to lower body temperature',
        'Signs of heat stroke: body temp above 40°C, confusion, seizures, unconsciousness - SEEK IMMEDIATE MEDICAL HELP'
      ],
      alertLevel: 'extreme'
    };
  }
};

export const getGeneralHeatTips = () => {
  return {
    title: 'General Heat Safety Tips',
    icon: '💡',
    suggestions: [
      'Drink at least 8 glasses of water daily',
      'Eat light, refreshing meals with fruits and vegetables',
      'Wear sunscreen with SPF 30 or higher',
      'Limit physical exertion during hottest parts of the day',
      'Know the difference between heat exhaustion and heat stroke',
      'Keep emergency contact numbers handy',
      'Stay informed about weather updates and heat alerts'
    ]
  };
};