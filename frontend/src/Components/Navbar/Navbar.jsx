import React, { useEffect, useState } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import logoImg from "../../assets/Young Drives Logo (1).png";
import "./Navbar.css";

const navLinks = [
  {
    title: "Home",
    id: "home",
  },
  {
    title: "Popular Vehicles",
    id: "about",
  },
  {
    title: "Services",
    id: "services",
  },
  {
    title: "Type",
    id: "type",
  },
  {
    title: "Pricing",
    id: "pricing",
  },
  {
    title: "Features",
    id: "features",
  },
];

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isMobileMenuOpen, setIsMobileMenuOpen] =
    useState(false);

  const [activeSection, setActiveSection] =
    useState("home");


  /* =====================================================
     SCROLL TO HOME SECTION
  ===================================================== */

  const scrollToSection = (id) => {
    const section =
      document.getElementById(id);

    if (!section) {
      return;
    }

    const navbarHeight = 85;

    const sectionPosition =
      section.getBoundingClientRect().top +
      window.scrollY -
      navbarHeight;

    window.scrollTo({
      top: sectionPosition,
      behavior: "smooth",
    });

    setActiveSection(id);
  };


  /* =====================================================
     NAVIGATION HANDLER
     
     If already on Home:
       → scroll directly

     If on another page:
       → navigate to Home
       → then scroll to section
  ===================================================== */

  const handleSectionClick = (id) => {
    setIsMobileMenuOpen(false);

    // Already on Home page
    if (location.pathname === "/") {
      scrollToSection(id);
      return;
    }

    // Go to Home first
    navigate("/");

    // Wait for Home component to render
    setTimeout(() => {
      scrollToSection(id);
    }, 100);
  };


  /* =====================================================
     CONTACT PAGE
  ===================================================== */

  const handleContactClick = () => {
    setIsMobileMenuOpen(false);

    navigate("/contact");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


  /* =====================================================
     ACTIVE SECTION WHILE SCROLLING
     
     Only run this on Home page.
  ===================================================== */

  useEffect(() => {
    if (location.pathname !== "/") {
      setActiveSection("");
      return;
    }

    const handleActiveSection = () => {
      const scrollPosition =
        window.scrollY + 150;

      let currentSection = "home";

      navLinks.forEach((link) => {
        const section =
          document.getElementById(link.id);

        if (!section) return;

        const sectionTop =
          section.offsetTop;

        if (
          scrollPosition >= sectionTop
        ) {
          currentSection = link.id;
        }
      });

      setActiveSection(currentSection);
    };

    window.addEventListener(
      "scroll",
      handleActiveSection,
      {
        passive: true,
      }
    );

    handleActiveSection();

    return () => {
      window.removeEventListener(
        "scroll",
        handleActiveSection
      );
    };
  }, [location.pathname]);


  /* =====================================================
     CLOSE MOBILE MENU WITH ESC
  ===================================================== */

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, []);


  return (
    <header className="navbar">

      <div className="navbar__container">

        {/* =================================================
            LOGO
        ================================================= */}

        <button
          type="button"
          className="navbar__logo"
          onClick={() =>
            handleSectionClick("home")
          }
          aria-label="Go to Home"
        >
          <img
            src={logoImg}
            alt="Young Drives Logo"
            className="navbar__logo-img"
          />

          <span className="navbar__logo-text">
            Young Drives
          </span>
        </button>


        {/* =================================================
            DESKTOP NAVIGATION
        ================================================= */}

        <nav
          className="navbar__nav"
          aria-label="Main Navigation"
        >
          <ul className="navbar__menu">

            {navLinks.map((link) => (
              <li
                key={link.id}
                className="navbar__menu-item"
              >

                <button
                  type="button"
                  onClick={() =>
                    handleSectionClick(link.id)
                  }
                  className={`navbar__link ${
                    activeSection === link.id
                      ? "navbar__link--active"
                      : ""
                  }`}
                >
                  {link.title}
                </button>

              </li>
            ))}

          </ul>
        </nav>


        {/* =================================================
            CONTACT PAGE BUTTON
        ================================================= */}

        <div className="navbar__action">

          <button
            type="button"
            onClick={handleContactClick}
            className="navbar__contact-btn"
          >
            <span>
              Contact Us
            </span>

            <ArrowRight
              className="navbar__btn-icon"
              size={16}
            />
          </button>

        </div>


        {/* =================================================
            MOBILE MENU BUTTON
        ================================================= */}

        <button
          type="button"
          className="navbar__toggle-btn"
          onClick={() =>
            setIsMobileMenuOpen(
              (prev) => !prev
            )
          }
          aria-label={
            isMobileMenuOpen
              ? "Close navigation menu"
              : "Open navigation menu"
          }
          aria-expanded={
            isMobileMenuOpen
          }
        >

          {isMobileMenuOpen ? (
            <X size={24} />
          ) : (
            <Menu size={24} />
          )}

        </button>

      </div>


      {/* ===================================================
          MOBILE NAVIGATION
      =================================================== */}

      <div
        className={`navbar__mobile-menu ${
          isMobileMenuOpen
            ? "navbar__mobile-menu--open"
            : ""
        }`}
      >

        <ul className="navbar__mobile-list">

          {navLinks.map((link) => (
            <li
              key={link.id}
              className="navbar__mobile-item"
            >

              <button
                type="button"
                className={`navbar__mobile-link ${
                  activeSection === link.id
                    ? "navbar__mobile-link--active"
                    : ""
                }`}
                onClick={() =>
                  handleSectionClick(link.id)
                }
              >
                {link.title}
              </button>

            </li>
          ))}


          {/* =================================================
              MOBILE CONTACT
          ================================================= */}

          <li className="navbar__mobile-item">

            <button
              type="button"
              className="navbar__mobile-contact-btn"
              onClick={handleContactClick}
            >
              Contact Us
            </button>

          </li>

        </ul>

      </div>

    </header>
  );
};

export default Navbar;