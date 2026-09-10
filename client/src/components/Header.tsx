import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

interface NavItem {
  id: string;
  num: string;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: "vision", num: "01", label: "OVERVIEW" },
  { id: "tracks", num: "02", label: "TRACKS" },
  { id: "timeline", num: "03", label: "TIMELINE" },
  { id: "prizes", num: "04", label: "PRIZES" },
  { id: "rules", num: "05", label: "RULES" },
  { id: "venue", num: "06", label: "VENUE" },
  { id: "faq", num: "07", label: "FAQ" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("vision");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Determine active section based on scroll position
      const scrollPosition = window.scrollY + 100;
      for (let i = NAV_ITEMS.length - 1; i >= 0; i--) {
        const item = NAV_ITEMS[i];
        const el = document.getElementById(item.id);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSection(item.id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className={`dark-header ${scrolled ? "dark-header-scrolled" : ""}`}>
      <div className="dark-nav-wrap">
        <div className="dark-brand-group">
          <a className="dark-brand" href="/" aria-label="CodeAI home">
            <img
              src={`${import.meta.env.BASE_URL}images/codeai-logo-white.png`}
              alt="CodeAI Logo"
              className="dark-brand-logo"
            />
          </a>
          <span className="dark-brand-divider" aria-hidden="true" />
          <a
            className="dark-brand dark-brand-somaiya"
            href="https://kjsit.somaiya.edu/en"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="K J Somaiya Institute of Technology"
          >
            <img
              src={`${import.meta.env.BASE_URL}images/somaiya-logo.png`}
              alt="K J Somaiya Institute of Technology"
              className="dark-brand-logo dark-brand-logo-somaiya"
            />
          </a>
        </div>

        <nav className="dark-nav">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={activeSection === item.id ? "nav-current" : ""}
              onClick={(e) => handleNavClick(e, item.id)}
            >
              <span>{item.num}</span> {item.label}
            </a>
          ))}
        </nav>

        <div className="dark-header-actions">
          <a
            className="header-about"
            href="https://codeaikjsit.github.io/clubwebsite/"
            target="_blank"
            rel="noopener noreferrer"
          >
            ABOUT CODEAI <span>↗</span>
          </a>

          <a
            className="header-join"
            href="https://linktr.ee/codeai.kjsit"
            target="_blank"
            rel="noopener noreferrer"
          >
            JOIN US <span>↗</span>
          </a>

          <button
            className="mobile-menu-button dark-menu-button"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 text-white" />
            ) : (
              <Menu className="w-5 h-5 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="dark-mobile-menu">
          <nav className="dark-mobile-nav">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={activeSection === item.id ? "nav-current" : ""}
                onClick={(e) => handleNavClick(e, item.id)}
              >
                <span>{item.num}</span> {item.label}
              </a>
            ))}
            <div className="dark-mobile-buttons">
              <a
                className="header-about dark-mobile-about"
                href="https://codeaikjsit.github.io/clubwebsite/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
              >
                ABOUT CODEAI <span>↗</span>
              </a>
              <a
                className="header-join dark-mobile-join"
                href="https://linktr.ee/codeai.kjsit"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
              >
                JOIN US <span>↗</span>
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

export default Header;
