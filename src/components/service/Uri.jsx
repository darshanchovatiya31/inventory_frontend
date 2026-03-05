
export const BaseUrl = "http://localhost:3000"
export const FrontendUrl = "http://localhost:5173"

// export const BaseUrl = "https://inventory-backend-ernu.onrender.com"
// export const FrontendUrl = "https://inventory-system-ims.vercel.app"

{/* Project review: Inventory Management System
Project overview
Architecture: React (Vite) frontend + Node.js/Express backend
User roles: Super Admin, Company Admin
Tech stack: React 19, Bootstrap 5, React Router, Axios, SweetAlert2, React Icons
Application flow
1. Authentication flow
Super Admin: /admin/login → /super-admin
Company Admin: /:companyName → /company
Both use JWT tokens stored in localStorage
2. Super Admin panel
Dashboard: Company and inventory stats
Company management: CRUD
Account settings
3. Company Admin panel
Dashboard: Inventory, sales, revenue metrics
Inventory: CRUD, stock adjustments, history, filters
Sales: Transaction management, customer info, payment tracking
Account settings
UI design analysis
Strengths
Responsive design: Mobile/desktop breakpoints
Modern styling: Gradients, shadows, rounded corners
Component structure: Reusable components (Sidebar, Header, Modals)
User feedback: SweetAlert2 notifications
Loading states: Spinners and placeholders
Areas for improvement
Design consistency
Mixed styling approaches (inline styles, CSS files, Bootstrap classes)
Inconsistent color palette across components
Sidebar styles differ between Super Admin and Company Admin
Color scheme
Multiple gradients without a unified palette
Hardcoded colors scattered in components
No CSS variables for theming
Typography
Inconsistent font sizes and weights
No clear typography scale
Spacing and layout
Inconsistent padding/margins
Some components lack proper spacing
Component patterns
Inline styles reduce maintainability
Modal implementations vary
Button styles not standardized
Accessibility
Missing ARIA labels
Keyboard navigation gaps
Color contrast not verified
User experience
Sidebar toggle behavior inconsistent
Mobile navigation could be smoother
Loading states vary
Code organization
CSS split across files and inline styles
No design system/token structure
Repeated style patterns
Specific UI issues found
Company Admin Sidebar (Sidebar.jsx)
Complex inline styles
Overlay positioning issues
Animation inconsistencies
Super Admin Sidebar (Sidebar.jsx)
Different styling approach than Company Admin
Better structure but still uses inline styles
Login pages
Company Login: Modern design with animations
Super Admin Login: Simpler, less polished
Dashboard cards
Good gradient usage
Inconsistent card heights and spacing
Missing hover effects
Inventory page
Well-structured with mobile/desktop views
Too many inline styles
Modal styling could be unified
Common Header
Simple but functional
Dropdown could be improved
Missing loading states
Recommendations for UI improvements
Priority 1: Design system
Create a CSS variables file for:
Colors (primary, secondary, success, danger, etc.)
Spacing scale
Typography scale
Border radius
Shadows
Standardize components:
Button variants
Card components
Input fields
Modal components
Priority 2: Consistency
Unify sidebar designs
Standardize color palette
Consistent spacing system
Unified typography
Priority 3: User experience
Improve mobile navigation
Add smooth transitions
Enhance loading states
Better error handling UI
Priority 4: Code quality
Extract inline styles to CSS modules or styled-components
Create reusable UI components
Organize CSS files better
Add proper TypeScript types (if migrating)
Current design patterns
Good patterns
Component-based architecture
Responsive breakpoints (992px)
Modal pattern for forms
Toast notifications for feedback
Patterns to improve
Inline style usage (move to CSS)
Mixed styling approaches
No design tokens
Inconsistent naming conventions
Technical observations
Performance
Good: Lazy loading considerations
Good: Pagination implemented
Could improve: Image optimization
Could improve: Code splitting
Maintainability
Issue: Too many inline styles
Issue: CSS scattered across files
Good: Component structure
Could improve: Extract common styles
Summary
The project has a solid foundation with good functionality and responsive design. The main improvements should focus on:
Design system and consistency
Reducing inline styles
Standardizing components
Improving accessibility
Better code organization
The UI is functional but would benefit from a unified design system and consistent styling approach.
Should I start implementing these improvements, or focus on specific areas first? */}