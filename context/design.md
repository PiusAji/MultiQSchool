# HomeHero Design System

## Overview

The HomeHero design uses a **playful, warm, organic aesthetic** perfect for preschool and elementary school websites. This document captures the design tokens, patterns, and reusable components.

---

## Color Palette

### Background Gradients

**Main Hero Background**:

```
bg-gradient-to-br from-amber-50 via-orange-100 to-amber-200
```

- Hex: `#fef6e4` → `#ffe8cc` → `#ffd4a3`
- Feel: Warm, welcoming, like a sunny morning

**Alternative Background Options**:

```
// Peachy/Pink variant
bg-gradient-to-br from-orange-50 via-pink-100 to-rose-200

// Blue/Sky variant
bg-gradient-to-br from-sky-50 via-blue-100 to-cyan-200

// Green/Nature variant
bg-gradient-to-br from-emerald-50 via-green-100 to-teal-200

// Purple/Playful variant
bg-gradient-to-br from-purple-50 via-violet-100 to-fuchsia-200
```

### Text Colors

```css
/* Primary heading */
text-gray-800    /* #1f2937 */

/* Subtitle */
text-gray-600    /* #4b5563 */

/* Body text/Description */
text-gray-500    /* #6b7280 */
```

---

## Floating Decorative Shapes

### Shape Pattern

The floating shapes create depth and playfulness. Each shape has:

- **Organic blob shapes** using `border-radius` with percentages
- **Gradient backgrounds** for visual interest
- **15% opacity** to not overwhelm content
- **GSAP animations** for continuous floating motion

### Shape Components (Reusable)

#### Shape 1 - Pink/Rose Blob

```tsx
<div className="absolute w-48 h-48 rounded-[30%_70%_70%_30%/30%_30%_70%_70%] bg-gradient-to-br from-pink-400 to-rose-500 opacity-15 top-[10%] left-[5%]" />
```

#### Shape 2 - Blue/Cyan Blob

```tsx
<div className="absolute w-36 h-36 rounded-[70%_30%_30%_70%/60%_40%_60%_40%] bg-gradient-to-br from-blue-400 to-cyan-400 opacity-15 top-[60%] left-[10%]" />
```

#### Shape 3 - Green/Teal Blob

```tsx
<div className="absolute w-44 h-44 rounded-[40%_60%_60%_40%/60%_30%_70%_40%] bg-gradient-to-br from-emerald-400 to-teal-400 opacity-15 top-[20%] right-[8%]" />
```

#### Shape 4 - Pink/Yellow Blob

```tsx
<div className="absolute w-32 h-32 rounded-[30%_70%_70%_30%/30%_30%_70%_70%] bg-gradient-to-br from-pink-400 to-yellow-400 opacity-15 bottom-[15%] right-[15%]" />
```

#### Shape 5 - Cyan/Pink Circle

```tsx
<div className="absolute w-24 h-24 rounded-full bg-gradient-to-br from-cyan-200 to-pink-200 opacity-15 top-1/2 left-1/2" />
```

#### Shape 6 - Amber/Orange Blob

```tsx
<div className="absolute w-36 h-36 rounded-[60%_40%_30%_70%/60%_30%_70%_40%] bg-gradient-to-br from-amber-200 to-orange-300 opacity-15 bottom-[30%] left-[20%]" />
```

### Shape Container Pattern

Wrap all shapes in a container:

```tsx
<div className="absolute inset-0 pointer-events-none z-10">
  {/* All shapes go here */}
  <div className="shape absolute w-48 h-48..." />
  <div className="shape absolute w-36 h-36..." />
  {/* etc */}
</div>
```

Key properties:

- `absolute inset-0` - Fills parent container
- `pointer-events-none` - Doesn't block clicks
- `z-10` - Behind content but visible
- Add `shape` class to each shape for GSAP targeting

---

## Organic Border Radius Patterns

These create the blob/organic shapes:

```css
/* Blob 1 - Asymmetric */
rounded-[30%_70%_70%_30%/30%_30%_70%_70%]

/* Blob 2 - More rounded top */
rounded-[70%_30%_30%_70%/60%_40%_60%_40%]

/* Blob 3 - Wider bottom */
rounded-[40%_60%_60%_40%/60%_30%_70%_40%]

/* Blob 4 - Classic organic */
rounded-[60%_40%_30%_70%/60%_30%_70%_40%]

/* Circle - Perfect round */
rounded-full
```

**How to create new variations**:
Format: `rounded-[tl_tr_br_bl/tl_tr_br_bl]`

- First 4 values = horizontal radius
- Last 4 values = vertical radius
- Mix percentages between 30-70% for organic feel

---

## GSAP Animation Patterns

### Floating Animation (for shapes)

```javascript
const shapes = shapesRef.current?.querySelectorAll('.shape')
if (shapes) {
  shapes.forEach((shape, index) => {
    gsap.to(shape, {
      y: 'random(-30, 30)', // Vertical movement
      x: 'random(-20, 20)', // Horizontal movement
      rotation: 'random(-15, 15)', // Slight rotation
      duration: 'random(3, 5)', // Varied speed
      repeat: -1, // Infinite loop
      yoyo: true, // Smooth back-and-forth
      ease: 'sine.inOut', // Smooth easing
      delay: index * 0.2, // Stagger start
    })
  })
}
```

### Entrance Animation (for content)

```javascript
const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

// Bouncy title entrance
tl.from(titleRef.current, {
  y: 100,
  opacity: 0,
  duration: 1.2,
  ease: 'elastic.out(1, 0.8)',
})

  // Staggered subtitle
  .from(
    subtitleRef.current,
    {
      y: 50,
      opacity: 0,
      duration: 0.8,
    },
    '-=0.6',
  ) // Overlap by 0.6s

  // Image pop-in
  .from(
    imageRef.current,
    {
      scale: 0.8,
      opacity: 0,
      duration: 1,
      ease: 'back.out(1.4)',
    },
    '-=0.8',
  )
```

### Parallax Scroll Effect

```javascript
// Image moves slower than scroll
gsap.to(imageRef.current, {
  y: 150,
  scrollTrigger: {
    trigger: heroRef.current,
    start: 'top top',
    end: 'bottom top',
    scrub: 1.5, // Smooth scrolling
  },
})

// Shapes fade and move up
gsap.to(shapesRef.current, {
  y: -100,
  opacity: 0.3,
  scrollTrigger: {
    trigger: heroRef.current,
    start: 'top top',
    end: 'bottom top',
    scrub: 1,
  },
})
```

---

## Typography System

### Fonts

**Display Font** (Headings):

```
font-fredoka
```

- Rounded, friendly, playful
- Weights: 400, 500, 600, 700
- Use for: H1, H2, major headings

**Body Font** (Text):

```
font-quicksand
```

- Clean, readable, friendly
- Weights: 400, 500, 600, 700
- Use for: Paragraphs, subtitles, descriptions

### Typography Scale

```css
/* Hero Title */
text-5xl md:text-6xl lg:text-7xl xl:text-8xl
font-bold

/* Subtitle */
text-xl md:text-2xl lg:text-3xl
font-semibold

/* Body/Description */
text-base md:text-lg lg:text-xl
font-normal
```

### Text Shadows

Add playful depth to headings:

```javascript
style={{ textShadow: '3px 3px 0px rgba(255, 107, 157, 0.2)' }}
```

---

## Image Styling

### Blob-Shaped Image Container

```tsx
<div className="relative w-full h-[500px] md:h-[600px]">
  <div className="relative w-full h-full rounded-[30%_70%_70%_30%/30%_30%_70%_70%] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.15),0_15px_30px_rgba(255,107,157,0.2)] -rotate-3">
    <Image src={imageUrl} alt="..." fill className="object-cover scale-110 rotate-3" priority />
  </div>
</div>
```

Key effects:

- **Organic border-radius** - Blob shape
- **Double shadow** - Depth (black + colored shadow)
- **-rotate-3** on container - Slight tilt
- **rotate-3** on image - Counter-rotate for stability
- **scale-110** - Slight zoom to fill blob edges

---

## Responsive Patterns

### Grid Layout

```tsx
<div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
  <div>{/* Text content */}</div>
  <div>{/* Image */}</div>
</div>
```

### Mobile Optimization

```css
/* Hide shapes on mobile for performance */
@media (max-width: 640px) {
  .shape {
    display: none;
  }
}
```

Or in Tailwind:

```tsx
<div className="hidden sm:block shape..." />
```

---

## Reusable Component Templates

### Section with Decorative Shapes

```tsx
export function DecoratedSection({
  children,
  gradient = 'from-amber-50 via-orange-100 to-amber-200',
}) {
  const shapesRef = useRef(null)

  useEffect(() => {
    const shapes = shapesRef.current?.querySelectorAll('.shape')
    if (shapes) {
      shapes.forEach((shape, index) => {
        gsap.to(shape, {
          y: 'random(-30, 30)',
          x: 'random(-20, 20)',
          rotation: 'random(-15, 15)',
          duration: 'random(3, 5)',
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: index * 0.2,
        })
      })
    }
  }, [])

  return (
    <section className={`relative overflow-hidden bg-gradient-to-br ${gradient} py-20 px-8`}>
      {/* Shapes container */}
      <div ref={shapesRef} className="absolute inset-0 pointer-events-none z-10">
        <div className="shape absolute w-48 h-48 rounded-[30%_70%_70%_30%/30%_30%_70%_70%] bg-gradient-to-br from-pink-400 to-rose-500 opacity-15 top-[10%] left-[5%]" />
        <div className="shape absolute w-36 h-36 rounded-[70%_30%_30%_70%/60%_40%_60%_40%] bg-gradient-to-br from-blue-400 to-cyan-400 opacity-15 top-[60%] left-[10%]" />
        {/* Add more shapes as needed */}
      </div>

      {/* Content */}
      <div className="relative z-20">{children}</div>
    </section>
  )
}
```

### Blob Image Component

```tsx
export function BlobImage({
  src,
  alt,
  rotation = -3,
  borderRadius = '30%_70%_70%_30%/30%_30%_70%_70%',
}) {
  return (
    <div className="relative w-full h-[500px] md:h-[600px]">
      <div
        className={`relative w-full h-full overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.15),0_15px_30px_rgba(255,107,157,0.2)] rotate-${rotation}`}
        style={{ borderRadius }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover scale-110"
          style={{ transform: `rotate(${-rotation}deg)` }}
        />
      </div>
    </div>
  )
}
```

---

## Additional Shape Gradients

Mix and match these for variety:

```css
/* Warm gradients */
from-red-400 to-orange-500
from-orange-400 to-amber-500
from-yellow-400 to-orange-500
from-pink-400 to-rose-500

/* Cool gradients */
from-blue-400 to-cyan-400
from-cyan-400 to-teal-400
from-purple-400 to-pink-500
from-indigo-400 to-blue-500

/* Nature gradients */
from-emerald-400 to-teal-400
from-green-400 to-emerald-500
from-lime-400 to-green-500

/* Pastel gradients */
from-rose-200 to-pink-300
from-blue-200 to-cyan-300
from-purple-200 to-pink-300
from-amber-200 to-orange-300
```

---

## Animation Timing Reference

### Duration Scale

- **Fast**: 0.3s - 0.5s (micro-interactions)
- **Medium**: 0.8s - 1.2s (entrances)
- **Slow**: 2s - 5s (ambient animations)

### Easing Functions

```javascript
'power3.out' // Smooth deceleration
'elastic.out(1, 0.8)' // Bouncy entrance
'back.out(1.4)' // Slight overshoot
'sine.inOut' // Gentle wave motion
```

---

## Best Practices

### Do's ✅

- Use **15% opacity** for background shapes
- Add `pointer-events-none` to decorative elements
- Stagger animation delays for natural feel
- Use `z-index` layers: shapes (10), content (20)
- Hide shapes on mobile for performance
- Keep gradients in warm/pastel range for school vibe

### Don'ts ❌

- Don't use more than 6-8 shapes per section
- Don't animate shapes too fast (3-5s duration minimum)
- Don't use harsh, saturated colors
- Don't block interactive elements with decorations
- Don't forget `overflow-hidden` on section containers

---

## Color Psychology for School Website

### Why These Colors Work

**Warm Amber/Orange**:

- Friendly, welcoming, optimistic
- Associated with creativity and enthusiasm
- Not too stimulating (not bright orange)

**Soft Pastels**:

- Gentle, safe, nurturing
- Not overwhelming for children
- Professional for parents

**Playful Accent Shapes**:

- Pink = warmth, care
- Blue = trust, calm
- Green = growth, nature
- Yellow = happiness, energy

---

## Usage Examples

### Hero Section

Use: Full decoration with all 6 shapes, warm gradient, bouncy animations

### Content Section

Use: 2-3 shapes, lighter gradient or white background, subtle floating

### Footer

Use: 1-2 shapes, muted colors, minimal animation

---

_Save this file and reference it when creating new sections or components with similar aesthetic!_
