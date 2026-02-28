'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SearchIcon, MenuIcon, XIcon } from 'lucide-react'

import type { Header as HeaderType } from '@/payload-types'
import { CMSLink } from '@/components/Link'

// ─── font-size map ────────────────────────────────────────────────────────────
const fontSizeMap: Record<string, string> = {
  sm: '0.875rem',
  base: '1rem',
  lg: '1.125rem',
}

// ─── font-weight map ──────────────────────────────────────────────────────────
const fontWeightMap: Record<string, string> = {
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
}

interface HeaderNavProps {
  data: HeaderType
}

export const HeaderNav: React.FC<HeaderNavProps> = ({ data }) => {
  const navItems = data?.navItems || []
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // pull settings with sensible defaults
  const showSearch = data?.showSearch !== false
  const ctaEnabled = (data as any)?.ctaButton?.enabled
  const ctaLabel   = (data as any)?.ctaButton?.label || 'Subscribe'
  const ctaLink    = (data as any)?.ctaButton?.link

  const textColor      = (data as any)?.textColor      || undefined
  const ctaBg          = (data as any)?.ctaButtonColor  || '#6366f1'
  const ctaText        = (data as any)?.ctaButtonTextColor || '#ffffff'
  const fsKey          = (data as any)?.fontSize        || 'sm'
  const fwKey          = (data as any)?.fontWeight      || 'medium'
  const fontSize       = fontSizeMap[fsKey]  || fontSizeMap.sm
  const fontWeight     = fontWeightMap[fwKey] || fontWeightMap.medium

  // close mobile menu on route change
  useEffect(() => { setMobileOpen(false) }, [pathname])

  // close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMobileOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const linkStyle: React.CSSProperties = {
    fontSize,
    fontWeight,
    ...(textColor ? { color: textColor } : {}),
  }

  // shared list of nav links + optional search
  const NavLinks = () => (
    <>
      {navItems.map(({ link }, i) => (
        <CMSLink
          key={i}
          {...link}
          appearance="link"
          className="relative group transition-opacity hover:opacity-70"
          style={linkStyle as any}
        />
      ))}
    </>
  )

  // search icon button
  const SearchBtn = () =>
    showSearch ? (
      <Link
        href="/search"
        aria-label="Search"
        className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
        style={textColor ? { color: textColor } : {}}
      >
        <SearchIcon className="w-[18px] h-[18px]" />
      </Link>
    ) : null

  // CTA button
  const CTAButton = () =>
    ctaEnabled && ctaLink ? (
      <CMSLink
        {...ctaLink}
        appearance="link"
        className="px-4 py-1.5 rounded-full text-sm font-semibold transition-all hover:opacity-90 active:scale-95 shadow-sm"
        style={{ backgroundColor: ctaBg, color: ctaText, fontSize, fontWeight } as any}
      >
        {ctaLabel}
      </CMSLink>
    ) : null

  // hamburger button (mobile)
  const Hamburger = () => (
    <button
      aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
      onClick={() => setMobileOpen((v) => !v)}
      className="p-1.5 rounded-md md:hidden hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
      style={textColor ? { color: textColor } : {}}
    >
      {mobileOpen ? <XIcon className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
    </button>
  )

  // mobile drawer – slide down
  const MobileMenu = () =>
    mobileOpen ? (
      <div
        className="absolute top-full left-0 right-0 z-50 shadow-xl overflow-hidden
                   animate-[slideDown_0.2s_ease-out]"
        style={{ backgroundColor: (data as any)?.backgroundColor || 'white' }}
      >
        <div className="flex flex-col gap-0 px-4 pb-4 pt-2">
          {navItems.map(({ link }, i) => (
            <CMSLink
              key={i}
              {...link}
              appearance="link"
              className="py-3 border-b border-black/5 dark:border-white/5 last:border-none
                         hover:opacity-70 transition-opacity"
              style={linkStyle as any}
            />
          ))}

          {ctaEnabled && ctaLink && (
            <div className="mt-3">
              <CMSLink
                {...ctaLink}
                appearance="link"
                className="inline-block w-full text-center px-4 py-2.5 rounded-full text-sm font-semibold"
                style={{ backgroundColor: ctaBg, color: ctaText } as any}
              >
                {ctaLabel}
              </CMSLink>
            </div>
          )}

          {showSearch && (
            <Link
              href="/search"
              className="flex items-center gap-2 py-3 mt-1 hover:opacity-70 transition-opacity"
              style={linkStyle}
            >
              <SearchIcon className="w-4 h-4" />
              <span>Search</span>
            </Link>
          )}
        </div>
      </div>
    ) : null

  // ── layout variants ─────────────────────────────────────────────────────────
  const layout = (data as any)?.layout || 'logoLeftLinksRight'

  if (layout === 'logoCenterStacked') {
    // This layout is rendered at the wrapper level — we only output the nav row here
    return (
      <div className="flex items-center gap-4" ref={menuRef}>
        <NavLinks />
        <SearchBtn />
        <CTAButton />
        <Hamburger />
        <MobileMenu />
      </div>
    )
  }

  if (layout === 'logoLeftLinksCenter') {
    // links are centered via the wrapper — we just return the right side
    return (
      <div className="flex items-center gap-4" ref={menuRef}>
        <SearchBtn />
        <CTAButton />
        <Hamburger />
        <MobileMenu />
      </div>
    )
  }

  if (layout === 'linksCenterLogo') {
    // logo is center — nav items go left, CTA+search go right
    return (
      <>
        {/* left: nav items */}
        <div className="hidden md:flex items-center gap-5">
          <NavLinks />
        </div>
        {/* right: search + CTA + hamburger */}
        <div className="flex items-center gap-3" ref={menuRef}>
          <SearchBtn />
          <CTAButton />
          <Hamburger />
          <MobileMenu />
        </div>
      </>
    )
  }

  // default: logoLeftLinksRight
  return (
    <div className="flex items-center gap-5" ref={menuRef}>
      {/* desktop links */}
      <div className="hidden md:flex items-center gap-5">
        <NavLinks />
      </div>
      <SearchBtn />
      <CTAButton />
      <Hamburger />
      <MobileMenu />
    </div>
  )
}
