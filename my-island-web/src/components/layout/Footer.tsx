import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
    return (
        <footer className="bg-[#1a2632] text-gray-300 mt-auto">
            <div className="max-w-6xl mx-auto px-4 py-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {/* My Island */}
                    <div>
                        <h3 className="text-white font-bold text-sm mb-4">My Island</h3>
                        <ul className="space-y-2.5">
                            <li><Link to="/" className="text-sm hover:text-white transition-colors">Home</Link></li>
                            <li><Link to="/faq" className="text-sm hover:text-white transition-colors">FAQ & Pricing</Link></li>
                            <li><Link to="/become-a-host" className="text-sm hover:text-white transition-colors">Become a Host</Link></li>
                            <li><Link to="/become-a-supplier" className="text-sm hover:text-white transition-colors">Become a Supplier</Link></li>
                        </ul>
                    </div>

                    {/* Explore */}
                    <div>
                        <h3 className="text-white font-bold text-sm mb-4">Explore</h3>
                        <ul className="space-y-2.5">
                            <li><Link to="/search" className="text-sm hover:text-white transition-colors">Search Campsites</Link></li>
                            <li><Link to="/marketplace" className="text-sm hover:text-white transition-colors">Marketplace</Link></li>
                            <li><Link to="/explore" className="text-sm hover:text-white transition-colors">Explore Map</Link></li>
                            <li><Link to="/journal" className="text-sm hover:text-white transition-colors">Travel Journal</Link></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="text-white font-bold text-sm mb-4">Legal</h3>
                        <ul className="space-y-2.5">
                            <li><Link to="/privacy" className="text-sm hover:text-white transition-colors">Privacy Policy</Link></li>
                            <li><Link to="/terms" className="text-sm hover:text-white transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-white font-bold text-sm mb-4">Contact</h3>
                        <ul className="space-y-2.5">
                            <li className="text-sm">support@myisland.ie</li>
                            <li className="text-sm">privacy@myisland.ie</li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-700 mt-8 pt-6 text-center">
                    <p className="text-xs text-gray-500">&copy; {new Date().getFullYear()} My Island Ltd. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};
