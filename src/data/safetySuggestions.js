// Safety suggestions based on temperature ranges
// These are hardcoded and do not come from the weather API
// Returns translation keys to support English/Hindi switching

export const getSafetySuggestions = (temperature) => {
  if (temperature < 35) {
    return {
      titleKey: 'safetyNormal',
      icon: '☀️',
      suggestionKeys: [
        'safetyNormal1',
        'safetyNormal2',
        'safetyNormal3',
        'safetyNormal4',
        'safetyNormal5'
      ],
      alertLevel: 'low'
    };
  } else if (temperature >= 35 && temperature < 40) {
    return {
      titleKey: 'safetyModerate',
      icon: '🌤️',
      suggestionKeys: [
        'safetyModerate1',
        'safetyModerate2',
        'safetyModerate3',
        'safetyModerate4',
        'safetyModerate5',
        'safetyModerate6'
      ],
      alertLevel: 'moderate'
    };
  } else if (temperature >= 40 && temperature < 45) {
    return {
      titleKey: 'safetyHigh',
      icon: '🌡️',
      suggestionKeys: [
        'safetyHigh1',
        'safetyHigh2',
        'safetyHigh3',
        'safetyHigh4',
        'safetyHigh5',
        'safetyHigh6',
        'safetyHigh7',
        'safetyHigh8'
      ],
      alertLevel: 'high'
    };
  } else {
    return {
      titleKey: 'safetyExtreme',
      icon: '🚨',
      suggestionKeys: [
        'safetyExtreme1',
        'safetyExtreme2',
        'safetyExtreme3',
        'safetyExtreme4',
        'safetyExtreme5',
        'safetyExtreme6',
        'safetyExtreme7',
        'safetyExtreme8',
        'safetyExtreme9'
      ],
      alertLevel: 'extreme'
    };
  }
};

export const getGeneralHeatTips = () => {
  return {
    titleKey: 'safetyGeneral',
    icon: '💡',
    suggestionKeys: [
      'safetyGeneral1',
      'safetyGeneral2',
      'safetyGeneral3',
      'safetyGeneral4',
      'safetyGeneral5',
      'safetyGeneral6',
      'safetyGeneral7'
    ]
  };
};