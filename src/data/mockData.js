export const mockDonorData = {
  totalDonations: 25,
  totalFoodDonated: 180,
  co2Reduced: 450,
  methaneReduced: 45,
  donations: [
    { id: 1, foodType: 'Fresh Vegetables', quantity: 25, pickupTime: '2024-02-20 10:00', status: 'Collected' },
    { id: 2, foodType: 'Bread & Bakery', quantity: 15, pickupTime: '2024-02-19 14:00', status: 'Collected' },
    { id: 3, foodType: 'Cooked Meals', quantity: 30, pickupTime: '2024-02-18 12:00', status: 'Available' },
    { id: 4, foodType: 'Fruits', quantity: 20, pickupTime: '2024-02-17 09:00', status: 'Collected' },
    { id: 5, foodType: 'Dairy Products', quantity: 10, pickupTime: '2024-02-16 15:00', status: 'Available' }
  ]
};

export const mockNGOData = {
  totalFoodCollected: 220,
  co2Reduced: 550,
  methaneReduced: 55,
  availableDonations: [
    { id: 6, donor: 'Green Grocery Store', foodType: 'Fresh Vegetables', quantity: 35, pickupTime: '2024-02-20 16:00', location: 'Downtown' },
    { id: 7, donor: 'City Bakery', foodType: 'Bread & Pastries', quantity: 20, pickupTime: '2024-02-20 18:00', location: 'North Side' },
    { id: 8, donor: 'Hotel Sunrise', foodType: 'Cooked Meals', quantity: 45, pickupTime: '2024-02-21 10:00', location: 'Central' },
    { id: 9, donor: 'Farm Fresh Market', foodType: 'Fruits', quantity: 30, pickupTime: '2024-02-21 14:00', location: 'East End' }
  ],
  collectedDonations: [
    { id: 1, donor: 'Super Market', foodType: 'Fresh Vegetables', quantity: 25, collectedDate: '2024-02-19', location: 'Downtown' },
    { id: 2, donor: 'Local Bakery', foodType: 'Bread & Bakery', quantity: 15, collectedDate: '2024-02-18', location: 'South' },
    { id: 3, donor: 'Restaurant Plus', foodType: 'Cooked Meals', quantity: 30, collectedDate: '2024-02-17', location: 'West Side' }
  ]
};

export const mockAdminData = {
  totalDonors: 120,
  totalNGOs: 35,
  totalDonations: 540,
  totalFoodSaved: 1200,
  totalCO2Reduced: 3000,
  totalMethaneReduced: 300,
  donationStatus: [
    { name: 'Available', value: 180 },
    { name: 'Collected', value: 360 }
  ],
  monthlyDonations: [
    { month: 'Jan', donations: 85 },
    { month: 'Feb', donations: 92 },
    { month: 'Mar', donations: 78 },
    { month: 'Apr', donations: 105 },
    { month: 'May', donations: 98 },
    { month: 'Jun', donations: 82 }
  ],
  impactGrowth: [
    { month: 'Jan', co2: 212 },
    { month: 'Feb', co2: 230 },
    { month: 'Mar', co2: 195 },
    { month: 'Apr', co2: 262 },
    { month: 'May', co2: 245 },
    { month: 'Jun', co2: 205 }
  ]
};

export const foodTypes = [
  'Fresh Vegetables',
  'Fruits',
  'Bread & Bakery',
  'Cooked Meals',
  'Dairy Products',
  'Canned Goods',
  'Grains & Cereals',
  'Other'
];
