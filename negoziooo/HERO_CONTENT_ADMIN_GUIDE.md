# Hero Content Admin Panel Guide

## Overview
The hero section now supports fully customizable text content through the admin panel. All text displayed in the hero section can be edited and updated in real-time.

## New Editable Fields

### Main Hero Text Fields
1. **Welcome Message** (`welcomeMessage`)
   - Default: "BENVENUTI DA FLEGREA"
   - Displays as large bold text at the top
   - Style: Uppercase, bold, white text with glow effect

2. **Pizza Type** (`pizzaType`)
   - Default: "la Pizza Napoletana"
   - Displays as elegant script typography
   - Style: Large italic serif font with golden gradient

3. **Subtitle** (`subtitle`)
   - Default: "ad Alta Digeribilità, anche Gluten Free!"
   - Descriptive text below pizza type
   - Style: Medium size, light weight, white text

4. **Opening Hours** (`openingHours`)
   - Default: "APERTO 7 SU 7 DALLE 19"
   - Displays in a modern card with clock icon
   - Style: Card format with backdrop blur effect

5. **Button Text** (`buttonText`)
   - Default: "PRENOTA IL TUO TAVOLO"
   - Main call-to-action button text
   - Style: Bold text on gradient button

### Legacy Fields (Backward Compatibility)
- **Legacy Heading** (`heading`) - Optional, for backward compatibility
- **Legacy Subheading** (`subheading`) - Optional, for backward compatibility

## How to Edit Hero Content

### Access the Admin Panel
1. Navigate to `/admin` in your browser
2. Log in with admin credentials
3. Find the "Hero Section Editor" card

### Edit Text Fields
1. Each text field has a clear label and placeholder
2. Type your desired text in the input fields
3. See live preview of your changes in the preview section
4. Click "Save Changes" to apply updates

### Preview Changes
- The preview section shows how each field will appear
- Different styling is applied to show the visual hierarchy
- Changes are reflected immediately after saving

## Technical Implementation

### Database Structure
```json
{
  "heroContent": {
    "welcomeMessage": "BENVENUTI DA FLEGREA",
    "pizzaType": "la Pizza Napoletana", 
    "subtitle": "ad Alta Digeribilità, anche Gluten Free!",
    "openingHours": "APERTO 7 SU 7 DALLE 19",
    "buttonText": "PRENOTA IL TUO TAVOLO",
    "heading": "Legacy heading",
    "subheading": "Legacy subheading",
    "backgroundImage": "image_url",
    "heroImage": "image_url"
  }
}
```

### Files Modified
- `src/components/Hero.tsx` - Updated to use dynamic text
- `src/components/admin/HeroContentEditor.tsx` - Added form fields for all text
- `src/hooks/use-settings.tsx` - Updated default content and types
- `src/types/hero.ts` - Added TypeScript type definitions
- Database: Updated `settings` table with new fields

### Type Safety
- Full TypeScript support with `HeroContent` interface
- Type-safe hooks and components
- Proper error handling and validation

## Best Practices

### Text Content Guidelines
- Keep welcome message short and impactful
- Pizza type should be descriptive but concise
- Subtitle can include key selling points
- Opening hours should be clear and accurate
- Button text should be action-oriented

### Character Limits
- Welcome Message: 50 characters recommended
- Pizza Type: 30 characters recommended  
- Subtitle: 80 characters recommended
- Opening Hours: 40 characters recommended
- Button Text: 25 characters recommended

## Troubleshooting

### Changes Not Appearing
1. Check if you clicked "Save Changes"
2. Refresh the homepage
3. Clear browser cache if needed
4. Check browser console for errors

### Admin Panel Issues
1. Ensure you're logged in as admin
2. Check network connection
3. Verify database connectivity
4. Check browser console for errors

## Future Enhancements
- Multi-language support for hero text
- Rich text formatting options
- A/B testing capabilities
- Scheduled content changes
- Analytics integration
