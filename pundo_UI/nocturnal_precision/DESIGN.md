---
name: Nocturnal Precision
colors:
  surface: '#0b1326'
  surface-dim: '#0b1326'
  surface-bright: '#31394d'
  surface-container-lowest: '#060e20'
  surface-container-low: '#131b2e'
  surface-container: '#171f33'
  surface-container-high: '#222a3d'
  surface-container-highest: '#2d3449'
  on-surface: '#dae2fd'
  on-surface-variant: '#c2c6d6'
  inverse-surface: '#dae2fd'
  inverse-on-surface: '#283044'
  outline: '#8c909f'
  outline-variant: '#424754'
  surface-tint: '#adc6ff'
  primary: '#adc6ff'
  on-primary: '#002e6a'
  primary-container: '#4d8eff'
  on-primary-container: '#00285d'
  inverse-primary: '#005ac2'
  secondary: '#b9c8de'
  on-secondary: '#233143'
  secondary-container: '#39485a'
  on-secondary-container: '#a7b6cc'
  tertiary: '#4edea3'
  on-tertiary: '#003824'
  tertiary-container: '#00a572'
  on-tertiary-container: '#00311f'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc6ff'
  on-primary-fixed: '#001a42'
  on-primary-fixed-variant: '#004395'
  secondary-fixed: '#d4e4fa'
  secondary-fixed-dim: '#b9c8de'
  on-secondary-fixed: '#0d1c2d'
  on-secondary-fixed-variant: '#39485a'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#0b1326'
  on-background: '#dae2fd'
  surface-variant: '#2d3449'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 56px
    fontWeight: '700'
    lineHeight: 64px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
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
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-padding-mobile: 16px
  container-padding-desktop: 32px
  gutter: 24px
  stack-sm: 4px
  stack-md: 8px
  stack-lg: 16px
  stack-xl: 32px
---

## Brand & Style
This design system is a sophisticated evolution of modern finance, transitioning into a high-performance dark mode environment. The aesthetic moves away from clinical light interfaces toward a focused, immersive "command center" feel. It targets professional users who require prolonged focus without eye fatigue.

The style is **Corporate / Modern** with a lean toward **Minimalism**. It prioritizes deep, layered surfaces over flat planes to establish a sense of architectural depth. The emotional response should be one of security, technical excellence, and calm authority. By using a monochromatic foundation of slates and deep blues, the interface recedes into the background, allowing financial data and primary actions to command full attention.

## Colors
The palette is rooted in a "Deep Slate" foundation to prevent the "true black" jarring contrast that causes smearing on OLED screens. 

- **Primary:** A vibrant, high-lumen blue used exclusively for interactive states and key brand moments.
- **Secondary:** A muted slate-blue used for iconography and supplementary information.
- **Tertiary:** Used primarily for positive financial trends (success).
- **Neutral/Background:** The core background is a midnight navy (#020617), providing a stable base for the elevation system.

Contrast ratios are strictly maintained at a minimum of 7:1 for body text against primary backgrounds to ensure accessibility in low-light environments.

## Typography
This design system utilizes **Inter** across all levels to maintain a systematic and utilitarian feel. 

In this dark mode implementation, font weights for body text are slightly lighter than their light-mode counterparts to compensate for "ink bleed" (the visual phenomenon where light text on dark backgrounds appears bolder than it is). 

- **Headlines:** Tight letter-spacing and heavy weights to create a strong visual anchor.
- **Body:** Standardized for maximum legibility. 
- **Labels:** Used for metadata, navigation, and overlines, often paired with slightly increased letter spacing for clarity at small scales.

## Layout & Spacing
The layout follows a **Fluid Grid** model with a strict 8px base unit. 

- **Desktop:** 12-column grid with 24px gutters. Content is centered with a max-width of 1440px.
- **Mobile:** 4-column grid with 16px margins.
- **Logic:** Vertical rhythm is maintained through "Stack" variables. Use `stack-md` for internal component spacing and `stack-xl` for section separation. 

Layout transitions should be seamless, with sidebars collapsing into bottom navigation on mobile devices.

## Elevation & Depth
Depth is communicated through **Tonal Layers** rather than heavy shadows. In a dark UI, light source simulation is more effective via surface color shifts.

- **Level 0 (Base):** Background color (#020617). Used for the main canvas.
- **Level 1 (Card):** Surface Dim (#0F172A). Used for primary content containers.
- **Level 2 (Dropdown/Modal):** Surface Bright (#1E293B). These elements are perceived as being closer to the user.
- **Overlays:** A subtle 1px inner border (stroke) using `surface_container` is applied to all elevated elements to define edges where tonal contrast is low. 

Shadows, if used, are restricted to `Level 2` and above, using a pure black (#000000) with 40% opacity and a high blur radius (16px+) to create a soft "glow-stop" effect.

## Shapes
The design system employs a **Rounded** (0.5rem / 8px) aesthetic. This choice balances the professional nature of finance with a modern, approachable feel. 

- **Small Components:** Checkboxes and small tags use 4px (Soft).
- **Standard Components:** Buttons, Input fields, and Cards use 8px (Rounded).
- **Large Components:** Modals and bottom sheets use 16px (Rounded-LG) for a more prominent, friendly presence.
- **Pills:** Used exclusively for status chips (e.g., "Active", "Pending").

## Components

- **Buttons:** Primary buttons use the `primary_color_hex` with white text. Secondary buttons are "Ghost" style with a `surface_container` border.
- **Input Fields:** Backgrounds should be `surface_dim`. On focus, the border transitions to `primary_color_hex` with a subtle outer glow.
- **Cards:** Use `Level 1` elevation with an 8px corner radius. No shadows are required for standard dashboard cards; use tonal separation only.
- **Chips/Status:** Use low-opacity versions of semantic colors (e.g., Success green at 10% opacity) with high-saturation text for high legibility.
- **Lists:** Rows should be separated by 1px dividers using the `surface_container` color. Active list items should use a subtle left-accent bar in the primary color.
- **Data Visualization:** Line charts and bars should use the `primary_color` for the main data series, with a gradient fill (Primary to Transparent) for area charts.