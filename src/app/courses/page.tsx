'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useUser } from '@/context/UserContext';
import { useCart } from '@/context/CartContext';
import { Search, Filter, SortDesc, SortAsc } from 'lucide-react';

// Define the Course interface
interface Course {
  id: string;
  title: string;
  image: string;
  price: number;
  rating: number;
  description: string;
  categories: string[];
  level: string;
  location: string;
  duration: string;
  featured: boolean;
}

// Full course data with more metadata for filtering
const coursesData: Course[] = [
  {
    id: "zhiroszhiganie1",
    title: "Fat Burning I",
    image: "/course1.png",
    price: 3000,
    rating: 5,
    description: "A specialized fat-burning workout program to kickstart weight loss and sculpt a toned physique.",
    categories: ["fitness", "weight-loss"],
    level: "beginner",
    location: "home",
    duration: "4 weeks",
    featured: true,
  },
  {
    id: "dlya-zala1",
    title: "Gym Workout I",
    image: "/course2.png",
    price: 3000,
    rating: 5,
    description: "A comprehensive gym training program focused on full-body muscle development.",
    categories: ["fitness", "strength"],
    level: "beginner",
    location: "gym",
    duration: "6 weeks",
    featured: true,
  },
  {
    id: "funkcionalnyj-trening",
    title: "Functional 3D II",
    image: "/course3.png",
    price: 4500,
    rating: 5,
    description: "An advanced functional training program designed to improve all-round physical performance and strengthen muscles across all planes of movement.",
    categories: ["fitness", "functional"],
    level: "advanced",
    location: "home",
    duration: "8 weeks",
    featured: false,
  },
  {
    id: "dlya-zala2",
    title: "Gym Workout II",
    image: "/course2.png",
    price: 3500,
    rating: 4,
    description: "An advanced gym training program featuring challenging exercises and intense workout routines.",
    categories: ["fitness", "strength"],
    level: "intermediate",
    location: "gym",
    duration: "8 weeks",
    featured: false,
  },
  {
    id: "zhiroszhiganie2",
    title: "Fat Burning II",
    image: "/course1.png",
    price: 3500,
    rating: 4,
    description: "An advanced fat-burning program with high-intensity interval training and complex workouts.",
    categories: ["fitness", "weight-loss", "hiit"],
    level: "intermediate",
    location: "home",
    duration: "6 weeks",
    featured: false,
  },
  {
    id: "rastyazhka",
    title: "Stretching & Pilates",
    image: "/course3.png",
    price: 2500,
    rating: 5,
    description: "A comprehensive program to improve flexibility, joint mobility, and strengthen deep core muscles with Pilates elements.",
    categories: ["fitness", "flexibility", "pilates"],
    level: "beginner",
    location: "home",
    duration: "4 weeks",
    featured: true,
  },
];


// Filter and sort options
const filterOptions = {
  categories: [
    { id: 'all', name: 'All Categories' },
    { id: 'fitness', name: 'Fitness' },
    { id: 'weight-loss', name: 'Fat Burning' },
    { id: 'strength', name: 'Strength' },
    { id: 'functional', name: 'Functional Training' },
    { id: 'flexibility', name: 'Flexibility' },
    { id: 'pilates', name: 'Pilates' },
    { id: 'hiit', name: 'HIIT' },
  ],
  levels: [
    { id: 'all', name: 'All Levels' },
    { id: 'beginner', name: 'Beginner' },
    { id: 'intermediate', name: 'Intermediate' },
    { id: 'advanced', name: 'Advanced' },
  ],
  locations: [
    { id: 'all', name: 'All Locations' },
    { id: 'home', name: 'At Home' },
    { id: 'gym', name: 'In Gym' },
  ],
  sorting: [
    { id: 'featured', name: 'Featured' },
    { id: 'price-asc', name: 'Price: Low to High' },
    { id: 'price-desc', name: 'Price: High to Low' },
    { id: 'rating', name: 'By Rating' },
  ],
};


export default function CoursesPage() {
  const { t } = useLanguage();
  const { hasPurchased } = useUser();
  const { isInCart, addItem } = useCart();

  // State for search and filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [sortOrder, setSortOrder] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);
  const [filteredCourses, setFilteredCourses] = useState(coursesData);

  // Apply filters and sorting when any filter or search changes
  useEffect(() => {
    let results = [...coursesData];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        course =>
          course.title.toLowerCase().includes(query) ||
          course.description.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      results = results.filter(
        course => course.categories.includes(selectedCategory)
      );
    }

    // Apply level filter
    if (selectedLevel !== 'all') {
      results = results.filter(
        course => course.level === selectedLevel
      );
    }

    // Apply location filter
    if (selectedLocation !== 'all') {
      results = results.filter(
        course => course.location === selectedLocation
      );
    }

    // Apply sorting
    switch (sortOrder) {
      case 'price-asc':
        results.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        results.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        results.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // Featured order or fallback
        results.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    setFilteredCourses(results);
  }, [searchQuery, selectedCategory, selectedLevel, selectedLocation, sortOrder]);

  // Function to add course to cart
  const handleAddToCart = (course: Course) => {
    addItem({
      courseId: course.id,
      title: course.title,
      price: course.price,
      image: course.image,
    });
  };

  // Function to render star ratings
  const renderStars = (rating: number) => {
    return [1, 2, 3, 4, 5].map((position) => (
      <span
        key={`star-${position}`}
        className={`text-lg ${position <= rating ? 'text-primary' : 'text-gray-300 dark:text-gray-600'}`}
      >
        ★
      </span>
    ));
  };

  return (
    <div className="container-custom py-16">
      <h1 className="text-3xl font-light mb-8">{t('courses.title')}</h1>

      {/* Search and filter bar */}
      <div className="bg-white dark:bg-gray-800 p-4 mb-8 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search input */}
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md leading-5 bg-white dark:bg-gray-800 placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary transition duration-150 ease-in-out"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Sort dropdown */}
          <div className="w-full md:w-56">
            <div className="relative inline-block text-left w-full">
              <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-md">
                <div className="pl-3">
                  {sortOrder === 'price-asc' ? (
                    <SortAsc className="h-4 w-4 text-gray-400" />
                  ) : sortOrder === 'price-desc' ? (
                    <SortDesc className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Filter className="h-4 w-4 text-gray-400" />
                  )}
                </div>
                <select
                  className="block w-full py-2 pl-2 pr-8 border-0 bg-transparent focus:ring-0 text-sm"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                >
                  {filterOptions.sorting.map(option => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Filter button */}
          <button
            className="w-full md:w-auto px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 text-gray-700 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-400 focus:outline-none transition duration-150 ease-in-out flex items-center justify-center"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters {showFilters ? '▲' : '▼'}
          </button>
        </div>

        {/* Expanded filters */}
        {showFilters && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            {/* Category filter */}
            <div>
              <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category
              </label>
              <select
                id="category-filter"
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {filterOptions.categories.map(option => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Level filter */}
            <div>
              <label htmlFor="level-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Level
              </label>
              <select
                id="level-filter"
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
              >
                {filterOptions.levels.map(option => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Location filter */}
            <div>
              <label htmlFor="location-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Location
              </label>
              <select
                id="location-filter"
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
              >
                {filterOptions.locations.map(option => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Results summary */}
      <div className="mb-6 flex justify-between items-center">
        <p className="text-gray-600 dark:text-gray-400">
          {filteredCourses.length === 0
            ? 'No courses found'
            : `Found ${filteredCourses.length} ${
                filteredCourses.length === 1 ? 'course' :
                filteredCourses.length < 5 ? 'courses' : 'courses'
              }`}
        </p>
        {(searchQuery || selectedCategory !== 'all' || selectedLevel !== 'all' || selectedLocation !== 'all') && (
          <button
            className="text-primary hover:underline"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedLevel('all');
              setSelectedLocation('all');
              setSortOrder('featured');
            }}
          >
            Reset filters
          </button>
        )}
      </div>

      {/* Course grid */}
      {filteredCourses.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Курсов по выбранным критериям не найдено
          </p>
          <button
            className="bg-primary text-black dark:text-white py-2 px-4 hover:bg-primary/90 transition duration-200"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedLevel('all');
              setSelectedLocation('all');
            }}
          >
            Сбросить фильтры
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course) => {
            const isPurchased = hasPurchased(course.id);
            const inCart = isInCart(course.id);

            return (
              <div key={course.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden group">
                <Link href={`/courses/${course.id}`} className="block relative">
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={course.image}
                      alt={course.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 bg-neon-green px-2 py-1 text-xs">
                      {course.location === 'home' ? 'At Home' : 'In Gym'}
                    </div>
                    {course.featured && (
                      <div className="absolute top-3 right-3 bg-primary px-2 py-1 text-xs text-white">
                        Featured
                      </div>
                    )}
                  </div>
                </Link>

                <div className="p-4">
                  <div className="flex justify-between mb-2">
                    <Link href={`/courses/${course.id}`} className="text-lg font-medium hover:text-primary">
                      {course.title}
                    </Link>
                    <span className="text-lg font-medium">{course.price.toLocaleString()} ₽</span>
                  </div>

                  <div className="flex mb-2">
                    {renderStars(course.rating)}
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                    {course.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded-full">
                      {course.level === 'beginner' ? 'Beginner' :
                        course.level === 'intermediate' ? 'Intermediate' : 'Advanced'}
                    </span>
                    <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded-full">
                      {course.duration}
                    </span>
                    {course.categories.slice(0, 2).map(cat => (
                      <span key={cat} className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded-full">
                        {filterOptions.categories.find(c => c.id === cat)?.name || cat}
                      </span>
                    ))}
                  </div>

                  <div className="flex space-x-2">
                    <Link
                      href={`/courses/${course.id}`}
                      className="flex-1 bg-primary text-black dark:text-white py-2 px-4 text-center hover:bg-primary/90 transition duration-200"
                    >
                      Details
                    </Link>

                    {isPurchased ? (
                      <Link
                        href="/dashboard"
                        className="flex-1 border border-primary text-primary py-2 px-4 text-center hover:bg-primary/10 transition duration-200"
                      >
                        Open Course
                      </Link>
                    ) : inCart ? (
                      <Link
                        href="/cart"
                        className="flex-1 border border-primary text-primary py-2 px-4 text-center hover:bg-primary/10 transition duration-200"
                      >
                        In Cart
                      </Link>
                    ) : (
                      <button
                        onClick={() => handleAddToCart(course)}
                        className="flex-1 border border-gray-300 dark:border-gray-700 py-2 px-4 text-center hover:border-primary transition duration-200"
                      >
                          Add to Cart
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
