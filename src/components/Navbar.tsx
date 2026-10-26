import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Calendar, Menu, X, Phone, ChevronDown, Image as ImageIcon, Video, Film, Sparkles, User, LogOut, Gift, ShieldCheck } from 'lucide-react';
import { PhoenixLogo } from './PhoenixLogo';
import { STUDIO_INFO } from '../data/studioData';
import { useMemberAuth, triggerAuthModal } from '../lib/memberAuth';

interface NavbarProps {
  onOpenBooking: (artistId?: string, serviceId?: string) => void;
  onOpenRewards?: (tab?: 'birthday' | 'referral') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenBooking, onOpenRewards }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [galleryDropdownOpen, setGalleryDropdownOpen] = useState(false);
  const [memberDropdownOpen, setMemberDropdownOpen] = useState(false);
  const [mobileGalleryExpanded, setMobileGalleryExpanded] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const memberDropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { user, isAuthenticated, signOut } = useMemberAuth();

  // Close dropdown on route change or click outside
  useEffect(() => {
    setGalleryDropdownOpen(false);
    setMemberDropdownOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setGalleryDropdownOpen(false);
      }
      if (memberDropdownRef.current && !memberDropdownRef.current.contains(e.target as Node)) {
        setMemberDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Rewards 🎁', path: '/#rewards' },
    { name: 'About', path: '/about' },
    { name: 'Artists', path: '/artists' },
    { name: 'Experience', path: '/experience' },
    { name: 'Gallery', path: '/gallery', isDropdown: true },
    { name: 'Reviews', path: '/reviews' },
    { name: 'Contact', path: '/contact' },
  ];

  const isGalleryActive = location.pathname.startsWith('/gallery');

  return (
    <header className="sticky top-0 z-40 bg-[#0B0B0B]/95 backdrop-blur-md border-b border-[#222222]/80 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between gap-3 lg:gap-6">
        {/* Left: Round Phoenix Logo */}
        <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
          <PhoenixLogo size={42} className="shadow-lg shadow-black/40" />
          <div className="flex flex-col">
            <span className="font-serif font-bold text-white tracking-wider text-sm sm:text-base lg:text-lg group-hover:text-[#FFD60A] transition-colors leading-tight">
              Phoenix Tattooz
            </span>
            <span className="text-[9px] sm:text-[10px] tracking-[0.2em] uppercase text-zinc-400 font-medium">
              Studio &amp; Academy
            </span>
          </div>
        </Link>

        {/* Center: Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-0.5 lg:gap-1.5 xl:gap-3">
          {navLinks.map((link) => {
            if (link.isDropdown) {
              return (
                <div
                  key={link.name}
                  ref={dropdownRef}
                  className="relative"
                  onMouseEnter={() => setGalleryDropdownOpen(true)}
                  onMouseLeave={() => setGalleryDropdownOpen(false)}
                >
                  <button
                    onClick={() => setGalleryDropdownOpen(!galleryDropdownOpen)}
                    className={`relative py-1.5 px-2 text-xs lg:text-[13.5px] font-medium transition-colors flex items-center gap-1 cursor-pointer ${
                      isGalleryActive
                        ? 'text-white font-semibold'
                        : 'text-zinc-300 hover:text-white'
                    }`}
                  >
                    <span>{link.name}</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-[#FFD60A] transition-transform duration-200 ${
                        galleryDropdownOpen ? 'rotate-180' : ''
                      }`}
                    />
                    {isGalleryActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#FFD60A] rounded-full" />
                    )}
                  </button>

                  {/* Dropdown Menu Container */}
                  {galleryDropdownOpen && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="w-72 bg-[#121212] border border-[#2B2B2B] rounded-2xl p-2 shadow-2xl shadow-black/80 backdrop-blur-xl space-y-1">
                        <div className="px-3 py-1.5 border-b border-zinc-800/80 flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                            Studio Showcase
                          </span>
                          <span className="text-[10px] bg-[#FFD60A]/10 text-[#FFD60A] px-2 py-0.5 rounded-full font-mono font-bold">
                            Live Work
                          </span>
                        </div>

                        {/* TOP OPTION: Photo Gallery */}
                        <Link
                          to="/gallery?tab=photos"
                          onClick={() => setGalleryDropdownOpen(false)}
                          className={`group/item flex items-center gap-3 p-2.5 rounded-xl transition-all ${
                            location.pathname === '/gallery' && !location.search.includes('videos')
                              ? 'bg-zinc-800/90 text-white'
                              : 'text-zinc-300 hover:text-white hover:bg-zinc-900/90'
                          }`}
                        >
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFD60A]/20 to-amber-500/10 border border-[#FFD60A]/30 flex items-center justify-center shrink-0 group-hover/item:scale-105 group-hover/item:border-[#FFD60A] transition-all">
                            <ImageIcon className="w-5 h-5 text-[#FFD60A]" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-serif font-bold text-sm text-white group-hover/item:text-[#FFD60A] transition-colors">
                                Photo Gallery
                              </span>
                              <span className="text-[9px] font-bold bg-white/10 text-zinc-300 px-1.5 py-0.5 rounded">
                                Photos
                              </span>
                            </div>
                            <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                              Tattoos, piercings &amp; custom flash art
                            </p>
                          </div>
                        </Link>

                        {/* Divider */}
                        <div className="border-t border-zinc-800/80 my-1" />

                        {/* LOWER / BOTTOM SECTION: Video Gallery */}
                        <Link
                          to="/gallery?tab=videos"
                          onClick={() => setGalleryDropdownOpen(false)}
                          className={`group/item flex items-center gap-3 p-2.5 rounded-xl transition-all ${
                            location.search.includes('videos')
                              ? 'bg-[#FFD60A]/15 border border-[#FFD60A]/40 text-white'
                              : 'text-zinc-300 hover:text-white hover:bg-zinc-900/90'
                          }`}
                        >
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-red-500/10 border border-amber-500/30 flex items-center justify-center shrink-0 group-hover/item:scale-105 group-hover/item:border-amber-400 transition-all">
                            <Film className="w-5 h-5 text-amber-400" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-serif font-bold text-sm text-white group-hover/item:text-amber-400 transition-colors">
                                Video Gallery
                              </span>
                              <span className="text-[9px] font-extrabold bg-[#FFD60A] text-black px-1.5 py-0.5 rounded shadow-sm">
                                🎬 Reels
                              </span>
                            </div>
                            <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                              Artist inking, reels &amp; work reveal videos
                            </p>
                          </div>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            return (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={(e) => {
                  if (link.path.includes('#')) {
                    const hash = link.path.split('#')[1];
                    const elem = document.getElementById(hash);
                    if (elem) {
                      elem.scrollIntoView({ behavior: 'smooth' });
                    }
                  }
                }}
                className={({ isActive }) =>
                  `relative py-1.5 px-2 text-xs lg:text-[13.5px] font-medium transition-colors ${
                    isActive
                      ? 'text-white font-semibold'
                      : 'text-zinc-300 hover:text-white'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span>{link.name}</span>
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#FFD60A] rounded-full" />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Right: Member Club & Book Appointment */}
        <div className="hidden sm:flex items-center gap-3 shrink-0">
          {isAuthenticated && user ? (
            /* Authenticated Member Badge & Dropdown */
            <div className="relative" ref={memberDropdownRef}>
              <button
                onClick={() => setMemberDropdownOpen(!memberDropdownOpen)}
                className="relative w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-full bg-[#121418] hover:bg-[#1C1F26] border border-[#FFD60A]/70 hover:border-[#FFD60A] flex items-center justify-center transition-all duration-200 shadow-md shadow-black/50 hover:shadow-[0_0_12px_rgba(255,214,10,0.3)] hover:scale-105 active:scale-95 cursor-pointer group"
                title={`${user.name} (Member Club)`}
                aria-label="Member Profile Menu"
              >
                <div className="w-6.5 h-6.5 sm:w-7 sm:h-7 rounded-full bg-gradient-to-tr from-amber-600 to-[#FFD60A] text-black font-black text-xs flex items-center justify-center shadow-xs">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'M'}
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-emerald-400 rounded-full border-2 border-[#0B0B0B] shadow-[0_0_6px_#10B981]" />
              </button>

              {memberDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-[#121418] border border-zinc-800 rounded-2xl p-2.5 shadow-2xl shadow-black/90 backdrop-blur-xl z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-2 border-b border-zinc-800">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
                      Member Account
                    </span>
                    <div className="font-bold text-sm text-white truncate">{user.name}</div>
                    <div className="text-[11px] text-zinc-400 truncate">{user.email}</div>
                  </div>

                  <div className="py-1 space-y-1">
                    <button
                      onClick={() => {
                        setMemberDropdownOpen(false);
                        if (onOpenRewards) onOpenRewards('birthday');
                        else {
                          const elem = document.getElementById('rewards');
                          if (elem) elem.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                      className="w-full flex items-center justify-between p-2 rounded-xl text-xs font-medium text-zinc-300 hover:text-white hover:bg-zinc-800/80 transition-colors cursor-pointer text-left"
                    >
                      <span className="flex items-center gap-2">
                        <Gift className="w-4 h-4 text-[#FFD60A]" />
                        <span>My Gifts &amp; Codes</span>
                      </span>
                      <span className="text-[10px] bg-amber-500/20 text-[#FFD60A] font-bold px-1.5 py-0.5 rounded">
                        {user.claims?.birthday ? 'Saved' : 'Unlock'}
                      </span>
                    </button>

                    <button
                      onClick={() => {
                        setMemberDropdownOpen(false);
                        signOut();
                      }}
                      className="w-full flex items-center gap-2 p-2 rounded-xl text-xs font-medium text-rose-300 hover:text-rose-200 hover:bg-rose-950/40 transition-colors cursor-pointer text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Guest / Unauthenticated: Circular, smaller, noticeable Sign In icon button */
            <button
              onClick={() => triggerAuthModal({ mode: 'signin', title: 'Member Sign In', subtitle: 'Sign in to access your saved 15% discount and rewards.' })}
              className="relative w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-full bg-[#121418] hover:bg-[#1C1F26] border border-[#FFD60A]/70 hover:border-[#FFD60A] text-[#FFD60A] flex items-center justify-center transition-all duration-200 shadow-md shadow-black/50 hover:shadow-[0_0_12px_rgba(255,214,10,0.3)] hover:scale-105 active:scale-95 cursor-pointer group"
              title="Member Club / Sign In"
              aria-label="Member Club / Sign In"
            >
              <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FFD60A] group-hover:scale-110 transition-transform" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-[#FFD60A] rounded-full border-2 border-[#0B0B0B] shadow-[0_0_6px_#FFD60A]" />
            </button>
          )}

          <button
            onClick={() => onOpenBooking()}
            className="flex items-center gap-1.5 bg-[#FFD60A] hover:bg-[#ffe033] active:scale-[0.98] text-[#0B0B0B] font-highlight font-extrabold text-xs sm:text-[13px] px-3.5 sm:px-4 py-2 sm:py-2.2 rounded-lg transition-all duration-200 cursor-pointer shadow-sm tracking-tight"
          >
            <span>Book Appointment</span>
            <Calendar className="w-3.5 h-3.5 text-[#0B0B0B]" />
          </button>
        </div>

        {/* Mobile Header Controls: Member Sign Up Icon + Quick Booking + Hamburger */}
        <div className="flex items-center gap-2 md:hidden">
          {isAuthenticated && user ? (
            <button
              onClick={() => {
                if (onOpenRewards) onOpenRewards('birthday');
                else {
                  const elem = document.getElementById('rewards');
                  if (elem) elem.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="relative w-8.5 h-8.5 rounded-full bg-[#121418] border border-[#FFD60A]/80 text-[#FFD60A] flex items-center justify-center shadow-xs active:scale-95 transition-all cursor-pointer"
              title={`${user.name} (Member Club)`}
              aria-label="Member Profile"
            >
              <span className="text-[11px] font-black">{user.name ? user.name.charAt(0).toUpperCase() : 'M'}</span>
              <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-emerald-400 rounded-full border border-[#0B0B0B]" />
            </button>
          ) : (
            <button
              onClick={() => triggerAuthModal({ mode: 'signup', title: 'Join Member Club', subtitle: 'Sign up to unlock 15% discount rewards and gifts.' })}
              className="relative w-8.5 h-8.5 rounded-full bg-[#121418] border border-[#FFD60A]/80 text-[#FFD60A] flex items-center justify-center shadow-xs active:scale-95 transition-all cursor-pointer"
              title="Sign Up / Member Club"
              aria-label="Sign In or Sign Up"
            >
              <User className="w-3.5 h-3.5 text-[#FFD60A]" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#FFD60A] rounded-full border border-[#0B0B0B] shadow-[0_0_4px_#FFD60A]" />
            </button>
          )}

          <button
            onClick={() => onOpenBooking()}
            aria-label="Book appointment"
            className="w-8.5 h-8.5 flex items-center justify-center bg-[#FFD60A] text-[#0B0B0B] rounded-lg shadow-xs active:scale-95 transition-transform cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-[#0B0B0B]" />
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="w-8.5 h-8.5 flex items-center justify-center text-zinc-300 hover:text-white rounded-lg bg-[#141518] border border-zinc-800 focus:outline-none cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0F0F0F] border-b border-[#222222] px-5 py-5 space-y-4 animate-in slide-in-from-top-4 duration-200 max-h-[85vh] overflow-y-auto">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => {
              if (link.isDropdown) {
                return (
                  <div key={link.name} className="space-y-1.5 pt-1">
                    <button
                      onClick={() => setMobileGalleryExpanded(!mobileGalleryExpanded)}
                      className={`w-full text-base font-medium py-2.5 px-3 rounded-xl transition-colors flex items-center justify-between cursor-pointer ${
                        isGalleryActive
                          ? 'bg-zinc-800 text-[#FFD60A] font-semibold'
                          : 'text-zinc-200 hover:text-white hover:bg-zinc-900'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>Gallery Menu</span>
                        <span className="text-[10px] bg-[#FFD60A]/20 text-[#FFD60A] px-2 py-0.5 rounded-full font-bold">
                          Photos &amp; Videos
                        </span>
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-[#FFD60A] transition-transform duration-200 ${
                          mobileGalleryExpanded ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {/* Sub-items list */}
                    {mobileGalleryExpanded && (
                      <div className="pl-2 space-y-1.5 border-l-2 border-[#FFD60A]/40 ml-3 py-1">
                        {/* Top: Photo Gallery */}
                        <Link
                          to="/gallery?tab=photos"
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex items-center justify-between py-2 px-3 rounded-lg text-sm transition-colors ${
                            location.pathname === '/gallery' && !location.search.includes('videos')
                              ? 'bg-[#FFD60A] text-black font-bold'
                              : 'text-zinc-300 hover:text-white hover:bg-zinc-900'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <ImageIcon className="w-4 h-4 text-[#FFD60A]" />
                            <span>📷 Photo Gallery</span>
                          </div>
                          <span className="text-[10px] text-zinc-400">Tattoos &amp; Piercing</span>
                        </Link>

                        {/* Bottom: Video Gallery */}
                        <Link
                          to="/gallery?tab=videos"
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex items-center justify-between py-2 px-3 rounded-lg text-sm transition-colors ${
                            location.search.includes('videos')
                              ? 'bg-[#FFD60A] text-black font-bold'
                              : 'text-zinc-300 hover:text-white hover:bg-zinc-900'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Film className="w-4 h-4 text-amber-400" />
                            <span>🎬 Video Gallery &amp; Reels</span>
                          </div>
                          <span className="text-[10px] text-[#FFD60A] font-semibold">Artist Works</span>
                        </Link>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (link.path.includes('#')) {
                      const hash = link.path.split('#')[1];
                      setTimeout(() => {
                        const elem = document.getElementById(hash);
                        if (elem) {
                          elem.scrollIntoView({ behavior: 'smooth' });
                        }
                      }, 100);
                    }
                  }}
                  className={({ isActive }) =>
                    `text-base font-medium py-2 px-3 rounded-xl transition-colors flex items-center justify-between ${
                      isActive
                        ? 'bg-zinc-800/80 text-[#FFD60A] font-semibold'
                        : 'text-zinc-200 hover:text-white hover:bg-zinc-900'
                    }`
                  }
                >
                  <span>{link.name}</span>
                  {link.name === 'Home' && <span className="text-xs text-zinc-500">Main</span>}
                </NavLink>
              );
            })}
          </nav>
          
          <div className="pt-4 border-t border-zinc-800 space-y-2.5">
            {isAuthenticated && user ? (
              <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#FFD60A] text-black font-black text-xs flex items-center justify-center">
                      {user.name ? user.name.charAt(0).toUpperCase() : 'M'}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">{user.name}</span>
                      <span className="text-[10px] text-zinc-400 block">{user.email}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      signOut();
                    }}
                    className="text-[11px] font-bold text-rose-400 hover:underline"
                  >
                    Sign Out
                  </button>
                </div>
                {user.claims?.birthday && (
                  <div className="text-[10px] bg-amber-500/10 text-amber-300 border border-amber-500/20 px-2 py-1 rounded font-mono">
                    Birthday Code: {user.claims.birthday.code}
                  </div>
                )}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (onOpenRewards) onOpenRewards('birthday');
                    else {
                      const elem = document.getElementById('rewards');
                      if (elem) elem.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="w-full text-center text-xs font-bold text-[#FFD60A] py-1 hover:underline"
                >
                  View My Gifts &amp; Codes &rarr;
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    triggerAuthModal({ mode: 'signin', title: 'Member Sign In', subtitle: 'Sign in to access your rewards.' });
                  }}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-zinc-900 text-zinc-200 hover:text-white border border-zinc-700 text-xs font-semibold cursor-pointer"
                >
                  <User className="w-3.5 h-3.5 text-[#FFD60A]" />
                  <span>Sign In</span>
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    triggerAuthModal({ mode: 'signup', title: 'Join Member Club', subtitle: 'Claim your 15% discount voucher.' });
                  }}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-[#FFD60A]/15 border border-[#FFD60A]/50 text-[#FFD60A] text-xs font-bold cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Sign Up (Free)</span>
                </button>
              </div>
            )}

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="w-full flex items-center justify-center gap-2 bg-[#FFD60A] text-[#0B0B0B] font-semibold text-sm py-3 rounded-lg shadow-md cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment</span>
            </button>
            <a
              href={`tel:${STUDIO_INFO.phone}`}
              className="w-full flex items-center justify-center gap-2 border border-zinc-700 text-zinc-200 text-xs py-2.5 rounded-lg hover:border-zinc-500"
            >
              <Phone className="w-3.5 h-3.5 text-[#FFD60A]" />
              <span>Call: {STUDIO_INFO.phone}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
