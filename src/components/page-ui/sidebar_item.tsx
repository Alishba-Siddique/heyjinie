// src/components/page-ui/sidebar_item.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Corrected import for App Router
import React from 'react';

interface SidebarItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isSidebarActive: boolean; // To control tooltip visibility
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  href,
  icon,
  label,
  isSidebarActive,
}) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <li className="tooltip-wrapper">
      {/* <Link href={href}> */}
        <a className={isActive ? 'at-active' : ''}>
          <em>{icon}</em>
          <span>{label}</span>
        </a>
      {/* </Link> */}
      {!isSidebarActive && <div className="tooltip">{label}</div>}
      <style jsx>{`
        /* Ensure span is hidden when sidebar is not active, if not handled by global CSS */
        /* This can be removed if global CSS already handles it based on .at-sidebarwrapper:not(.at-active) */
        .at-sidebarwrapper:not(.at-active) .at-nav ul li a span {
          display: none;
        }
        .at-sidebarwrapper:not(.at-active) .at-nav ul li a {
          width: 36px; /* Ensure icon-only width */
          justify-content: center; /* Center icon */
        }
      `}</style>
    </li>
  );
};

export default SidebarItem;