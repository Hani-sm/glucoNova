// Full test of the meal analysis logic
const testCases = [
  {
    description: '2 chapati with dal and chicken curry',
    expected: { dishes: ['chapati', 'dal', 'chicken curry'], minCarbs: 30 }
  },
  {
    description: '1 dosa with sambar and salad',
    expected: { dishes: ['dosa', 'sambar', 'salad'], minCarbs: 20 }
  },
  {
    description: 'biryani rice',
    expected: { dishes: ['biryani'], minCarbs: 55 }
  },
  {
    description: 'unknown food item xyz',
    expected: { dishes: [], error: true }
  }
];

const indianFoodDatabase = {
  'chapati': { carbs: 15, protein: 3, fat: 2, calories: 90, fiber: 2, gi: 62, impactLevel: 'medium', portion: '1 piece (30g)', ingredients: ['wheat'] },
  'dal': { carbs: 18, protein: 9, fat: 4, calories: 140, fiber: 5, gi: 30, impactLevel: 'low', portion: '1 bowl (120g)', ingredients: ['lentils'] },
  'chicken curry': { carbs: 8, protein: 25, fat: 10, calories: 220, fiber: 2, gi: 0, impactLevel: 'low', portion: '1 bowl (150g)', ingredients: ['chicken'] },
  'dosa': { carbs: 22, protein: 4, fat: 5, calories: 150, fiber: 1.5, gi: 66, impactLevel: 'medium', portion: '1 medium (80g)', ingredients: ['rice', 'dal'] },
  'sambar': { carbs: 15, protein: 5, fat: 3, calories: 100, fiber: 4, gi: 35, impactLevel: 'low', portion: '1 bowl (150ml)', ingredients: ['dal', 'veg'] },
  'salad': { carbs: 5, protein: 1, fat: 0.2, calories: 25, fiber: 2, gi: 10, impactLevel: 'low', portion: '1 bowl (100g)', ingredients: ['veg'] },
  'biryani': { carbs: 55, protein: 15, fat: 12, calories: 390, fiber: 2, gi: 58, impactLevel: 'high', portion: '1 plate (200g)', ingredients: ['rice', 'meat'] }
};

function analyzeMeal(description) {
  const lowerDesc = description.toLowerCase();
  const items = [];
  
  Object.keys(indianFoodDatabase).forEach(food => {
    const regex = new RegExp('(\\d+)?\\s*' + food, 'gi');
    const matches = lowerDesc.match(regex);
    
    if (matches) {
      const quantityMatch = matches[0].match(/\d+/);
      const quantity = quantityMatch ? parseInt(quantityMatch[0]) : 1;
      items.push({ food, quantity });
    }
  });
  
  if (items.length === 0) {
    return { error: true, items: [] };
  }
  
  const totalCarbs = items.reduce((sum, item) => {
    return sum + (indianFoodDatabase[item.food].carbs * item.quantity);
  }, 0);
  
  return {
    error: false,
    items: items.map(i => i.food),
    totalCarbs
  };
}

console.log('=== Testing Meal Analysis Logic ===\n');
let passed = 0;
let failed = 0;

testCases.forEach((testCase, idx) => {
  console.log(`Test ${idx + 1}: "${testCase.description}"`);
  const result = analyzeMeal(testCase.description);
  
  let success = true;
  if (testCase.expected.error && !result.error) {
    success = false;
  } else if (!testCase.expected.error) {
    // Check if all expected dishes were found
    if (result.items.length !== testCase.expected.dishes.length) {
      success = false;
    } else {
      const foundAll = testCase.expected.dishes.every(dish => 
        result.items.some(item => item.includes(dish) || dish.includes(item))
      );
      if (!foundAll) success = false;
    }
    // Check carbs
    if (result.totalCarbs < testCase.expected.minCarbs) {
      success = false;
    }
  }
  
  if (success) {
    console.log(`✓ PASSED - Found: ${result.items.length} dishes, Carbs: ${result.totalCarbs}g`);
    passed++;
  } else {
    console.log(`✗ FAILED - Result: ${JSON.stringify(result)}`);
    failed++;
  }
  console.log('');
});

console.log(`\n=== Summary ===`);
console.log(`Passed: ${passed}/${testCases.length}`);
console.log(`Failed: ${failed}/${testCases.length}`);
