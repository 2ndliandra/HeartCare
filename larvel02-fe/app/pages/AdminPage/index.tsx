import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Bell, User, Star, Clock, BookOpen, ChevronLeft, ChevronRight, Filter, MoreHorizontal } from 'lucide-react';
import type { Course, FilterState } from '../../types/AdminPage/Admin';

const AdminPage: React.FC = () => {
    // ... (mock data remains same) ...
    // Note: I am not including the mock data in the ReplacementContent to keep it short if it's not changing, 
    // but replace_file_content needs exact context. 
    // Since I can't skip lines in ReplacementContent easily without `multi_replace`, 
    // and I have multiple changes (imports at top, and usage of setMobileFiltersOpen later),
    // I should use `multi_replace_file_content`.
    // Switching to multi_replace_file_content.
    // Mock Data
    const courses: Course[] = [
        {
            id: 1,
            title: "Mastering Business Emails & Communication",
            instructor: "Sarah Jenkins, Senior Linguist",
            level: "B2 Upper Int",
            rating: 4.8,
            reviews: 1200,
            duration: "12h 30m",
            lessons: 18,
            price: 29.99,
            image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            tags: ["New"],
            category: "Business English"
        },
        {
            id: 2,
            title: "Daily Conversational English for Beginners",
            instructor: "David Miller",
            level: "A2 Elementary",
            rating: 4.9,
            reviews: 856,
            duration: "8h 15m",
            lessons: 24,
            price: 'Free',
            image: "https://images.unsplash.com/photo-1513002749550-c59d786b8e6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            category: "Speaking"
        },
        {
            id: 3,
            title: "Academic Writing: Research Papers & Essays",
            instructor: "Prof. Elena Rodriguez",
            level: "C1 Advanced",
            rating: 4.7,
            reviews: 420,
            duration: "15h 45m",
            lessons: 10,
            price: 44.99,
            image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            category: "Academic Preparation"
        },
        {
            id: 4,
            title: "English for Travelers: Survival Guide",
            instructor: "Michael Ross",
            level: "B1 Intermediate",
            rating: 4.6,
            reviews: 2100,
            duration: "5h 20m",
            lessons: 32,
            price: 19.99,
            image: "https://images.unsplash.com/photo-1524863479829-916d8e77f114?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            category: "Travel & Culture"
        },
        {
            id: 5,
            title: "Grammar Deep Dive: Tenses & Moods",
            instructor: "Julia Thorne",
            level: "B2 Upper Int",
            rating: 4.9,
            reviews: 5400,
            duration: "22h 00m",
            lessons: 45,
            price: 34.99,
            image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            category: "Grammar"
        },
        {
            id: 6,
            title: "English Essentials: First 500 Words",
            instructor: "Alex Thompson",
            level: "A1 Beginner",
            rating: 4.5,
            reviews: 128,
            duration: "4h 45m",
            lessons: 15,
            price: 'Free',
            image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            category: "Vocabulary"
        }
    ];

    const [filters, setFilters] = useState<FilterState>({
        search: '',
        levels: [],
        topics: [],
        skills: [],
        sort: 'popular'
    });

    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

    // Filter Handlers
    const toggleFilter = (type: 'levels' | 'topics' | 'skills', value: string) => {
        setFilters(prev => {
            const current = prev[type];
            const updated = current.includes(value)
                ? current.filter(item => item !== value)
                : [...current, value];
            return { ...prev, [type]: updated };
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
            {/* Navigation */}
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center gap-8">
                            {/* Logo */}
                            <Link to="/" className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-lg">E</span>
                                </div>
                                <span className="text-xl font-bold text-gray-900">FluentEnglish</span>
                            </Link>

                            {/* Desktop Nav Links */}
                            <div className="hidden md:flex items-center gap-6">
                                <Link to="/admin" className="text-blue-600 font-semibold border-b-2 border-blue-600 py-5">Catalog</Link>
                                <a href="#" className="text-gray-500 hover:text-gray-900 font-medium transition-colors">My Courses</a>
                                <a href="#" className="text-gray-500 hover:text-gray-900 font-medium transition-colors">Tests</a>
                                <a href="#" className="text-gray-500 hover:text-gray-900 font-medium transition-colors">Tutors</a>
                            </div>
                        </div>

                        {/* Right Side Icons */}
                        <div className="flex items-center gap-4">
                            <button className="text-gray-400 hover:text-gray-600 transition-colors relative">
                                <Bell size={20} />
                                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                            </button>
                            <button className="hidden sm:block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                                Upgrade to Pro
                            </button>
                            <div className="w-9 h-9 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 border border-orange-200 cursor-pointer">
                                <User size={20} />
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Course Catalog</h1>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>Showing 24 of 142 courses</span>
                        <select
                            className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={filters.sort}
                            onChange={(e) => setFilters({ ...filters, sort: e.target.value as any })}
                        >
                            <option value="popular">Most Popular</option>
                            <option value="newest">Newest</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                        </select>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-200 mb-8 flex items-center gap-2">
                    <button
                        className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                        onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                    >
                        <Filter size={20} />
                    </button>
                    <Search className="text-gray-400 ml-3" size={20} />
                    <input
                        type="text"
                        placeholder="Search for courses, topics, or instructors..."
                        className="flex-grow bg-transparent border-none focus:ring-0 text-gray-700 placeholder-gray-400 h-10"
                        value={filters.search}
                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    />
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-semibold transition-colors">
                        Find
                    </button>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filters Sidebar */}
                    <aside className={`lg:w-64 flex-shrink-0 ${mobileFiltersOpen ? 'block' : 'hidden lg:block'}`}>
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2 font-bold text-gray-900 uppercase tracking-wider text-sm">
                                <Filter size={18} />
                                Filters
                            </div>
                            <button
                                className="lg:hidden text-gray-500 hover:text-gray-900"
                                onClick={() => setMobileFiltersOpen(false)}
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Proficiency Level */}
                        <div className="mb-8">
                            <h3 className="font-bold text-gray-900 text-xs uppercase tracking-wider mb-4">Proficiency Level</h3>
                            <div className="space-y-3">
                                {['A1 - Beginner', 'A2 - Elementary', 'B1 - Intermediate', 'B2 - Upper Intermediate', 'C1 - Advanced'].map((level) => (
                                    <label key={level} className="flex items-center gap-3 cursor-pointer group">
                                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${filters.levels.includes(level) ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300 group-hover:border-blue-400'}`}>
                                            {filters.levels.includes(level) && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                        </div>
                                        <input
                                            type="checkbox"
                                            className="hidden"
                                            checked={filters.levels.includes(level)}
                                            onChange={() => toggleFilter('levels', level)}
                                        />
                                        <span className={`text-sm ${filters.levels.includes(level) ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>{level}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Topic */}
                        <div className="mb-8">
                            <h3 className="font-bold text-gray-900 text-xs uppercase tracking-wider mb-4">Topic</h3>
                            <div className="space-y-3">
                                {['Business English', 'Academic Preparation', 'Travel & Culture', 'Exam Prep (IELTS/TOEFL)'].map((topic) => (
                                    <label key={topic} className="flex items-center gap-3 cursor-pointer group">
                                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${filters.topics.includes(topic) ? 'border-blue-600' : 'border-gray-300 group-hover:border-blue-400'}`}>
                                            {filters.topics.includes(topic) && <div className="w-3 h-3 rounded-full bg-blue-600"></div>}
                                        </div>
                                        <input
                                            type="checkbox"
                                            className="hidden"
                                            checked={filters.topics.includes(topic)}
                                            onChange={() => toggleFilter('topics', topic)}
                                        />
                                        <span className={`text-sm ${filters.topics.includes(topic) ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>{topic}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Skills Focus */}
                        <div className="mb-8">
                            <h3 className="font-bold text-gray-900 text-xs uppercase tracking-wider mb-4">Skills Focus</h3>
                            <div className="flex flex-wrap gap-2">
                                {['Grammar', 'Speaking', 'Listening', 'Writing', 'Vocabulary'].map((skill) => (
                                    <button
                                        key={skill}
                                        onClick={() => toggleFilter('skills', skill)}
                                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${filters.skills.includes(skill)
                                            ? 'bg-blue-100 text-blue-700 ring-1 ring-blue-600'
                                            : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'
                                            }`}
                                    >
                                        {skill}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Learning Streak Widget */}
                        <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
                            <h3 className="text-blue-900 font-bold text-xs uppercase tracking-wider mb-2">Learning Streak</h3>
                            <div className="flex items-end gap-2 mb-2">
                                <span className="text-3xl font-bold text-gray-900">12 Days</span>
                            </div>
                            <div className="w-full bg-blue-200 rounded-full h-1.5 mb-2">
                                <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '40%' }}></div>
                            </div>
                            <p className="text-xs text-blue-700">Next reward in 3 days</p>
                        </div>
                    </aside>

                    {/* Course Grid */}
                    <div className="flex-grow">
                        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {courses.map((course) => (
                                <div key={course.id} className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300 group flex flex-col h-full">
                                    {/* Card Image */}
                                    <div className="relative h-48 overflow-hidden">
                                        <img
                                            src={course.image}
                                            alt={course.title}
                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                        {/* Badge */}
                                        <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded text-xs font-bold text-gray-700 uppercase tracking-wide">
                                            {course.level}
                                        </span>

                                        {course.tags?.includes('New') && (
                                            <span className="absolute top-3 left-3 bg-green-500 text-white px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wide shadow-sm">
                                                New
                                            </span>
                                        )}
                                    </div>

                                    {/* Card Content */}
                                    <div className="p-5 flex flex-col flex-grow">
                                        <h3 className="font-bold text-lg text-gray-900 mb-2 leading-tight group-hover:text-blue-600 transition-colors">
                                            {course.title}
                                        </h3>
                                        <p className="text-sm text-gray-500 mb-3">By {course.instructor}</p>

                                        <div className="flex items-center gap-1 mb-4">
                                            <Star className="w-4 h-4 text-amber-400 fill-current" />
                                            <span className="font-bold text-gray-900">{course.rating}</span>
                                            <span className="text-xs text-gray-400">({course.reviews} reviews)</span>
                                        </div>

                                        <div className="mt-auto">
                                            <div className="flex items-center gap-4 text-xs text-gray-500 mb-4 border-t border-gray-100 pt-4">
                                                <div className="flex items-center gap-1.5">
                                                    <Clock size={14} />
                                                    <span>{course.duration}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <BookOpen size={14} />
                                                    <span>{course.lessons} Lessons</span>
                                                </div>
                                                {course.price === 'Free' && (
                                                    <span className="ml-auto bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-bold uppercase">
                                                        Free
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <span className="text-xl font-bold text-blue-600">
                                                    {course.price === 'Free' ? 'Free' : `$${course.price}`}
                                                </span>
                                                {course.price !== 'Free' && (
                                                    <button className="text-gray-900 p-2 hover:bg-gray-100 rounded-full transition-colors">
                                                        <MoreHorizontal size={20} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        <div className="flex justify-center items-center gap-2 mt-12">
                            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors disabled:opacity-50">
                                <ChevronLeft size={18} />
                            </button>
                            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-600 text-white font-bold shadow-md shadow-blue-200">1</button>
                            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">2</button>
                            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">3</button>
                            <span className="w-8 h-8 flex items-center justify-center text-gray-400">...</span>
                            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">12</button>
                            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-600 transition-colors">
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 mt-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                        <div className="col-span-1">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold">E</span>
                                </div>
                                <span className="text-xl font-bold text-gray-900">FluentEnglish</span>
                            </div>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                Empowering global learners with modern English courses designed for real-world success.
                            </p>
                        </div>

                        <div>
                            <h4 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">Platform</h4>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li><a href="#" className="hover:text-blue-600 transition-colors">Courses</a></li>
                                <li><a href="#" className="hover:text-blue-600 transition-colors">Assessments</a></li>
                                <li><a href="#" className="hover:text-blue-600 transition-colors">Learning Paths</a></li>
                                <li><a href="#" className="hover:text-blue-600 transition-colors">Pricing</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">Support</h4>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li><a href="#" className="hover:text-blue-600 transition-colors">Help Center</a></li>
                                <li><a href="#" className="hover:text-blue-600 transition-colors">Terms of Service</a></li>
                                <li><a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a></li>
                                <li><a href="#" className="hover:text-blue-600 transition-colors">Contact Us</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">Join our Newsletter</h4>
                            <p className="text-gray-500 text-sm mb-4">Get the latest updates and learning tips.</p>
                            <div className="flex gap-2">
                                <input
                                    type="email"
                                    placeholder="Email"
                                    className="flex-grow bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                />
                                <button className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors">
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400">
                        <p>© 2024 FluentEnglish. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default AdminPage;
