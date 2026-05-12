# Ziba Real Estate - Authentication System

A comprehensive, premium authentication system for the Ziba Real Estate platform. Built with exact brand colors, smooth animations, and production-ready code.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [File Structure](#file-structure)
4. [User Flow](#user-flow)
5. [Technical Documentation](#technical-documentation)
6. [CSS Architecture](#css-architecture)
7. [JavaScript API](#javascript-api)
8. [Customization Guide](#customization-guide)
9. [Browser Support](#browser-support)
10. [Troubleshooting](#troubleshooting)

---

## Overview

This authentication system provides a complete user registration and login experience for both property buyers/renters and real estate agents. The system features a luxury design aesthetic using Ziba's exact brand colors (#2D463E primary, #D97706 accent) with sophisticated animations and glassmorphism effects.

### Key Highlights

- ✅ **Exact Brand Colors** - Uses your CSS variables from lp(1).css
- ✅ **4 Complete Pages** - Register, Login, Agent Verification, Pending Approval
- ✅ **Role-Based System** - Separate flows for Users and Agents
- ✅ **File Upload** - Drag & drop with preview for agent documents
- ✅ **Password Strength** - Real-time visual indicator
- ✅ **Form Validation** - Client-side with error messages
- ✅ **Toast Notifications** - Non-intrusive feedback system
- ✅ **LocalStorage** - Persists data between steps
- ✅ **Responsive Design** - Mobile-first, works on all devices
- ✅ **Accessibility** - ARIA labels, keyboard navigation, focus states

---

## Features

### 1. Registration Page (`register.html`)

**Fields:**

- Full Name (text input)
- Email Address (validated)
- Password (with strength indicator)
- Confirm Password (matching validation)

**Role Selection:**
Two interactive cards (NOT radio buttons):

- **Buyer/Renter** - Standard user registration
- **Agent/Seller** - Reveals additional fields

**Agent Additional Fields:**

- Business Name
- Phone Number

**Animations:**

- Card entrance: `cardEntry` (fade up + scale)
- Form fields: `slideInRight` (staggered 0.05s delay)
- Role selection: `transition-bounce` on checkmark
- Agent fields: Smooth height expansion (0.5s)

---

### 2. Login Page (`login.html`)

**Fields:**

- Email Address
- Password (with show/hide toggle)
- Remember Me checkbox

**Features:**

- Forgot password link (UI placeholder)
- Auto-fills remembered email
- Loading spinner on submit

**Animations:**

- Same entrance animations as register
- Password toggle: Icon morphs (eye ↔ eye-slash)
- Button hover: Shimmer effect + lift

---

### 3. Agent Verification Page (`verify-agent.html`)

**Step Indicator:**
Visual progress bar showing 3 steps:

1. Account ✓ (completed)
2. Verify → (current)
3. Review (pending)

**Upload Zones:**

- **Profile Photo** - Image files only (JPG, PNG, WebP)
- **ID Document** - PDF or images

Features:

- Drag & drop support
- File preview with remove button
- Size validation (max 5MB)
- Type validation

**Fields:**

- Business Name (pre-filled from registration)
- Professional Bio (textarea, min 50 chars)

**Animations:**

- Upload zone: Scale up on dragover
- File preview: `slideDown` animation
- Remove button: Rotate 90° on hover

---

### 4. Pending Approval Page (`pending.html`)

**Status Display:**

- Animated pulsing clock icon
- Application status badge (Pending Review)
- Dynamic reference ID generation
- Submission date (auto-generated)
- Estimated review time (24-48 hours)

**Actions:**

- Return to Home button
- Sign Out button (clears LocalStorage)

**Animations:**

- Status icon: `pulse` animation (infinite)
- Badge dot: `blink` animation
- Card entrance: Delayed fade in

---

## File Structure

```
auth_system/
├── README.md                    # This file
├── auth/
│   ├── auth.css                # All styles (29.8 KB)
│   │   ├── CSS Variables       # Brand colors + animations
│   │   ├── Component Styles    # Cards, inputs, buttons
│   │   ├── Keyframe Animations # 9 animation types
│   │   └── Responsive Queries  # Mobile breakpoints
│   ├── auth.js                 # All functionality (23.5 KB)
│   │   ├── Auth Module         # Main namespace
│   │   ├── Form Handlers       # Submit validations
│   │   ├── UI Functions        # Toast, loading states
│   │   └── Event Listeners     # DOM interactions
│   ├── register.html           # Registration page
│   ├── login.html              # Login page
│   ├── verify-agent.html       # Agent onboarding
│   └── pending.html            # Approval status
└── assets/
    ├── images/                 # Background images (optional)
    └── logos/
        ├── logo.jpeg           # Main logo (required)
        └── favicon.png         # Favicon (required)
```

---

## User Flow

### Flow 1: Buyer/Renter Registration

```
┌─────────────────┐
│  Landing Page   │
└────────┬────────┘
         │ Click Register
         ▼
┌─────────────────┐
│  register.html  │
│  Select: User   │
└────────┬────────┘
         │ Fill form + Submit
         ▼
┌─────────────────┐     ┌─────────────────┐
│  Toast Success  │────▶│  login.html     │
│  "Welcome!"     │     │  (auto-redirect)│
└─────────────────┘     └─────────────────┘
```

### Flow 2: Agent Registration

```
┌─────────────────┐
│  register.html  │
│  Select: Agent  │
│  (+ business    │
│   fields show)  │
└────────┬────────┘
         │ Submit
         ▼
┌─────────────────┐
│ verify-agent.html│
│ Step 2 of 3     │
│ Upload docs     │
└────────┬────────┘
         │ Submit
         ▼
┌─────────────────┐
│  pending.html   │
│  "Under Review" │
│  Reference ID   │
└─────────────────┘
```

### Flow 3: Login

```
┌─────────────────┐
│   login.html    │
│  Enter credentials
└────────┬────────┘
         │ Submit
         ▼
    ┌────────┐
    │ Agent? │──Yes──▶ pending.html
    └────┬───┘
         │ No
         ▼
    ┌────────┐
    │Remember│──Yes──▶ Save email to LocalStorage
    │  Me?   │
    └────┬───┘
         ▼
┌─────────────────┐
│  Redirect to    │
│  main site      │
└─────────────────┘
```

---

## Technical Documentation

### CSS Architecture

#### 1. CSS Variables (Design Tokens)

All design values are centralized in `:root` for easy theming:

**Brand Colors (Exact from lp(1).css):**

```css
--primary-color: #2d463e; /* Deep green */
--accent-color: #d97706; /* Amber/orange */
--button-color: #d97706;
--button-hover-color: #b45309;
--bg-color: #f5f2ed; /* Warm off-white */
--text-color: #1f2937; /* Near black */
--error-color: #ef4444;
--success-color: #10b981;
--warning-color: #f59e0b;
```

**Typography:**

```css
--heading-font-family: fraunces, serif;
--body-font-family: inter, sans-serif;
--text-size-sm: 12px;
--text-size-md: 16px;
--text-size-lg: 20px;
--text-size-xl: 24px;
--text-size-2xl: 32px;
--text-size-3xl: 40px;
```

**Spacing System:**

```css
--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 16px;
--spacing-lg: 24px;
--spacing-xl: 32px;
--spacing-2xl: 48px;
--spacing-3xl: 64px;
```

**Border Radius:**

```css
--main-button-border-radius: 40px; /* Pill shape */
--secondary-button-border-radius: 16px; /* Rounded */
--input-border-radius: 8px;
--card-border-radius: 24px;
```

**NEW: Animation Variables:**

```css
--transition-sm: 0.1s ease-in-out;
--transition-md: 0.2s ease-in-out;
--transition-lg: 0.3s ease-in-out;
--transition-bounce: 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
--transition-spring: 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);

--duration-fast: 200ms;
--duration-normal: 300ms;
--duration-slow: 500ms;

--scale-hover: 1.02;
--scale-active: 0.98;
--shadow-glow: 0 0 20px rgba(217, 119, 6, 0.3);
```

#### 2. Component Classes

**Auth Card (Glassmorphism):**

```css
.auth-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(229, 231, 235, 0.5);
  border-radius: var(--card-border-radius);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}
```

**Primary Button:**

```css
.auth-button {
  background: var(--button-color);
  border-radius: var(--main-button-border-radius);
  color: white;
  transition: all var(--transition-md);
  box-shadow: 0 4px 15px rgba(217, 119, 6, 0.3);
}
.auth-button:hover {
  background: var(--button-hover-color);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(217, 119, 6, 0.4);
}
```

**Form Inputs:**

```css
.form-input {
  border: 2px solid var(--border-color);
  border-radius: var(--input-border-radius);
  transition: all var(--transition-md);
}
.form-input:focus {
  border-color: var(--accent-color);
  box-shadow: 0 0 0 4px rgba(217, 119, 6, 0.1);
}
```

#### 3. Animation Keyframes

| Animation      | Duration      | Usage              |
| -------------- | ------------- | ------------------ |
| `float`        | 20s infinite  | Background orbs    |
| `pulse`        | 2s infinite   | Status icons       |
| `spin`         | 0.8s linear   | Loading spinner    |
| `cardEntry`    | 0.5s          | Page load entrance |
| `slideDown`    | 0.3s          | Error messages     |
| `slideInRight` | 0.3s          | Form fields        |
| `fadeIn`       | 0.3s          | General fade       |
| `shake`        | 0.5s          | Form errors        |
| `blink`        | 1.5s infinite | Status indicators  |

---

### JavaScript API

#### Module Structure

```javascript
const Auth = (function() {
    // Private config
    const config = { colors, transitions, validation rules }

    // Private state
    let state = { selectedRole, files, etc. }

    // Private functions
    function debounce() {}
    function validateEmail() {}

    // Public API
    return {
        init,
        showToast,
        selectRole,
        togglePasswordVisibility
    };
})();
```

#### Public Methods

**`Auth.init()`**

- Initializes all event listeners
- Restores saved role from LocalStorage
- Sets up form validations
- Called automatically on DOMContentLoaded

**`Auth.showToast(message, type, duration)`**

```javascript
// Show success message
Auth.showToast("Registration successful!", "success", 3000);

// Show error
Auth.showToast("Invalid email address", "error");

// Show info
Auth.showToast("Coming soon", "info");
```

**`Auth.selectRole(role)`**

```javascript
// Select user role
Auth.selectRole("user");

// Select agent role (shows additional fields)
Auth.selectRole("agent");
```

**`Auth.togglePasswordVisibility(button, input)`**

- Toggles password field type between 'password' and 'text'
- Updates icon automatically

#### Form Handlers

**Registration Form:**

- Validates all fields in real-time
- Checks password strength (weak/medium/strong)
- Confirms password matching
- Validates email format
- Shows field-specific errors
- Stores data in LocalStorage
- Redirects based on role

**Login Form:**

- Validates email and password
- Checks for pending agent approval
- Handles "Remember Me" functionality
- Shows loading state
- Redirects to main site or pending page

**Agent Verification Form:**

- Validates file uploads (type, size)
- Checks bio length (min 50 chars)
- Shows upload previews
- Handles drag & drop
- Submits to pending state

---

## Customization Guide

### Changing Colors

Edit `:root` in `auth.css`:

```css
:root {
  /* Change primary brand color */
  --primary-color: #YOUR_COLOR;

  /* Change accent/button color */
  --accent-color: #YOUR_ACCENT;
  --button-color: #YOUR_ACCENT;
  --button-hover-color: #DARKER_VERSION;
}
```

All components will update automatically.

### Changing Fonts

Edit the Google Fonts link in HTML files:

```html
<!-- Current: Fraunces + Inter -->
<link
  href="https://fonts.googleapis.com/css2?family=Fraunces...&family=Inter..."
  rel="stylesheet"
/>

<!-- Change to different fonts -->
<link
  href="https://fonts.googleapis.com/css2?family=Playfair+Display...&family=Roboto..."
  rel="stylesheet"
/>
```

Then update CSS variables:

```css
:root {
  --heading-font-family: "Playfair Display", serif;
  --body-font-family: "Roboto", sans-serif;
}
```

### Adding New Fields

**To registration form:**

1. Add HTML in `register.html`:

```html
<div class="form-group">
  <label for="newField" class="form-label">New Field</label>
  <div class="input-wrapper">
    <i class="fas fa-icon input-icon"></i>
    <input type="text" id="newField" name="newField" class="form-input" />
  </div>
</div>
```

2. Add validation in `auth.js`:

```javascript
const newField = form.querySelector("#newField").value.trim();
if (!newField) {
  showFieldError(form.querySelector("#newField"), "This field is required");
  isValid = false;
}
```

### Connecting to Backend

Replace the simulated API calls in `auth.js`:

**Current (simulated):**

```javascript
await new Promise((resolve) => setTimeout(resolve, 2000));
localStorage.setItem("pendingUser", JSON.stringify(userData));
```

**With real API:**

```javascript
const response = await fetch("/api/auth/register", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(userData),
});
const data = await response.json();
```

---

## Browser Support

| Browser | Version | Support          |
| ------- | ------- | ---------------- |
| Chrome  | 90+     | ✅ Full          |
| Firefox | 88+     | ✅ Full          |
| Safari  | 14+     | ✅ Full          |
| Edge    | 90+     | ✅ Full          |
| Opera   | 76+     | ✅ Full          |
| IE 11   | -       | ❌ Not supported |

**Required Features:**

- CSS Custom Properties (variables)
- Backdrop Filter (glassmorphism)
- CSS Grid & Flexbox
- ES6+ JavaScript
- LocalStorage API

---

## Troubleshooting

### Issue: Background image not showing

**Solution:**

- Ensure image exists at `../assets/images/luxury-bg.jpg`
- Or remove background-image from `.auth-background` CSS
- Fallback gradient will still display

### Issue: Fonts not loading

**Solution:**

- Check internet connection (Google Fonts required)
- Add font-display: swap to prevent FOIT
- Or self-host fonts for offline use

### Issue: Animations not working

**Solution:**

- Check for `prefers-reduced-motion` media query
- Ensure CSS file is properly linked
- Verify no JavaScript errors in console

### Issue: Form validation not working

**Solution:**

- Ensure `auth.js` is loaded after HTML
- Check that form has `id="registerForm"` or `id="loginForm"`
- Verify no conflicting JavaScript libraries

### Issue: File upload not working

**Solution:**

- Check browser supports File API
- Verify file size < 5MB
- Ensure file type is allowed (JPG, PNG, PDF)
- Check for JavaScript errors

---

## Performance Notes

- **CSS:** 29.8 KB (single file, cached)
- **JavaScript:** 23.5 KB (vanilla JS, no frameworks)
- **No external dependencies** except Google Fonts & Font Awesome
- **Lazy loading:** Images load on demand
- **Animations:** GPU-accelerated transforms only
- **Accessibility:** Respects `prefers-reduced-motion`

---

## License & Credits

Created for **Ziba Real Estate - Premium Properties**

- Design System: Based on lp(1).css brand guidelines
- Icons: Font Awesome 6.4.0
- Fonts: Google Fonts (Fraunces + Inter)
- No external frameworks or libraries

---

## Support

For questions or issues:

1. Check this README first
2. Review browser console for errors
3. Verify file structure matches documentation
4. Test with provided example flow

---

**Last Updated:** April 2026  
**Version:** 1.0.0  
**Author:** Development Team
