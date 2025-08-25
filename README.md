# Real Leaders Frontend - Reusable Components

A comprehensive set of reusable, mobile-responsive components built with Next.js, TypeScript, and Tailwind CSS for the Real Leaders signature creation platform.

## 🚀 Features

- **Fully Mobile Responsive** - Works perfectly on all device sizes
- **Reusable Components** - Modular design for easy customization
- **TypeScript Support** - Full type safety and IntelliSense
- **Tailwind CSS v4** - Modern utility-first CSS framework
- **Professional Design** - Beautiful, polished UI components
- **Accessibility** - Built with accessibility best practices

## 📱 Components Overview

### Core UI Components

#### Button
A versatile button component with multiple variants and sizes.

```tsx
import { Button } from '@/components';

<Button variant="primary" size="lg" className="w-full">
  NEXT
</Button>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'outline' | 'ghost'
- `size`: 'sm' | 'md' | 'lg' | 'xl'
- `className`: Additional CSS classes

#### Input
Flexible input component with different styles and validation support.

```tsx
import { Input } from '@/components';

<Input
  label="Your Email"
  placeholder="Enter your email"
  variant="outline"
  size="lg"
  error="Please enter a valid email"
/>
```

**Props:**
- `variant`: 'default' | 'verification' | 'outline'
- `size`: 'sm' | 'md' | 'lg'
- `label`: Input label text
- `error`: Error message display

#### VerificationCodeInput
Specialized input for verification codes with auto-focus and paste support.

```tsx
import { VerificationCodeInput } from '@/components';

<VerificationCodeInput
  length={6}
  onComplete={(code) => console.log('Code:', code)}
  error="Invalid code"
/>
```

**Props:**
- `length`: Number of input fields (default: 6)
- `onComplete`: Callback when all fields are filled
- `error`: Error message display

#### GoalSelection
Interactive goal selection component with radio button interface.

```tsx
import { GoalSelection } from '@/components';

const goals = [
  {
    id: 'speaking',
    title: 'Speaking',
    icon: <SpeakerIcon />,
    description: 'Public speaking and presentations'
  }
];

<GoalSelection
  goals={goals}
  onSelect={(goalId) => setSelectedGoal(goalId)}
/>
```

#### ImageUpload
Drag-and-drop image upload component with preview.

```tsx
import { ImageUpload } from '@/components';

<ImageUpload
  size="lg"
  hint="This will appear at the top of your signature link"
  onImageSelect={(file) => handleImageUpload(file)}
/>
```

**Props:**
- `size`: 'sm' | 'md' | 'lg'
- `hint`: Helper text below the upload area
- `onImageSelect`: Callback when image is selected

#### PageTitle
Dynamic page title component with highlight word support.

```tsx
import { PageTitle } from '@/components';

<PageTitle
  title="MAKE YOUR MARK"
  subtitle="with RealLeaders signature"
  highlightWord="MARK"
/>
```

### Layout Components

#### Sidebar
Progress tracking sidebar with step indicators.

```tsx
import { Sidebar } from '@/components';

const steps = [
  { id: 1, title: 'Enter your unique name', status: 'completed' },
  { id: 2, title: 'Verify your email', status: 'current' },
  { id: 3, title: 'Choose your goals', status: 'pending' }
];

<Sidebar steps={steps} />


**Variants:**
- `email`: Email verification illustration
- `goals`: Goal selection illustration
- `headshot`: Profile upload illustration
- `verification`: Code verification illustration


## 🎨 Design System

### Color Palette
- **Primary**: Red (#DC2626) - Used for buttons and highlights
- **Background**: Dark gray (#111827) - Main background
- **Text**: White and gray variations for readability
- **Accents**: Green (#10B981) for success states

### Typography
- **Headings**: Large, bold text with proper hierarchy
- **Body**: Clean, readable text with appropriate line heights
- **Fonts**: System fonts with fallbacks

### Spacing
- Consistent spacing scale using Tailwind's spacing utilities
- Responsive spacing that adapts to screen size

## 📱 Mobile Responsiveness

All components are built with mobile-first design principles:

- **Flexbox Layouts**: Responsive flexbox for dynamic layouts
- **Grid Systems**: CSS Grid for complex layouts
- **Breakpoint System**: Tailwind's responsive breakpoints
- **Touch-Friendly**: Proper touch targets and spacing
- **Mobile Navigation**: Bottom navigation for mobile devices

## 🚀 Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/                 # Core UI components
│      ├── Button.tsx
│      ├── Input.tsx
│      ├── VerificationCodeInput.tsx
│      ├── GoalSelection.tsx
│      ├── ImageUpload.tsx
│      ├── PageTitle.tsx
│      
│  
├── app/                    # Next.js app directory
│   ├── demo/               # Demo page
│   └── page.tsx            # Home page
└── lib/                    # Utility functions
    └── utils.ts
```

## 🎯 Usage Examples

### Creating a New Step



### Customizing Components

```tsx
// Custom button with additional styles
<Button 
  variant="primary" 
  size="lg" 
  className="w-full bg-blue-600 hover:bg-blue-700"
>
  Custom Button
</Button>

// Custom input with validation
<Input
  label="Custom Field"
  placeholder="Enter value"
  error={errors.customField}
  className="border-blue-500 focus:border-blue-500"
/>
```

## 🔧 Customization

### Theme Colors
Modify colors in `tailwind.config.js` or override with custom CSS classes.

### Component Variants
Add new variants by extending the component interfaces and adding corresponding styles.

### Layout Adjustments
Modify the `OnboardingLayout` component to change the overall structure.

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing

1. Follow the existing code style and patterns
2. Ensure all components are mobile responsive
3. Add proper TypeScript types
4. Include accessibility features
5. Test on multiple devices and screen sizes

## 📄 License

This project is proprietary software for Real Leaders.

---

Built with ❤️ using Next.js, TypeScript, and Tailwind CSS
