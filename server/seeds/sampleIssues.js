import Issue from '../models/Issue.js';

const sampleIssues = [
  {
    title: 'Garbage Overflow at Delhi Market Area',
    category: 'Garbage',
    location: 'Delhi, India',
    description: 'Large amounts of uncollected garbage piled up in the market area for over a week. This is causing serious health hazards and foul smell affecting local residents and businesses.',
    image: '/images/garbage-issue.svg',
    amount: 41500,
    status: 'ongoing',
    date: '2026-06-01',
    email: 'admin@communitycleanliness.com'
  },
  {
    title: 'Broken Street Light on Mumbai Road',
    category: 'Broken Public Property',
    location: 'Mumbai, India',
    description: 'Multiple street lights on Marine Drive have been non-functional for the past 2 months. This is creating safety concerns for commuters traveling at night.',
    image: '/images/broken-street-light.svg',
    amount: 24900,
    status: 'ongoing',
    date: '2026-06-01',
    email: 'admin@communitycleanliness.com'
  },
  {
    title: 'Pothole Crisis on Bangalore Main Street',
    category: 'Road Damage',
    location: 'Bangalore, India',
    description: 'Multiple large potholes have appeared on the main street near the central business district. Vehicles are struggling to navigate safely, causing traffic congestion.',
    image: '/images/pothole-damage.svg',
    amount: 83000,
    status: 'ongoing',
    date: '2026-06-01',
    email: 'admin@communitycleanliness.com'
  },
  {
    title: 'Illegal Construction Near Kolkata Park',
    category: 'Illegal Construction',
    location: 'Kolkata, India',
    description: 'Unauthorized construction work is underway in a protected park area. This is destroying green space and violating environmental regulations.',
    image: '/images/illegal-construction.svg',
    amount: 62250,
    status: 'ongoing',
    date: '2026-06-01',
    email: 'admin@communitycleanliness.com'
  },
  {
    title: 'Drainage System Failure in Chennai',
    category: 'Garbage',
    location: 'Chennai, India',
    description: 'The drainage system in the residential area has completely failed, causing water stagnation and foul smell. This is creating breeding grounds for diseases.',
    image: '/images/drainage-failure.svg',
    amount: 99600,
    status: 'ongoing',
    date: '2026-06-01',
    email: 'admin@communitycleanliness.com'
  },
  {
    title: 'Damaged Park Benches in Pune',
    category: 'Broken Public Property',
    location: 'Pune, India',
    description: 'Most benches in the community park are broken and unsafe. They need immediate replacement to ensure safety for senior citizens and children.',
    image: '/images/damaged-benches.svg',
    amount: 33200,
    status: 'ongoing',
    date: '2026-06-01',
    email: 'admin@communitycleanliness.com'
  }
];

export const seedSampleIssues = async () => {
  try {
    const existingCount = await Issue.countDocuments();
    
    // Only add sample issues if database is empty or has very few issues
    if (existingCount < 6) {
      console.log('Seeding sample issues...');
      
      // Clear existing issues if less than 6
      if (existingCount > 0) {
        await Issue.deleteMany({});
      }
      
      await Issue.insertMany(sampleIssues);
      console.log('Sample issues seeded successfully!');
    }
  } catch (error) {
    console.error('Error seeding sample issues:', error.message);
  }
};
