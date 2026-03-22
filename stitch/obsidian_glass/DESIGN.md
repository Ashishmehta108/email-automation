# Design System Documentation: The Precision Layer

## 1. Overview & Creative North Star: "The Digital Architect"
The Creative North Star for this design system is **The Digital Architect**. This system moves away from the "boxy" nature of standard SaaS platforms, opting instead for a structural, editorial approach where depth is defined by light and transparency rather than heavy outlines. It is a quiet, authoritative environment that feels like a high-end physical architectural studio: dark, precise, and meticulously organized.

To break the "template" look, designers must embrace **intentional asymmetry**. Use large, expansive white space (or "dark space") to let typography breathe. Overlap glass containers slightly over background elements to create a sense of physical layering. The goal is to move the user’s eye through a narrative of data, not a grid of boxes.

---

### 2. Colors & Surface Philosophy
The palette is rooted in deep obsidian tones, punctuated by a surgical application of the `primary` blue.

*   **The "No-Line" Rule:** Standard 1px solid dividers are strictly prohibited for layout sectioning. Separation must be achieved via **Tonal Stepping**. For example, a sidebar using `surface_container_low` should sit against a main content area of `surface`. The edge is defined by the shift in hex value, not a stroke.
*   **Surface Hierarchy & Nesting:** Use the `surface_container` tiers to create logical nesting. 
    *   `surface_container_lowest` (#0e0e0e) for the background foundation.
    *   `surface_container` (#201f1f) for primary content zones.
    *   `surface_container_highest` (#353534) for active interactive elements or high-level navigation.
*   **The Glass & Gradient Rule:** Floating panels (Modals, Popovers, Dropdowns) must utilize **Glassmorphism**. Apply a 60% opacity to the surface color combined with a `24px-32px` backdrop-blur. 
*   **Signature Textures:** For primary CTAs, do not use flat fills. Use a subtle linear gradient from `primary` (#acc7ff) to `primary_container` (#508ff8) at a 135-degree angle to provide "soul" and a metallic, premium sheen.

---

### 3. Typography: Editorial Precision
The system pairs the technical geometry of **Space Grotesk** with the utilitarian clarity of **Inter**.

*   **Display & Headlines (Space Grotesk):** These are your "statements." Use `display-lg` and `headline-lg` with a tracking (letter-spacing) of `-0.02em` for a tight, professional look. For `stats` and `numbers`, increase tracking to `+0.05em` to emphasize the technical nature of the data.
*   **Body & Data (Inter):** All functional text uses Inter. To achieve the "SaaS-premium" feel, implement a generous tracking of `+0.01em` to `+0.02em` on all `body-md` and `body-sm` styles. This prevents the text from feeling "cramped" in dark mode, where light bleed can reduce legibility.
*   **Hierarchy via Weight:** Use `weight: 300` (Light) for large headlines to evoke high-end fashion/tech aesthetics, and `weight: 500` (Medium) for `label-md` to ensure durability against dark backgrounds.

---

### 4. Elevation & Depth
In this system, elevation is a property of light, not physics.

*   **The Layering Principle:** Depth is managed by the "z-index of tones." A `surface_container_high` card placed on a `surface_container_low` background creates a natural lift. 
*   **Ambient Shadows:** For floating elements, use a "Ghost Shadow." 
    *   Blur: `40px` | Spread: `0` | Opacity: `8%` of `on_surface`.
    *   The shadow should feel like a soft glow of "absence" rather than a dark stain.
*   **The Ghost Border:** If a boundary is required for accessibility, use a 1px stroke of `outline_variant` (#424753) at **20% opacity**. This creates a "glint" on the edge of the glass, mimicking how light hits a beveled edge.
*   **Glassmorphism Depth:** When nesting glass components, increase the blur value by `8px` for every layer "closer" to the user. This mimics optical depth of field.

---

### 5. Components

*   **Buttons:**
    *   **Primary:** Gradient fill (`primary` to `primary_container`), `roundness-sm` (0.125rem) for a sharp, precision-cut look.
    *   **Tertiary:** No background. 1px "Ghost Border" that becomes 40% opaque on hover.
*   **Cards & Lists:** 
    *   **The No-Divider Rule:** Forbid horizontal lines in lists. Use `spacing-4` (1.4rem) of vertical white space to separate items.
    *   **Selection:** Active list items should use `surface_bright` with a 2px left-accent border of `primary`.
*   **Input Fields:**
    *   Use `surface_container_lowest` as the fill. 
    *   On focus, the border transitions from 10% opacity `primary` to 40%. No heavy outer glows.
*   **Chips:**
    *   Use `secondary_container` with `label-sm` text. Roundness should be `full` to contrast against the sharp-edged cards.
*   **Precision Tooltips:**
    *   Always use `surface_container_highest` with 60% opacity and `32px` blur. Minimal `0.5rem` padding with `label-sm` Inter typography.

---

### 6. Do's and Don'ts

**Do:**
*   **Do** use asymmetrical layouts where the left margin is significantly wider than the right to create an editorial feel.
*   **Do** use `primary` sparingly. It should act as a "laser pointer," directing attention only to the most critical actions.
*   **Do** leverage `surface_dim` for large background areas to reduce eye strain and increase the perceived "premium" quality of the blacks.

**Don't:**
*   **Don't** use `roundness-xl` (0.75rem) or `roundness-lg` (0.5rem) on structural elements like cards or inputs. Keep it to `sm` (0.125rem) or `none` to maintain an authoritative, professional edge.
*   **Don't** use pure white (#FFFFFF) for text. Always use `on_surface` (#e5e2e1) to prevent "vibration" against the dark background.
*   **Don't** use standard 100% opaque borders. They break the "Glass Architect" illusion and make the UI feel like a legacy application.