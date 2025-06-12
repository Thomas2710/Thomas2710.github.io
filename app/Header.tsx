'use client';
import React, {Suspense, useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { FaInstagram, FaEnvelope, FaLinkedin } from 'react-icons/fa';

const iconStyle: React.CSSProperties = {
  width: '24px',
  height: '24px',
  marginLeft: '12px',
  cursor: 'pointer',
};

const pathToTitle: Record<string, string> = {
  '/': 'Knowledge',
  '/thoughts': 'Thoughts',
};
type Category = {
  id: string;
  name: string;
};

const Header: React.FC = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const categoryFromQuery = searchParams.get('category') ?? '';

  const pageTitle =
    pathname === '/thoughts'
      ? 'Thoughts'
      : pathToTitle[pathname ?? ''] ?? 'Page';

  const closeNav = () => setIsNavOpen(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (!response.ok) throw new Error('Failed to fetch categories');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <>
      {/* Top Header */}
      <header
        style={{
          backgroundColor: '#444444',
          color: 'white',
          padding: '1rem 1.5rem',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          position: 'relative',
          zIndex: 100,
        }}
      >
        {/* Left: ☰ Button */}
        <button
          onClick={() => setIsNavOpen(true)}
          style={{
            fontSize: '1.5rem',
            background: 'none',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            marginTop: '0.25rem',
          }}
          aria-label="Open navigation"
        >
          ☰
        </button>

        {/* Center: Category name */}
        <Suspense>
        {pathname === '/thoughts' && categoryFromQuery && (
          <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
            <h2 style={{ fontSize: '1.25rem', margin: 0, color: '#f0f0f0' }}>
              {categoryFromQuery}
            </h2>
          </div>
        )}
        </Suspense>
        {/* Right: Page title + social links */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          <span style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>
            {pageTitle}
          </span>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            Consigliami qualcosa!!
            <a href="mailto:thomas.trevisan00@gmail.com" title="Email">
              <FaEnvelope style={iconStyle} />
            </a>
            <a
              href="https://instagram.com/yourprofile"
              target="_blank"
              rel="noopener noreferrer"
              title="Instagram"
            >
              <FaInstagram style={iconStyle} />
            </a>
            <a
              href="https://linkedin.com/in/yourprofile"
              target="_blank"
              rel="noopener noreferrer"
              title="LinkedIn"
            >
              <FaLinkedin style={iconStyle} />
            </a>
          </div>
        </div>
      </header>

      {/* Sidebar & Overlay */}
      {isNavOpen && (
        <>
          {/* Overlay */}
          <div
            onClick={closeNav}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 90,
            }}
          />

          {/* Sidebar */}
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '300px',
              height: '100vh',
              backgroundColor: '#333',
              padding: '2rem 1.5rem',
              color: 'white',
              zIndex: 100,
              display: 'flex',
              flexDirection: 'column',
              overflowY: 'auto',
            }}
          >
          <Suspense>
            <nav>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {/* Knowledge */}
                <li style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
                  {pathname === '/' ? (
                    <span style={{ marginRight: '0.5rem' }}>➤</span>
                  ) : (
                    <span style={{ width: '1.25rem', marginRight: '0.5rem' }} />
                  )}
                  <a href="/" style={{ color: 'white', textDecoration: 'none' }}>
                    Knowledge
                  </a>
                </li>

                {/* Thoughts + Categories */}
                <li style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
                  <span style={{ width: '1.25rem', marginRight: '0.5rem' }} />
                  Thoughts
                </li>
                <ul style={{ listStyle: 'none', paddingLeft: '1.5rem' }}>
                  {categories.map((cat) => {
                    const isSelected = pathname === '/thoughts' && categoryFromQuery === cat.name;
                    return (
                      <li
                        key={cat.name}
                        onClick={() => {
                          closeNav();
                          router.push(`/thoughts?category=${encodeURIComponent(cat.name)}`);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          cursor: 'pointer', // Ensure pointer cursor is applied
                          padding: '0.25rem 0',
                          transition: 'background-color 0.3s ease', // Optional: smooth transition for hover effect
                        }}
                        onMouseEnter={(e) => {
                          // Add hover effect
                          e.currentTarget.style.backgroundColor = '#444'; // Highlight on hover
                        }}
                        onMouseLeave={(e) => {
                          // Revert hover effect
                          e.currentTarget.style.backgroundColor = ''; // Revert the background when not hovering
                        }}
                      >
                        {isSelected ? (
                          <span style={{ marginRight: '0.5rem' }}>➤</span>
                        ) : (
                          <span style={{ width: '1.25rem', marginRight: '0.5rem' }} />
                        )}
                        <span style={{ color: 'white' }}>{cat.name}</span>
                      </li>
                    );
                  })}
                </ul>
              </ul>
            </nav>
          </Suspense>
          </div>
        </>
      )}
    </>
  );
};

export default Header;
