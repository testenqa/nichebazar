# NicheBazar - Business Directory Web App

A modern, responsive business listing directory built with Next.js, TypeScript, and Tailwind CSS. This web application allows users to discover and explore businesses across various categories with an intuitive search and filtering system.

## Features

- 🏢 **Business Grid Display**: Beautiful card-based layout showcasing business information
- 🔍 **Advanced Search**: Search businesses by name, description, tags, or location
- 🏷️ **Category Filtering**: Filter businesses by industry categories
- ⭐ **Rating System**: Visual star ratings with review counts
- 📱 **Responsive Design**: Mobile-first approach with modern UI/UX
- 🎨 **Modern Design**: Clean, professional interface using Tailwind CSS
- ✅ **Verification Badges**: Visual indicators for verified businesses
- 🏷️ **Tag System**: Business categorization with multiple tags

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Heroicons
- **State Management**: React Hooks (useState, useMemo)
- **Build Tool**: Next.js built-in bundler

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nichebazar
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to view the application.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

```
nichebazar/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles and Tailwind imports
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Main landing page
├── components/             # Reusable UI components
│   ├── BusinessCard.tsx   # Business display card
│   ├── SearchBar.tsx      # Search input component
│   └── CategoryFilter.tsx # Category filter buttons
├── data/                  # Sample data and mock content
│   └── businesses.ts      # Business data and categories
├── lib/                   # Utility functions
│   └── utils.ts          # Class name utilities
├── types/                 # TypeScript type definitions
│   └── business.ts       # Business and category interfaces
├── public/                # Static assets
├── package.json           # Dependencies and scripts
├── tailwind.config.js     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
└── README.md              # Project documentation
```

## Business Data Structure

Each business in the directory includes:

- **Basic Info**: Name, description, category
- **Contact Details**: Phone, email, website, address
- **Location**: City, state, zip code
- **Ratings**: Star rating and review count
- **Tags**: Multiple categorization tags
- **Verification**: Verified business status
- **Metadata**: Creation date and unique ID

## Customization

### Adding New Businesses

Edit `data/businesses.ts` to add new business entries:

```typescript
{
  id: 'unique-id',
  name: 'Business Name',
  description: 'Business description...',
  category: 'Category Name',
  // ... other fields
}
```

### Modifying Categories

Update the `businessCategories` array in the same file to add or modify business categories.

### Styling Changes

The application uses Tailwind CSS with custom CSS variables. Modify `app/globals.css` for theme changes or `tailwind.config.js` for configuration updates.

## Features in Detail

### Search Functionality
- Real-time search across business names, descriptions, tags, and locations
- Case-insensitive matching
- Instant results as you type

### Category Filtering
- Visual category buttons with emoji icons
- Single category selection
- Easy reset to show all categories

### Business Cards
- Responsive grid layout (1-4 columns based on screen size)
- Hover effects and smooth transitions
- Comprehensive business information display
- Verification badges for trusted businesses

### Responsive Design
- Mobile-first approach
- Adaptive grid layouts
- Touch-friendly interface elements

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For questions or support, please open an issue in the repository or contact the development team.

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**
