# Analytics Configuration

## Google Analytics Setup

1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new property for your website
3. Get your Measurement ID (format: G-XXXXXXXXXX)
4. Replace `GA_MEASUREMENT_ID` in `index.html` with your actual ID

Example:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-ABC123XYZ"></script>
```

## Facebook Pixel Setup (Optional)

1. Go to [Facebook Events Manager](https://business.facebook.com/events_manager)
2. Create a new pixel
3. Get your Pixel ID
4. Uncomment the Facebook Pixel code in `index.html`
5. Replace `YOUR_PIXEL_ID` with your actual Pixel ID

## Other Tracking Tools

### Google Tag Manager (Alternative to GA)
1. Create account at [Google Tag Manager](https://tagmanager.google.com/)
2. Add GTM container code to `index.html`
3. Configure tags through GTM interface

### Hotjar (Heatmaps & Session Recording)
1. Sign up at [Hotjar](https://www.hotjar.com/)
2. Add tracking code to `index.html`

### Microsoft Clarity (Free Analytics)
1. Sign up at [Microsoft Clarity](https://clarity.microsoft.com/)
2. Add tracking code to `index.html`

## GDPR Compliance

The cookie consent banner is already implemented and includes:
- ✅ Cookie banner with accept/decline options
- ✅ Privacy policy modal
- ✅ LocalStorage to remember user choice
- ✅ Analytics only loads after user consent
- ✅ Bilingual support (Finnish/English)

## Testing

1. Clear browser localStorage
2. Reload the page
3. Cookie banner should appear after 1 second
4. Accept cookies to enable tracking
5. Decline to disable tracking

## Analytics Events to Track

Consider adding custom events for:
- Menu item clicks
- Phone number clicks
- Menu category changes
- Language switches
- Theme toggles
- Form submissions (if added)
- Social media link clicks

Example custom event:
```javascript
gtag('event', 'phone_click', {
  'event_category': 'engagement',
  'event_label': 'Header Phone'
});
```
