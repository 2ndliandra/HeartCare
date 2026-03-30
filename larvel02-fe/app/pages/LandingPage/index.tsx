import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

import Navbar from '../../components/Landing/Navbar';
import HeroSection from '../../components/Landing/HeroSection';
import FeaturesSection from '../../components/Landing/FeaturesSection';
import ImpactSection from '../../components/Landing/ImpactSection';
import Footer from '../../components/Landing/Footer';

const LandingPage: React.FC = () => {
    useEffect(() => {
        AOS.init({
            once: true,
            duration: 800,
            easing: 'ease-out-cubic',
        });
    }, []);

    return (
        <div className="min-h-screen flex flex-col font-sans selection:bg-primary/30 selection:text-primary-900 overflow-x-hidden">
            <Navbar />

            <main className="flex-grow">
                <HeroSection />
                <FeaturesSection />
                <ImpactSection />
            </main>

            <Footer />
        </div>
    );
};

export default LandingPage;
