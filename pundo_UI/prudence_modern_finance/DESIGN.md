---
name: Prudence Modern Finance
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#444653'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#757684'
  outline-variant: '#c4c5d5'
  surface-tint: '#3755c3'
  primary: '#00288e'
  on-primary: '#ffffff'
  primary-container: '#1e40af'
  on-primary-container: '#a8b8ff'
  inverse-primary: '#b8c4ff'
  secondary: '#5c5f61'
  on-secondary: '#ffffff'
  secondary-container: '#e0e3e5'
  on-secondary-container: '#626567'
  tertiary: '#003d27'
  on-tertiary: '#ffffff'
  tertiary-container: '#00563a'
  on-tertiary-container: '#3fd298'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dde1ff'
  primary-fixed-dim: '#b8c4ff'
  on-primary-fixed: '#001453'
  on-primary-fixed-variant: '#173bab'
  secondary-fixed: '#e0e3e5'
  secondary-fixed-dim: '#c4c7c9'
  on-secondary-fixed: '#191c1e'
  on-secondary-fixed-variant: '#444749'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
  data-mono:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
---

## Brand & Style
The brand personality is authoritative yet accessible, focusing on clarity, security, and financial mindfulness. The target audience includes professionals and families seeking a high-level overview of their fiscal health without the cognitive load of traditional accounting software.

The design style is **Corporate Modern** with a lean toward **Minimalism**. It prioritizes data density through generous whitespace and a "content-first" hierarchy. The UI evokes a sense of calm control through the use of an off-white canvas, allowing deep blue accents to guide the user's eye to primary actions. Visual complexity is minimized to ensure that complex data visualizations remain the focal point.

## Colors
The palette is engineered for professional reliability and clear semantic signaling.

- **Primary (Blue-800):** Used for headers, primary buttons, and active states to establish trust.
- **Background (Slate-50):** A soft off-white that reduces eye strain during long sessions of data review.
- **Success (Green):** Represents income, positive trends, and completed goals.
- **Danger (Orange-Red):** Highlights expenses, over-budget alerts, and critical warnings.
- **Neutral (Slate-500):** Utilized for secondary text, metadata, and inactive icons to maintain a quiet interface.

## Typography
**Inter** is the primary typeface, selected for its exceptional legibility in data-heavy environments. To ensure financial figures are easy to scan and compare, **JetBrains Mono** is introduced for tabular data, currency amounts, and transaction lists.

On mobile devices, `display-lg` scales down to `32px` and `headline-lg` scales to `24px` to prevent layout breaking. All labels use a medium weight with slight tracking to improve readability at small sizes.

## Layout & Spacing
This design system utilizes a **fixed-width centered grid** for desktop (12 columns) and a **fluid grid** for mobile (4 columns). 

The spacing rhythm is based on an **8px linear scale**. High-level sections (cards) should be separated by 32px, while related elements within a card use 8px or 16px increments. Dashboard layouts prioritize a "bento-box" style where cards reflow vertically on smaller screens.

## Elevation & Depth
Depth is communicated through **Tonal Layering** and **Ambient Shadows**. 

The base layer is the Slate-50 background. All primary content is housed within white cards (`#FFFFFF`). These cards feature a very soft, diffused shadow (15% opacity of the primary blue) to create a subtle lift without feeling heavy. 

- **Level 0 (Base):** Slate-50.
- **Level 1 (Cards):** White surface with 4px blur, 2px Y-offset shadow.
- **Level 2 (Modals/Popovers):** White surface with 20px blur, 10px Y-offset shadow.

Interactive elements like buttons use a subtle inner highlight on hover rather than an increase in shadow depth to maintain a "flat-plus" aesthetic.

## Shapes
The shape language is friendly and modern. The system defaults to `rounded-xl` (1.5rem / 24px) for all primary containers and dashboard cards. 

Secondary elements like buttons and input fields utilize a standard `rounded-lg` (1rem / 16px) to maintain a cohesive, soft-touch feel. This consistency in rounding helps soften the "analytical" nature of financial data, making the app feel more approachable.

## Components
- **Buttons:** Primary buttons are solid Blue-800 with white text. Secondary buttons use a Slate-200 border with Blue-800 text. Use "Pill-shaped" icons within buttons for action clarity.
- **Cards:** The foundational unit. Every card must have a 24px internal padding and a `headline-sm` title.
- **Input Fields:** Soft Slate-100 backgrounds with a 1px border that turns Blue-800 on focus. Labels sit outside the field in `label-md`.
- **Chips/Badges:** Used for transaction categories (e.g., "Food", "Rent"). These use low-saturation background tints of the semantic colors with high-contrast text.
- **Data Tables:** Row-based with subtle 1px Slate-100 dividers. No vertical borders. Every currency value must use the `data-mono` type style.
- **Progress Bars:** Used for budget tracking. Thick 8px tracks with rounded caps, using the Primary Blue for standard goals and Muted Red for over-budget states.