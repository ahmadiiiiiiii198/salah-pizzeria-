# Background Image Size Options

If you want to adjust the background image size further, here are the options:

## Current Setting
```css
backgroundSize: '60% auto'
```

## Other Size Options

### Smaller Sizes
- `'40% auto'` - Even smaller, more contained
- `'50% auto'` - Medium small size
- `'30% auto'` - Very small, focused

### Larger Sizes  
- `'70% auto'` - Slightly larger than current
- `'80% auto'` - Larger but not full screen
- `'90% auto'` - Almost full width

### Special Options
- `'contain'` - Fits entire image within container
- `'cover'` - Full screen coverage (original)
- `'auto 80%'` - Fixed height, auto width

## How to Change

Edit the file: `negoziooo/src/components/Hero.tsx`
Find line ~178 and change:
```javascript
backgroundSize: '60% auto',
```

To your preferred size from the options above.

## Current Changes Made
✅ Removed dark overlay
✅ Set background size to 60% width
✅ Added subtle warm background gradient
✅ Reduced decorative elements
✅ Centered the image

Your pizza background image should now be clearly visible and properly sized!
