'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { FaEnvelope, FaInstagram, FaLinkedin, FaBars } from 'react-icons/fa';
import useBackgroundMusic from '@/hooks/useBackgroundMusic';
import RetroMuteButton from '@/components/ui/PixelSilenceButton';
import { categories as mainCategories, Category } from '@/lib/sections';

const Header: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isNavOpen, setIsNavOpen] = useState(false);

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const thoughtsCategoryFromQuery = searchParams.get('category') ?? '';

  const { muted, toggleMute } = useBackgroundMusic();

  // Fetch dynamic categories (for Thoughts)
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch('/api/categories');
        if (!res.ok) throw new Error('Failed to fetch categories');
        const data: Category[] = await res.json();
        setCategories(data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchCategories();
  }, []);

  // Build main pages with children safely
  const mainPages = mainCategories.map(cat => ({
    ...cat,
    href: `/${cat.path}`,
    children: (cat.children ?? []).map((sub) => ({
      ...sub,
      parentPath: cat.path, // ensure parent path is available
    })),
  }));

  const isThoughtsPage = pathname.startsWith('/thoughts');
  const isPlacesPage = pathname.startsWith('/places');

  return (
    <header className="bg-[#444444] text-[#e2e8f0] font-[Press_Start_2P]">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-3 relative z-50">
        {/* Logo + Volume */}
        <div className="flex items-center space-x-2">
          <Link href="/" className="text-lg font-bold">
            MySite
          </Link>
          <RetroMuteButton muted={muted} onClick={toggleMute} size={28} />
        </div>

        {/* Desktop top nav */}
        <nav className="hidden md:flex space-x-6 relative">
          {mainPages.map((page) => {
            const showThoughtsDropdown = page.name === 'Thoughts' && categories.length > 0;
            const showPlacesDropdown = page.name === 'Places' && page.children.length > 0;

            return (
              <div key={page.name} className="relative group">
                <Link
                  href={page.children.length && page.path ? '#' : page.href}
                  className={`px-2 py-1 border-2 border-[#e2e8f0] block ${
                    pathname === page.href ? 'bg-[#e2e8f0] text-[#444444]' : 'hover:bg-[#888888]'
                  }`}
                >
                  {page.name}
                </Link>

                {/* Thoughts dropdown */}
                {showThoughtsDropdown && (
                  <div className="absolute top-full left-0 mt-1 bg-[#444444] border-2 border-[#e2e8f0] hidden group-hover:flex flex-col min-w-[120px] z-50">
                    {categories.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/thoughts?category=${encodeURIComponent(cat.name)}`}
                        className={`px-3 py-2 border-b-2 ${
                          cat.name === thoughtsCategoryFromQuery
                            ? 'bg-[#e2e8f0] text-[#444444]'
                            : 'text-[#e2e8f0] hover:bg-[#888888]'
                        }`}
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                )}

                {/* Places dropdown */}
                {showPlacesDropdown && page.path && (
                  <div className="absolute top-full left-0 mt-1 bg-[#444444] border-2 border-[#e2e8f0] hidden group-hover:flex flex-col min-w-[120px] z-50">
                    {page.children.map((sub) => (
                      <Link
                        key={sub.path}
                        href={`/${sub.parentPath}/${sub.path}`}
                        className={`px-3 py-2 border-b-2 ${
                          pathname === `/${sub.parentPath}/${sub.path}`
                            ? 'bg-[#e2e8f0] text-[#444444]'
                            : 'text-[#e2e8f0] hover:bg-[#888888]'
                        }`}
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Right icons */}
        <div className="flex items-center space-x-3">
          <a href="mailto:thomas.trevisan00@gmail.com" title="Email">
            <FaEnvelope className="w-5 h-5" />
          </a>
          <a
            href="https://instagram.com/yourprofile"
            target="_blank"
            rel="noopener noreferrer"
            title="Instagram"
          >
            <FaInstagram className="w-5 h-5" />
          </a>
          <a
            href="https://linkedin.com/in/yourprofile"
            target="_blank"
            rel="noopener noreferrer"
            title="LinkedIn"
          >
            <FaLinkedin className="w-5 h-5" />
          </a>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden ml-2"
            onClick={() => setIsNavOpen(!isNavOpen)}
          >
            <FaBars className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isNavOpen && (
        <div className="md:hidden bg-gray-800 text-white px-4 py-4 space-y-2">
          {mainPages.map((page) => (
            <div key={page.name} className="flex flex-col">
              <button
                onClick={() => page.children.length && setIsNavOpen((prev) => !prev)}
                className="block px-2 py-1 border-2 border-[#e2e8f0] hover:bg-[#888888] text-left"
              >
                {page.name}
              </button>
              {/* Mobile subcategories */}
              {page.children.length > 0 && page.path && (
                page.children.map((sub) => (
                  <Link
                    key={sub.path}
                    href={`/${sub.parentPath}/${sub.path}`}
                    onClick={() => setIsNavOpen(false)}
                    className="block px-4 py-1 border-l-2 border-[#e2e8f0] hover:bg-[#888888]"
                  >
                    {sub.name}
                  </Link>
                ))
              )}
            </div>
          ))}
        </div>
      )}

      {/* Optional Back button for Thoughts or Places */}
      {(isThoughtsPage || isPlacesPage) && (
        <div className="px-4 py-2 text-sm text-gray-300 flex items-center space-x-2">
          <Link href="/" className="hover:text-blue-400 flex items-center">
            ← Back to Home
          </Link>
        </div>
      )}

      {/* Thoughts category tabs for desktop */}
      {isThoughtsPage && categories.length > 0 && (
        <div className="px-4 py-2 flex space-x-1 overflow-x-auto border-t border-gray-600">
          {categories.map((cat) => {
            const selected = cat.name === thoughtsCategoryFromQuery;
            return (
              <Link
                key={cat.id}
                href={`/thoughts?category=${encodeURIComponent(cat.name)}`}
                className={`px-3 py-2 border-2 ${
                  selected
                    ? 'bg-[#e2e8f0] text-[#444444] border-[#e2e8f0]'
                    : 'text-[#e2e8f0] border-[#e2e8f0] hover:bg-[#888888]'
                }`}
              >
                {cat.name}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
};

export default Header;
