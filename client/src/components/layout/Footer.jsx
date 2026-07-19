// src/components/layout/Footer.jsx
import React from "react";
import { cn } from "../ui/Button";
import { HiOutlineGithub, HiOutlineLinkedin, HiOutlineTwitter } from "react-icons/hi";
import { colors, spacing } from "../../theme/theme";

/**
 * Premium SaaS footer with logo, navigation columns and social icons.
 */
const Footer = () => {
  return (
    <footer
      className={cn(
        "w-full border-t border-borders bg-white/60 backdrop-blur-sm py-6",
        "mt-auto"
      )}
      style={{ background: "rgba(255,255,255,0.6)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo & tagline */}
        <div>
          <div className="flex items-center mb-2">
            <img src="/assets/logo.svg" alt="APIForge" className="h-8 w-8 mr-2" />
            <span className="text-lg font-semibold" style={{ color: colors.primaryText }}>APIForge</span>
          </div>
          <p className="text-sm text-text-secondary">Build, test and manage APIs in one beautiful workspace.</p>
        </div>

        {/* Columns */}
        <div>
          <h3 className="text-sm font-medium text-text-primary mb-2">Product</h3>
          <ul className="space-y-1 text-sm">
            <li><a href="#" className="text-text-secondary hover:text-primary">Features</a></li>
            <li><a href="#" className="text-text-secondary hover:text-primary">Documentation</a></li>
            <li><a href="#" className="text-text-secondary hover:text-primary">API Reference</a></li>
            <li><a href="#" className="text-text-secondary hover:text-primary">Guides</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-medium text-text-primary mb-2">Resources</h3>
          <ul className="space-y-1 text-sm">
            <li><a href="#" className="text-text-secondary hover:text-primary">Blog</a></li>
            <li><a href="#" className="text-text-secondary hover:text-primary">Changelog</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-medium text-text-primary mb-2">Company</h3>
          <ul className="space-y-1 text-sm">
            <li><a href="#" className="text-text-secondary hover:text-primary">Privacy Policy</a></li>
            <li><a href="#" className="text-text-secondary hover:text-primary">Terms of Service</a></li>
            <li><a href="#" className="text-text-secondary hover:text-primary">Cookie Policy</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom bar with social icons */}
      <div className="mt-6 border-t border-borders pt-4 flex items-center justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-xs text-text-muted">© 2026 Pavithra Borra. All Rights Reserved.</p>
        <div className="flex space-x-4">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-primary">
            <HiOutlineGithub className="h-5 w-5" />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-primary">
            <HiOutlineLinkedin className="h-5 w-5" />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-primary">
            <HiOutlineTwitter className="h-5 w-5" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
