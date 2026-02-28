import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateHeader } from './hooks/revalidateHeader'

export const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: () => true,
  },
  fields: [
    // ── Branding ──────────────────────────────────────────────
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Upload a custom logo. Leave empty to use the default.',
      },
    },
    {
      name: 'siteName',
      type: 'text',
      admin: {
        description: 'Site name shown next to (or instead of) logo.',
        placeholder: 'My Blog',
      },
    },

    // ── Navigation Links ──────────────────────────────────────
    {
      name: 'navItems',
      type: 'array',
      label: 'Navigation Links',
      fields: [
        link({ appearances: false }),
      ],
      maxRows: 8,
      admin: {
        initCollapsed: true,
        description: 'Add links that appear in the navbar.',
        components: {
          RowLabel: '@/Header/RowLabel#RowLabel',
        },
      },
    },

    // ── CTA Button ────────────────────────────────────────────
    {
      name: 'ctaButton',
      type: 'group',
      label: 'Call-to-Action Button',
      admin: {
        description: 'Optional button shown on the right of the navbar.',
      },
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          label: 'Show CTA button',
          defaultValue: false,
        },
        {
          name: 'label',
          type: 'text',
          label: 'Button label',
          defaultValue: 'Subscribe',
          admin: {
            condition: (data) => Boolean(data?.ctaButton?.enabled),
          },
        },
        link({
          appearances: false,
          overrides: {
            name: 'link',
            label: 'Button link',
            admin: {
              condition: (data) => Boolean(data?.ctaButton?.enabled),
            },
          },
        }),
      ],
    },

    // ── Layout & Style ────────────────────────────────────────
    {
      name: 'layout',
      type: 'select',
      label: 'Nav Layout',
      defaultValue: 'logoLeftLinksRight',
      options: [
        { label: 'Logo left · Links right', value: 'logoLeftLinksRight' },
        { label: 'Logo left · Links center', value: 'logoLeftLinksCenter' },
        { label: 'Links left · Logo center · CTA right', value: 'linksCenterLogo' },
        { label: 'Logo center · Links below (stacked)', value: 'logoCenterStacked' },
      ],
    },
    {
      name: 'sticky',
      type: 'checkbox',
      label: 'Sticky header (stays on scroll)',
      defaultValue: true,
    },
    {
      name: 'transparentOnTop',
      type: 'checkbox',
      label: 'Transparent on page top (glass effect)',
      defaultValue: false,
    },
    {
      name: 'showSearch',
      type: 'checkbox',
      label: 'Show search icon',
      defaultValue: true,
    },

    // ── Colors ────────────────────────────────────────────────
    {
      name: 'backgroundColor',
      type: 'text',
      label: 'Background color',
      admin: {
        description: 'CSS color value, e.g. #ffffff or rgba(0,0,0,0.8)',
        placeholder: '#ffffff',
      },
    },
    {
      name: 'textColor',
      type: 'text',
      label: 'Link / text color',
      admin: {
        description: 'CSS color value for nav links.',
        placeholder: '#111111',
      },
    },
    {
      name: 'ctaButtonColor',
      type: 'text',
      label: 'CTA button background color',
      admin: {
        placeholder: '#6366f1',
      },
    },
    {
      name: 'ctaButtonTextColor',
      type: 'text',
      label: 'CTA button text color',
      admin: {
        placeholder: '#ffffff',
      },
    },

    // ── Typography ────────────────────────────────────────────
    {
      name: 'fontSize',
      type: 'select',
      label: 'Nav link font size',
      defaultValue: 'sm',
      options: [
        { label: 'Small (14 px)', value: 'sm' },
        { label: 'Base (16 px)', value: 'base' },
        { label: 'Large (18 px)', value: 'lg' },
      ],
    },
    {
      name: 'fontWeight',
      type: 'select',
      label: 'Nav link font weight',
      defaultValue: 'medium',
      options: [
        { label: 'Normal', value: 'normal' },
        { label: 'Medium', value: 'medium' },
        { label: 'Semibold', value: 'semibold' },
        { label: 'Bold', value: 'bold' },
      ],
    },
    {
      name: 'borderBottom',
      type: 'checkbox',
      label: 'Show bottom border on header',
      defaultValue: false,
    },
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
}

