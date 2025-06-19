// components/Header.tsx
'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FaInstagram, FaEnvelope, FaLinkedin } from 'react-icons/fa';

type Category = { id: string; name: string };

const Header: React.FC = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const pathName = usePathname()
  const pageTitle = pathName.charAt(1).toUpperCase() +usePathname().slice(2);
  const searchParams = useSearchParams();
  const categoryFromQuery = searchParams.get('category') ?? '';


  const closeNav = () => setIsNavOpen(false);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch('/api/categories');
        if (!res.ok) throw new Error('Failed to fetch categories');
        const data: Category[] = await res.json();
        setCategories(data);
      } catch (err) {
        console.error('Error loading categories:', err);
      }
    }
    fetchCategories();
  }, []);

  return (
    <Suspense
      fallback={
        <div className="bg-[#444444] text-white p-4 flex items-center justify-center">
          Loading header...
        </div>
      }
    >
      <header className="bg-[#444444] text-white p-4 flex justify-between items-start relative z-50">
        <button
          className="text-white text-2xl focus:outline-none"
          onClick={() => setIsNavOpen(true)}
          aria-label="Open navigation"
        >
          ☰
        </button>

        {pathName === '/thoughts' && categoryFromQuery && (
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <h2 className="text-lg text-gray-200">{categoryFromQuery}</h2>
          </div>
        )}

        <div className="flex flex-col items-end">
          <span className="font-bold text-base mb-1">{pageTitle}</span>
          <div className="flex items-center space-x-3">
            <a href="mailto:thomas.trevisan00@gmail.com" title="Email">
              <FaEnvelope className="w-6 h-6" />
            </a>
            <a
              href="https://instagram.com/yourprofile"
              target="_blank"
              rel="noopener noreferrer"
              title="Instagram"
            >
              <FaInstagram className="w-6 h-6" />
            </a>
            <a
              href="https://linkedin.com/in/yourprofile"
              target="_blank"
              rel="noopener noreferrer"
              title="LinkedIn"
            >
              <FaLinkedin className="w-6 h-6" />
            </a>
          </div>
        </div>
      </header>

      {isNavOpen && (
        <>          
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={closeNav}
          />
          <nav className="fixed inset-y-0 left-0 w-72 bg-gray-800 p-6 overflow-y-auto z-50">
            <ul className="space-y-2">
              <li>
                <Link href="/" passHref
                    onClick={closeNav}
                    className="py-2 px-0 hover:bg-[#444444] rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    <span className="text-white">Knowledge</span>
                </Link>
              </li>

              <li className="mt-4 mb-2  text-gray-400 font-semibold pl-0">
                <span className="w-5 mr-2" />
                Thoughts
              </li>
              {categories.map((cat) => {
                const isSelected = pathName === '/thoughts' && categoryFromQuery === cat.name;
                return (
                  <li key={cat.id}>
                    <Link
                      href={`/thoughts?category=${encodeURIComponent(cat.name)}`}
                      passHref
                        onClick={closeNav}
                        className={`flex items-center py-2 px-1 hover:bg-[#444444] rounded focus:outline-none focus:ring-2 focus:ring-gray-500 ${
                          isSelected ? 'bg-[#444444]' : ''
                        }`}
                      >
                        <span className="w-5 mr-2">
                          {isSelected ? '➤' : ''}
                        </span>
                        <span className="text-white">{cat.name}</span>

                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </>
      )}
    </Suspense>
  );
};

export default Header;
