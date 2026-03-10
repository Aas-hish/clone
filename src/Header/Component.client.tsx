'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import type { Header, Media } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { HeaderNav } from './Nav'
import { CMSLink } from '@/components/Link'

interface HeaderClientProps {
  data: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  const [theme, setTheme] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()

  useEffect(() => { setHeaderTheme(null) }, [pathname]) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
  }, [headerTheme]) // eslint-disable-line react-hooks/exhaustive-deps

  // scroll listener for sticky / transparent-on-top
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // ── Pull settings ──────────────────────────────────────────────────────────
  const logoMedia        = data?.logo as Media | null | undefined
  const logoSrc          = logoMedia?.url ?? null
  const siteName         = (data as any)?.siteName as string | undefined
  const layout           = (data as any)?.layout           || 'logoLeftLinksRight'
  const sticky           = (data as any)?.sticky           !== false
  const transparentOnTop = (data as any)?.transparentOnTop === true
  const bgColor          = (data as any)?.backgroundColor  as string | undefined
  const textColor        = (data as any)?.textColor        as string | undefined
  const borderBottom     = (data as any)?.borderBottom     === true
  const navItems         = (data as any)?.navItems         || []

  // ── Dynamic inline style ───────────────────────────────────────────────────
  const isTransparent = transparentOnTop && !scrolled
  const headerStyle: React.CSSProperties = {
    backgroundColor: isTransparent ? 'transparent' : (bgColor || undefined),
    color: textColor || undefined,
    transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
    boxShadow: scrolled && sticky ? '0 1px 12px rgba(0,0,0,0.08)' : undefined,
    borderBottom: borderBottom ? '1px solid rgba(0,0,0,0.08)' : undefined,
  }

  const positionClass = sticky ? 'sticky top-0 z-50' : 'relative z-20'

  // ── Logo block ─────────────────────────────────────────────────────────────
  const LogoBlock = () => (
    <Link href="/" className="flex items-center gap-2 shrink-0">
      {logoSrc ? (
        <Logo
          loading="eager"
          priority="high"
          src={logoSrc}
          alt={logoMedia?.alt || siteName || 'Logo'}
          className="h-8 w-auto max-w-[160px] object-contain"
        />
      ) : siteName ? (
        <span
          className="text-xl font-bold tracking-tight"
          style={textColor ? { color: textColor } : {}}
        >
          {siteName}
        </span>
      ) : (
        <Logo
          loading="eager"
          priority="high"
          className="invert dark:invert-0"
        />
      )}
    </Link>
  )

  // ── Center links (for logoLeftLinksCenter layout) ──────────────────────────
  const CenterLinks = () => {
    const fsKey = (data as any)?.fontSize   || 'sm'
    const fwKey = (data as any)?.fontWeight || 'medium'
    const fontSizeMap: Record<string, string>   = { sm: '0.875rem', base: '1rem', lg: '1.125rem' }
    const fontWeightMap: Record<string, string> = { normal: '400', medium: '500', semibold: '600', bold: '700' }
    const linkStyle: React.CSSProperties = {
      fontSize:   fontSizeMap[fsKey],
      fontWeight: fontWeightMap[fwKey],
      ...(textColor ? { color: textColor } : {}),
    }
    return (
      <div className="hidden md:flex items-center gap-5 absolute left-1/2 -translate-x-1/2">
        {navItems.map(({ link }: any, i: number) => (
          <CMSLink key={i} {...link} appearance="link" style={linkStyle as any} />
        ))}
      </div>
    )
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <header
      className={`w-full ${positionClass} bg-background`}
      style={headerStyle}
      {...(theme ? { 'data-theme': theme } : {})}
    >
      {layout === 'logoCenterStacked' ? (
        // ── Stacked: logo center on top row, links below ──────────────────
        <div className="container">
          <div className="py-4 flex justify-center">
            <LogoBlock />
          </div>
          <div className="pb-3 flex justify-center">
            <HeaderNav data={data} />
          </div>
        </div>
      ) : layout === 'logoLeftLinksCenter' ? (
        // ── Links centered, logo left, CTA far right ──────────────────────
        <div className="container relative py-4 flex items-center justify-between">
          <LogoBlock />
          <CenterLinks />
          <HeaderNav data={data} />
        </div>
      ) : layout === 'linksCenterLogo' ? (
        // ── Logo centered, links left, CTA right ──────────────────────────
        <div className="container relative py-4 flex items-center justify-between w-full">
          <HeaderNav data={data} />
          <div className="absolute left-1/2 -translate-x-1/2 flex justify-center">
            <LogoBlock />
          </div>
        </div>
      ) : (
        // ── Default: logo left, links + CTA right ────────────────────────
        <div className="container py-4 flex items-center justify-between">
          <LogoBlock />
          <HeaderNav data={data} />
        </div>
      )}
    </header>
  )
}
