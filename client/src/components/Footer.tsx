import React, { useState, useRef, useEffect } from "react";
import { Github, Star } from "lucide-react";
import { LinkedInCustomIcon, InstagramCustomIcon } from "./CustomSocialIcons";

export function Footer() {
  const [showCredit, setShowCredit] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!showCredit) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setShowCredit(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showCredit]);

  return (
    <footer className="dark-footer">
      <div className="footer-main-dark">
        <a className="footer-brand-dark" href="/" aria-label="CodeAI home">
          <img
            src={`${import.meta.env.BASE_URL}images/codeai-logo-white.png`}
            alt="CodeAI"
            className="footer-logo-dark"
          />
        </a>

        <p className="footer-address-dark">
          KJ Somaiya Institute of Technology<br />
          Sion — Mumbai 400 022
        </p>

        <div className="footer-links-dark">
          <a
            href="https://github.com/codeaikjsit"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            title="GitHub"
            className="footer-social-link"
          >
            <Github className="w-4 h-4" />
          </a>
          <a
            href="https://www.linkedin.com/company/code-ai-kjsit/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            title="LinkedIn"
            className="footer-social-link"
          >
            <LinkedInCustomIcon className="w-4 h-4" />
          </a>
          <a
            href="https://www.instagram.com/codeai.kjsit/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            title="Instagram"
            className="footer-social-link"
          >
            <InstagramCustomIcon className="w-4 h-4" />
          </a>

          <div className="footer-credit-wrap">
            <button
              ref={buttonRef}
              className="footer-credit-btn"
              aria-label="Credits"
              title="Credits"
              onClick={() => setShowCredit(!showCredit)}
            >
              <Star className="w-4 h-4" />
            </button>
            {showCredit && (
              <div ref={popupRef} className="footer-credit-popup">
                <div className="footer-credit-popup__arrow" />
                <span className="footer-credit-popup__title">Created by</span>
                <strong className="footer-credit-popup__name">Niharika Maurya</strong>
                <span className="footer-credit-popup__role">CTO</span>
                <a
                  href="mailto:niharika.rm@somaiya.edu"
                  className="footer-credit-popup__email"
                >
                  niharika.rm@somaiya.edu
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="footer-bottom-dark">
        <span className="footer-copy-dark">© 2026 CodeAI student club</span>
        <span className="footer-status-dark">
          Computer Engineering · KJSIT <b className="footer-pulse">●</b>
        </span>
      </div>
    </footer>
  );
}

export default Footer;
