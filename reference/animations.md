# FalconPack Animation Specifications

Extracted from live reference: https://falconpack.com/

## 1. Header Dropdown & Mega Menu
- **Trigger**: `mouseenter` / hover on menu item (`OUR COMPANY`, `CATEGORIES`, `INDUSTRY WE SERVE`, etc.)
- **Properties**: `opacity`, `max-height`, `transform: translateY`
- **Duration**: `300ms` (open), `200ms` (close exit)
- **Easing**: `cubic-bezier(0.4, 0, 0.2, 1)` (ease-in-out)
- **Delay**: `150ms` exit debounce to prevent jitter

## 2. Rotated Section Headers
- **Visual Pattern**: Vertical rotated titles on the side margin
  - `BUSINESS VERTICALS`: `-rotate-90 font-bold top-[7.5rem] -left-[3rem]`
  - `OUR PRESENCE`: `-rotate-90 font-bold top-20 -left-4 text-white`
  - `CUSTOMIZE YOUR PACKAGING`: `-rotate-90 font-bold top-[10rem] -left-[5rem] text-white`
  - `GLOBAL PRESENCE`: `-rotate-90 font-bold top-[6rem] -left-[2rem]`
- **Behavior**: Sticks alongside section viewport on desktop (`sticky top-[4.2rem]`)

## 3. Scroll Reveal Animations (Verticals & Content)
- **Trigger**: `IntersectionObserver` when entering viewport (threshold: 0.15)
- **Properties**:
  - Initial: `opacity: 0`, `translateY: 30px`
  - Visible: `opacity: 1`, `translateY: 0px`
- **Duration**: `600ms` - `750ms`
- **Easing**: `cubic-bezier(0.25, 0.1, 0.25, 1)`
- **Stagger**: `100ms` delay between consecutive cards

## 4. Count-up Stats (Global Presence & 65+ Countries)
- **Trigger**: IntersectionObserver viewport entry (threshold: 0.2)
- **Duration**: `2000ms`
- **Easing**: Cubic Ease-out `1 - Math.pow(1 - progress, 3)`
- **Targets**:
  - `65+ Countries` (Section 3)
  - `8 Branches` (Section 5)
  - `24+ Sales Centers` (Section 5)
  - `3,000+ Products` (Secondary stats)

## 5. Hero Banner Ken Burns Zoom
- **Trigger**: Active slide presentation
- **Properties**: `transform: scale(1.05)` -> `transform: scale(1.0)`
- **Duration**: `7000ms`
- **Easing**: `ease-out`

## 6. Language Toggle (EN / AR) & RTL Transition
- **Trigger**: Language pill toggle click
- **Behavior**: Smooth layout direction flip (`dir="rtl"` vs `dir="ltr"`), Arabic font switch (`Cairo`), mirroring navigation and arrow icons without jarring layout shift.
