# Capital City Contractors Website

A modern, responsive website for Capital City Contractors - a professional contracting business specializing in painting, drywall, taping, and carpet installation services.

## 🌟 Features

### Design & User Experience
- **Modern, Professional Design**: Clean aesthetics with a contemporary color scheme
- **Fully Responsive**: Optimized for desktop, tablet, and mobile devices
- **Smooth Animations**: CSS animations and transitions for enhanced user experience
- **Interactive Elements**: Hover effects, smooth scrolling, and dynamic content

### Core Pages
- **Homepage**: Hero section, services preview, about section, testimonials
- **Services**: Detailed service descriptions with pricing and features
- **Portfolio**: Filterable gallery of completed projects
- **About Us**: Company story, team members, certifications
- **Contact**: Contact form, business information, and service areas

### Technical Features
- **SEO Optimized**: Proper meta tags, semantic HTML, and structured data
- **Performance Optimized**: Optimized images, efficient CSS, and minimal JavaScript
- **Accessibility**: WCAG compliant with proper ARIA labels and keyboard navigation
- **Cross-Browser Compatible**: Works on all modern browsers

## 🚀 Getting Started

### Prerequisites
- A modern web browser
- A web server (for local development) or hosting service

### Installation
1. Download or clone the website files
2. Upload to your web server or open `index.html` in a browser for local viewing
3. Replace placeholder images with actual project photos
4. Update contact information and business details

## 📁 File Structure

```
Capital City Contractors - Website/
├── index.html                 # Homepage
├── services.html             # Services page
├── portfolio.html            # Portfolio gallery
├── about.html               # About us page
├── contact.html             # Contact page
├── README.md                # This file
├── assets/
│   ├── css/
│   │   ├── reset.css        # CSS reset/normalize
│   │   ├── variables.css    # CSS custom properties
│   │   ├── base.css         # Base styles and utilities
│   │   ├── components.css   # Component styles
│   │   ├── layout.css       # Layout and section styles
│   │   ├── responsive.css   # Responsive design styles
│   │   └── pages/
│   │       └── home.css     # Homepage specific styles
│   ├── js/
│   │   ├── main.js          # Main JavaScript functionality
│   │   └── portfolio.js     # Portfolio page functionality
│   └── images/
│       ├── logo.svg         # Company logo
│       ├── favicon.ico      # Website favicon
│       ├── hero-bg.jpg      # Hero background image
│       ├── about-*.jpg      # About page images
│       ├── service-*.jpg    # Service images
│       ├── portfolio-*.jpg  # Portfolio images
│       ├── team-*.jpg       # Team member photos
│       └── placeholder-generator.html # Image placeholder guide
```

## 🎨 Customization

### Colors and Branding
The website uses CSS custom properties for easy customization. Edit `assets/css/variables.css` to change:
- Primary colors (blue theme)
- Secondary colors (amber accents)
- Typography settings
- Spacing and layout values

### Content Updates
1. **Business Information**: Update contact details in all HTML files
2. **Services**: Modify service descriptions and pricing in `services.html`
3. **About Content**: Update company story and team information in `about.html`
4. **Portfolio**: Replace placeholder images with actual project photos

### Images
Replace placeholder images with high-quality photos:
- **Hero Background**: 1920x1080px professional contracting scene
- **Service Images**: 400x300px each service type
- **Portfolio Images**: 500x350px completed projects
- **Team Photos**: 300x400px professional headshots
- **About Images**: 600x400px company/team photos

Recommended sources for stock images:
- [Unsplash](https://unsplash.com) - Search: "construction", "painting", "contractors"
- [Pexels](https://pexels.com) - Search: "home renovation", "drywall", "carpet installation"

## 📱 Responsive Design

The website is built with a mobile-first approach and includes:
- **Mobile**: Optimized for phones (320px+)
- **Tablet**: Enhanced layout for tablets (768px+)
- **Desktop**: Full-featured desktop experience (1024px+)
- **Large Screens**: Optimized for large displays (1400px+)

## 🔧 Browser Support

- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📈 SEO Features

- Semantic HTML5 structure
- Optimized meta descriptions and titles
- Open Graph tags for social sharing
- Structured data markup
- Fast loading times
- Mobile-friendly design

## 🚀 Deployment

### Local Development
1. Use a local server (Live Server extension in VS Code, Python's http.server, etc.)
2. Open `index.html` in your browser

### Web Hosting
1. Upload all files to your web hosting service
2. Ensure the domain points to the root directory containing `index.html`
3. Test all pages and functionality

### Performance Optimization
- Compress images before uploading
- Enable gzip compression on your server
- Use a CDN for faster global loading
- Consider implementing a service worker for caching

## 📞 Contact Form Setup

The contact form currently shows success/error messages via JavaScript. To make it functional:

1. **Backend Integration**: Connect to a server-side script (PHP, Node.js, etc.)
2. **Email Service**: Use services like EmailJS, Formspree, or Netlify Forms
3. **Database**: Store submissions in a database for follow-up

Example PHP integration:
```php
<?php
if ($_POST['email']) {
    // Process form data
    // Send email
    // Return JSON response
}
?>
```

## 🔒 Security Considerations

- Validate all form inputs on both client and server side
- Use HTTPS for the live website
- Implement CSRF protection for forms
- Sanitize user inputs to prevent XSS attacks

## 📊 Analytics

Add Google Analytics or similar tracking:
```html
<!-- Add to <head> section of all pages -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## 🤝 Contributing

To improve this website:
1. Test on different devices and browsers
2. Optimize images and performance
3. Add new features or pages as needed
4. Update content regularly

## 📄 License

This website template is provided as-is for Capital City Contractors. Modify and use as needed for your business.

## 🆘 Support

For technical support or customization help:
1. Check browser developer tools for errors
2. Validate HTML and CSS
3. Test on multiple devices
4. Consider hiring a web developer for major modifications

---

**Built with modern web technologies for optimal performance and user experience.**
