import React, { useState, useEffect } from "react";
import { Coins, Menu, X, ArrowUpRight, Sun, Leaf } from "lucide-react";

interface NavbarProps {
  activeSection: string;
}

export default function Navbar({ activeSection }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setIsOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // height of navbar
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  const navLinks = [
    { name: "Início", id: "hero" },
    { name: "Mentalidade", id: "mentalidade" },
    { name: "50/30/20", id: "calculadora" },
    { name: "Tracker", id: "rastreador" },
    { name: "Alquimista", id: "alquimista" },
    { name: "Biblioteca", id: "biblioteca" },
    { name: "Jornada", id: "jornada" },
    { name: "O Escudo", id: "escudo" }
  ];

  return (
    <header
      id="main-nav"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#F9FAFB]/80 backdrop-blur-md shadow-xs border-b border-[#dfdfdb]/45 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => scrollToSection("hero")}
          id="nav-logo"
          className="flex items-center gap-2.5 group cursor-pointer text-left focus:outline-none"
        >
          <div className="w-10 h-10 rounded-full bg-linear-to-tr from-amber-100 to-[#faf1a4] border border-[#CA8A04]/25 flex items-center justify-center shadow-xs transition-transform duration-500 group-hover:rotate-12">
            <Leaf className="w-5 h-5 text-[#CA8A04]" />
          </div>
          <div>
            <span className="font-serif text-xl tracking-tight font-semibold text-stone-900 block leading-none">
              VaultLedger
            </span>
            <span className="text-[9px] uppercase tracking-widest font-mono text-stone-500 mt-0.5 block font-semibold">
              VaultLedger · Psicologia & Finanças
            </span>
          </div>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden xl:flex items-center gap-2 lg:gap-4 xl:gap-5">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollToSection(link.id)}
              id={`nav-link-${link.id}`}
              className={`text-sm tracking-wide font-medium transition-all duration-300 relative py-1 cursor-pointer hover:text-[#CA8A04] focus:outline-none ${
                activeSection === link.id
                  ? "text-[#CA8A04] font-semibold"
                  : "text-stone-600"
              }`}
            >
              {link.name}
              {activeSection === link.id && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-[2px] bg-[#CA8A04] rounded-full" />
              )}
            </button>
          ))}
        </nav>

        {/* CTA Button */}
        <div className="hidden xl:flex items-center">
          <button
            onClick={() => scrollToSection("rastreador")}
            id="nav-cta-btn"
            className="group flex items-center gap-1.5 px-4.5 py-2 rounded-full border border-stone-850 text-xs font-semibold uppercase tracking-wider bg-stone-950 text-white hover:bg-[#CA8A04] hover:text-white hover:border-[#CA8A04] transition-all duration-300 cursor-pointer"
          >
            Começar Agora
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          id="mobile-menu-toggle"
          aria-label="Toggle Menu"
          className="xl:hidden p-2 text-stone-700 hover:text-[#CA8A04] transition-colors focus:outline-none"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <div
        id="mobile-drawer"
        className={`fixed inset-y-0 right-0 z-40 w-full max-w-xs bg-[#F9FAFB] border-l border-stone-200/60 p-8 shadow-xl flex flex-col justify-between transition-transform duration-500 ease-in-out transform xl:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="mt-12">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-stone-200/60">
            <span className="font-mono text-xs uppercase tracking-widest text-[#CA8A04]">Navegação</span>
            <button onClick={() => setIsOpen(false)} className="text-stone-400 hover:text-stone-600">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex flex-col gap-6">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                id={`mobile-nav-${link.id}`}
                className={`text-lg font-medium text-left py-1 hover:text-[#CA8A04] transition-colors ${
                  activeSection === link.id
                    ? "text-[#CA8A04] font-semibold border-l-2 border-[#CA8A04] pl-3"
                    : "text-stone-700 pl-0"
                }`}
              >
                {link.name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <button
            onClick={() => scrollToSection("rastreador")}
            id="mobile-nav-cta"
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-stone-900 border border-stone-900 text-white font-medium hover:bg-[#CA8A04] hover:text-white hover:border-[#CA8A04] transition-all duration-300"
          >
            Acessar Rastreador
            <ArrowUpRight className="w-4 h-4" />
          </button>
          <div className="text-center mt-6 text-[10px] font-mono text-stone-400">
            VaultLedger © 2026
          </div>
        </div>
      </div>

      {/* Overlay background for drawer */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-30 bg-black/10 backdrop-blur-xs xl:hidden"
        />
      )}
    </header>
  );
}
