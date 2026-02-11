import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

const LandingPage: React.FC = () => {
    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: true,
            easing: 'ease-out-cubic',
        });
    }, []);

    return (
        <div className="min-h-screen w-full bg-gray-50 overflow-x-hidden">

            {/* Navigation */}
            <nav className="bg-white shadow-sm sticky top-6 z-50">
                <div className="max-w-7xl mx-auto sm:px-10 lg:px-8">
                    <div className="flex justify-between h-16">
                        {/* Logo - Left Corner */}
                        <div className="flex gap-2 -ml-12" data-aos="fade-down">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                                <span className="text-white font-bold text-xl">E</span>
                            </div>
                            <span className="text-xl sm:text-3xl py-2 font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">EnglishFlow</span>
                        </div>

                        {/* Navigation Links - Center */}
                        <ul className="hidden lg:flex py-2 gap-4 xl:gap-8 list-none m-0" data-aos="fade-down" data-aos-delay="100">
                            <li><a href="#courses" className="text-gray-600 hover:text-blue-600 transition-colors no-underline font-medium text-lg">Courses</a></li>
                            <li><a href="#tests" className="text-gray-600 hover:text-blue-600 transition-colors no-underline font-medium text-lg">Tests</a></li>
                            <li><a href="#exercises" className="text-gray-600 transition-colors no-underline font-medium text-lg">Exercises</a></li>
                            <li><a href="#pricing" className="text-gray-600 hover:text-blue-600 transition-colors no-underline font-medium text-lg">Pricing</a></li>
                        </ul>

                        {/* Auth Buttons - Right Corner */}
                        <div className="flex items-center justify-center gap-2 mb-4 -mr-12 sm:gap-5" data-aos="fade-down" data-aos-delay="200">
                            <Link to="/login" className="hidden sm:block text-gray-700 font-semibold hover:text-blue-600 transition-colors bg-transparent border-none cursor-pointer text-medium px-6 py-2.5 no-underline">Log In</Link>
                            <Link to="/register" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-10 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-md border-none cursor-pointer text-base no-underline">Sign Up</Link>
                            <button className="lg:hidden text-gray-700 p-2 hover:bg-gray-100 rounded-lg transition-colors bg-transparent border-none cursor-pointer">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="bg-gradient-to-br from-blue-50 to-indigo-50 py-12 sm:py-16 md:py-20 lg:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
                        {/* Left Content */}
                        <div className="text-center lg:text-left">
                            <div data-aos="fade-up" className="inline-block bg-blue-100 text-blue-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold mb-4 sm:mb-6">
                                LEARN AT YOUR OWN PACE
                            </div>
                            <h1 data-aos="fade-up" data-aos-delay="100" className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
                                Master English<br />with <span className="text-blue-600">Confidence</span>
                            </h1>
                            <p data-aos="fade-up" data-aos-delay="200" className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0">
                                Join 2,000+ students who are learning English through our expert-led courses and start speaking with confidence today!
                            </p>

                            {/* CTA Buttons */}
                            <div data-aos="fade-up" data-aos-delay="300" className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 mb-6 sm:mb-8 justify-center lg:justify-start">
                                <button className="bg-blue-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all transform hover:scale-105 border-none cursor-pointer flex items-center justify-center gap-2 text-sm sm:text-base">
                                    Get Started Now
                                    <span>→</span>
                                </button>
                                <button className="bg-white text-blue-600 px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all border border-blue-600 cursor-pointer flex items-center justify-center gap-2 text-sm sm:text-base">
                                    <span>▶</span>
                                    Watch Demo
                                </button>
                            </div>

                            {/* Student Avatars */}
                            <div data-aos="fade-up" data-aos-delay="400" className="flex items-center gap-3 justify-center lg:justify-start">
                                <div className="flex -space-x-2">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 border-2 border-white"></div>
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 border-2 border-white"></div>
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-400 border-2 border-white"></div>
                                </div>
                                <div className="text-xs sm:text-sm">
                                    <div className="font-semibold text-gray-900">4,392+ happy students</div>
                                </div>
                            </div>
                        </div>

                        {/* Right Image */}
                        <div className="relative mt-8 lg:mt-0" data-aos="fade-left" data-aos-delay="200">
                            <div className="bg-gradient-to-br from-orange-100 to-amber-100 rounded-2xl p-6 sm:p-8 aspect-[4/3] flex items-center justify-center transform hover:scale-105 transition-transform duration-300">
                                <div className="text-center">
                                    <div className="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4 animate-bounce">👥</div>
                                    <p className="text-gray-600 font-medium text-sm sm:text-base">Students Learning Together</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Choose Section */}
            <section className="py-12 sm:py-16 md:py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-10 sm:mb-12 md:mb-16" data-aos="fade-up">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 px-4">Why Choose EnglishFlow?</h2>
                        <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">Experience a platform where learning English is fun, engaging and effectively tailored to your needs</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {/* Feature 1 */}
                        <div className="bg-blue-50 rounded-xl p-8 hover:shadow-lg transition-shadow" data-aos="fade-up" data-aos-delay="100">
                            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-6">
                                <span className="text-white text-2xl">👨‍🏫</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Certified Tutors</h3>
                            <p className="text-gray-600">Learn from certified speakers with 10+ years of teaching experience to help you reach your goals</p>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-purple-50 rounded-xl p-8 hover:shadow-lg transition-shadow" data-aos="fade-up" data-aos-delay="200">
                            <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-6">
                                <span className="text-white text-2xl">📅</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Flexible Schedule</h3>
                            <p className="text-gray-600">24/7 access to courses. Study at your own pace and schedule to fit your lifestyle</p>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-indigo-50 rounded-xl p-8 hover:shadow-lg transition-shadow" data-aos="fade-up" data-aos-delay="300">
                            <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center mb-6">
                                <span className="text-white text-2xl">🎯</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Interactive Exercises</h3>
                            <p className="text-gray-600">Practice with real-life scenarios, quizzes, and interactive exercises to improve your skills</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Popular Courses */}
            <section className="py-12 sm:py-16 md:py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 sm:mb-10 md:mb-12" data-aos="fade-right">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Popular Courses</h2>
                        <a href="#all-courses" className="text-blue-600 font-semibold hover:text-blue-700 no-underline flex items-center gap-2 text-sm sm:text-base">
                            View All Courses
                            <span>→</span>
                        </a>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {/* Course 1 */}
                        <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow" data-aos="fade-up" data-aos-delay="100">
                            <div className="relative">
                                <div className="bg-gradient-to-br from-green-200 to-emerald-300 h-48 flex items-center justify-center">
                                    <span className="text-6xl">🌱</span>
                                </div>
                                <span className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">Popular</span>
                            </div>
                            <div className="p-6">
                                <div className="flex items-center gap-1 mb-3">
                                    <span className="text-yellow-400">★★★★★</span>
                                    <span className="text-gray-600 text-sm ml-2">4.9</span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Business English Mastery</h3>
                                <p className="text-gray-600 mb-4">Master professional English for workplace success and career growth</p>
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                                    <span className="text-xl sm:text-2xl font-bold text-gray-900">$49.99</span>
                                    <button className="bg-blue-600 text-white px-5 sm:px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors border-none cursor-pointer text-sm sm:text-base w-full sm:w-auto">Enroll Now</button>
                                </div>
                            </div>
                        </div>

                        {/* Course 2 */}
                        <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow" data-aos="fade-up" data-aos-delay="200">
                            <div className="relative">
                                <div className="bg-gradient-to-br from-amber-200 to-orange-300 h-48 flex items-center justify-center">
                                    <span className="text-6xl">📚</span>
                                </div>
                                <span className="absolute top-4 left-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">Bestseller</span>
                            </div>
                            <div className="p-6">
                                <div className="flex items-center gap-1 mb-3">
                                    <span className="text-yellow-400">★★★★★</span>
                                    <span className="text-gray-600 text-sm ml-2">4.8</span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">IELTS Preparation</h3>
                                <p className="text-gray-600 mb-4">Complete IELTS prep course with practice tests and expert strategies</p>
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                                    <span className="text-xl sm:text-2xl font-bold text-gray-900">$79.99</span>
                                    <button className="bg-blue-600 text-white px-5 sm:px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors border-none cursor-pointer text-sm sm:text-base w-full sm:w-auto">Enroll Now</button>
                                </div>
                            </div>
                        </div>

                        {/* Course 3 */}
                        <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow" data-aos="fade-up" data-aos-delay="300">
                            <div className="relative">
                                <div className="bg-gradient-to-br from-rose-200 to-pink-300 h-48 flex items-center justify-center">
                                    <span className="text-6xl">💬</span>
                                </div>
                                <span className="absolute top-4 left-4 bg-pink-500 text-white px-3 py-1 rounded-full text-sm font-semibold">Featured</span>
                            </div>
                            <div className="p-6">
                                <div className="flex items-center gap-1 mb-3">
                                    <span className="text-yellow-400">★★★★★</span>
                                    <span className="text-gray-600 text-sm ml-2">5.0</span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Conversational Fluency</h3>
                                <p className="text-gray-600 mb-4">Speak English naturally and confidently in everyday conversations</p>
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                                    <span className="text-xl sm:text-2xl font-bold text-gray-900">$59.99</span>
                                    <button className="bg-blue-600 text-white px-5 sm:px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors border-none cursor-pointer text-sm sm:text-base w-full sm:w-auto">Enroll Now</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-blue-600 to-indigo-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-10 sm:mb-12 md:mb-16" data-aos="fade-up">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4 px-4">What Our Students Say</h2>
                        <p className="text-base sm:text-lg md:text-xl text-blue-100 px-4">Real success stories from our amazing community</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                        {/* Testimonial 1 */}
                        <div className="bg-white rounded-xl p-6 sm:p-8" data-aos="fade-right" data-aos-delay="100">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex-shrink-0"></div>
                                <div>
                                    <h4 className="font-bold text-gray-900">Sarah Johnson</h4>
                                    <p className="text-sm text-gray-600">Marketing Manager, USA</p>
                                </div>
                            </div>
                            <p className="text-gray-700 leading-relaxed">
                                "EnglishFlow has transformed my career! The Business English course helped me communicate effectively in meetings and presentations. The tutors are incredibly supportive and the flexible schedule fits perfectly with my busy lifestyle."
                            </p>
                        </div>

                        {/* Testimonial 2 */}
                        <div className="bg-white rounded-xl p-6 sm:p-8" data-aos="fade-left" data-aos-delay="200">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex-shrink-0"></div>
                                <div>
                                    <h4 className="font-bold text-gray-900">Michael Chen</h4>
                                    <p className="text-sm text-gray-600">Software Engineer, UK</p>
                                </div>
                            </div>
                            <p className="text-gray-700 leading-relaxed">
                                "I've finally achieved my dream IELTS score! I couldn't have done it without the comprehensive preparation course. The practice tests and expert feedback were invaluable. Highly recommend to anyone preparing for IELTS!"
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-12 sm:py-16 md:py-20 bg-gray-900">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6 px-4" data-aos="fade-up">Ready to start your journey?</h2>
                    <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-8 sm:mb-10 px-4" data-aos="fade-up" data-aos-delay="100">
                        Get unlimited access to over 50+ courses and start speaking like a pro!<br className="hidden sm:block" />
                        <span className="sm:inline"> </span>Join the world's largest English learning community.
                    </p>
                    <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4" data-aos="fade-up" data-aos-delay="200">
                        <button className="bg-blue-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg hover:bg-blue-700 transition-all transform hover:scale-105 border-none cursor-pointer w-full sm:w-auto">
                            Create Free Account
                        </button>
                        <button className="bg-transparent text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg hover:bg-white/10 transition-all border-2 border-white cursor-pointer w-full sm:w-auto">
                            View Pricing
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 border-t border-gray-800 py-8 sm:py-10 md:py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8" data-aos="fade-up">
                        {/* Company */}
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold">E</span>
                                </div>
                                <span className="text-xl font-bold text-white">EnglishFlow</span>
                            </div>
                            <p className="text-gray-400 text-sm">
                                Empowering students worldwide to master English with confidence through expert-led courses.
                            </p>
                        </div>

                        {/* Platform */}
                        <div>
                            <h3 className="text-white font-semibold mb-4">PLATFORM</h3>
                            <ul className="space-y-2 list-none p-0">
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors no-underline text-sm">Browse Courses</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors no-underline text-sm">Pricing</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors no-underline text-sm">Free Trial</a></li>
                            </ul>
                        </div>

                        {/* Support */}
                        <div>
                            <h3 className="text-white font-semibold mb-4">SUPPORT</h3>
                            <ul className="space-y-2 list-none p-0">
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors no-underline text-sm">Get in Touch</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors no-underline text-sm">Contact Us</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors no-underline text-sm">Submit Ticket</a></li>
                            </ul>
                        </div>

                        {/* Newsletter */}
                        <div>
                            <h3 className="text-white font-semibold mb-4">NEWSLETTER</h3>
                            <p className="text-gray-400 text-sm mb-4">Stay updated with our latest courses and special offers</p>
                            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors border-none cursor-pointer w-full">
                                Subscribe →
                            </button>
                        </div>
                    </div>

                    <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-gray-400 text-sm m-0">© 2024 EnglishFlow Inc. All rights reserved.</p>
                        <div className="flex gap-6">
                            <a href="#" className="text-gray-400 hover:text-white transition-colors no-underline text-sm">Privacy Policy</a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors no-underline text-sm">Terms of Service</a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors no-underline text-sm">Cookie Settings</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
