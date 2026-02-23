# Admin Dashboard - CSS Styles Documentation

## Overview

This Admin Dashboard features a comprehensive CSS styling system with full support for both **light** and **dark** themes. The styles are organized across two main CSS files with a focus on maintainability, scalability, and user experience.

## 📁 CSS Files

### 1. `src/index.css`
**Purpose:** Base styles, CSS variables, reset, and global utilities

**Features:**
- CSS Custom Properties (Variables) for theming
- Light and dark mode color palettes
- Global reset and base typography
- Utility classes for common layouts
- Scrollbar customization
- Smooth transitions for theme switching
- Print styles

### 2. `src/App.css`
**Purpose:** Component-specific styles for the entire application

**Features:**
- AppLayout styles (sidebar, header, content)
- Dashboard page styles (stats cards, charts, activity)
- Users page styles (table, filters, actions)
- Settings page styles (forms, toggles, danger zone)
- Responsive design breakpoints
- Loading and empty states
- Animations

## 🎨 Theme System

### Light Mode (Default)
```css
--bg-primary: #ffffff
--bg-secondary: #f5f5f5
--text-primary: #000000
--text-secondary: #666666
--border-color: #d9d9d9
```

### Dark Mode
```css
--bg-primary: #141414
--bg-secondary: #1f1f1f
--text-primary: #ffffff
--text-secondary: #b8b8b8
--border-color: #434343
```

### Theme Switching
The theme is controlled through Redux and applied via the `ThemeProvider` component:
- Redux state: `state.theme.darkMode`
- DOM attribute: `data-theme="dark"` on `<html>` element
- Automatic CSS variable switching
- Smooth 300ms transitions

## 🧩 Component Styles

### AppLayout Component

#### Logo
- Gradient background (primary color)
- Rounded corners with shadow
- Hover scale animation

#### Sidebar
- Collapsible with smooth transitions
- Menu items with rounded corners
- Hover and active states
- Icon + label layout

#### Header
- Fixed height: 64px
- Sidebar toggle button
- Theme switcher with styled toggle
- Responsive design

#### Content Area
- Card-based layout
- Minimum height calculation
- Fade-in animation on page load

### Dashboard Page

#### Stats Cards
- Grid layout (responsive)
- Left border accent color
- Icon and value display
- Change indicator (positive/negative)
- Hover elevation effect

**Variants:**
- `.stat-card.success` - Green accent
- `.stat-card.warning` - Yellow accent
- `.stat-card.error` - Red accent

#### Charts Section
- Two-column grid
- Progress bars with gradients
- Statistics display
- Hover card effects

#### Activity List
- Icon-based entries
- Title and timestamp
- Hover row highlight
- Avatar support

### Users Page

#### Filter Bar
- Search input
- Status dropdown
- Additional filters button
- Responsive wrapping

#### Users Table
- Custom table styling
- Avatar with border
- Status badges (Active, Inactive, Pending)
- Action buttons (View, Edit, Delete)
- Pagination controls

#### User Status Badges
```css
.user-status.active    /* Green */
.user-status.inactive  /* Gray */
.user-status.pending   /* Yellow */
```

### Settings Page

#### Settings Sections
- Card-based layout
- Icon + title headers
- Divider separation
- Hover effects

#### Form Elements
- Vertical layout
- Labeled inputs
- Helper text hints
- Validation states
- Primary action buttons

#### Settings Toggles
- Row-based layout
- Label and description
- Switch component
- Hover background

#### Danger Zone
- Red border accent
- Warning text
- Destructive action buttons
- Special hover state

## 📱 Responsive Design

### Breakpoints
- **Desktop:** > 768px (full layout)
- **Tablet:** 576px - 768px (adjusted spacing)
- **Mobile:** < 576px (stacked layout)

### Mobile Adaptations
- Single column grids
- Stacked filters
- Hidden labels in theme toggle
- Full-width buttons
- Reduced font sizes
- Adjusted padding

## 🎭 Animations

### Fade In
```css
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
```

### Slide In
```css
@keyframes slideIn {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}
```

### Loading Skeleton
Gradient animation for loading states

## 🛠️ Utility Classes

### Layout
- `.container` - Max-width container
- `.flex` - Flex container
- `.flex-center` - Centered flex
- `.flex-between` - Space-between flex
- `.grid` - Grid container

### Spacing
- `.mt-1` to `.mt-4` - Margin top (8px to 32px)
- `.mb-1` to `.mb-4` - Margin bottom
- `.p-1` to `.p-4` - Padding

### Text
- `.text-center` - Center aligned
- `.text-right` - Right aligned

## 🎯 Customization

### Adding New Colors
Edit `index.css` CSS variables:
```css
:root {
  --your-color: #hexcode;
}
```

### Modifying Breakpoints
Edit media queries in `App.css`:
```css
@media (max-width: 768px) {
  /* Your styles */
}
```

### Creating New Components
Follow the pattern:
1. Add base class in `App.css`
2. Add dark mode overrides in `[data-theme="dark"]`
3. Include transition property
4. Test both themes

## 🌙 Dark Mode Best Practices

1. **Use CSS Variables:** Always reference variables, never hardcode colors
2. **Test Contrast:** Ensure text is readable in both modes
3. **Shadows:** Dark mode needs stronger shadows
4. **Images:** Consider image visibility on dark backgrounds
5. **Transitions:** Smooth color changes (300ms recommended)

## 📋 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🔧 Maintenance

### When Adding Features
1. Create component-specific class
2. Add light mode styles
3. Add dark mode overrides
4. Include transitions
5. Test responsive behavior
6. Document in this file

### Performance Tips
- Use CSS variables for theme switching
- Minimize box-shadow usage on mobile
- Use transforms instead of position changes
- Optimize images and avatars
- Lazy load non-critical components

## 📚 Additional Resources

- [Ant Design Theming](https://ant.design/docs/react/customize-theme)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [Dark Mode Design Guide](https://uxdesign.cc/dark-mode-ui-design-best-practices-be2859a6c869)

---

**Created for:** Admin Dashboard Task 4
**Last Updated:** 2025
**Theme Support:** Light & Dark Mode
