# 📝 Code Snippet Manager

A modern, feature-rich code snippet management application built with Angular 20. Organize, search, and manage your code snippets efficiently with a beautiful, responsive interface.

## ✨ Features

### 🎯 Core Functionality

- **CRUD Operations** - Create, read, update, and delete code snippets
- **Local Storage** - All data stored locally in your browser (no backend required)
- **Search & Filter** - Advanced search with multiple criteria
- **Categories & Tags** - Organize snippets with categories and tags
- **Favorites** - Mark snippets as favorites for quick access

### 🎨 User Interface

- **Modern Design** - Clean, responsive UI with gradient backgrounds
- **Dark/Light Theme** - Customizable theme options
- **Mobile-First** - Fully responsive design for all devices
- **Intuitive Navigation** - Easy-to-use navigation with active states

### 🔧 Technical Features

- **Angular 20** - Built with the latest Angular framework
- **Standalone Components** - Modern Angular architecture
- **TypeScript** - Full type safety throughout the application
- **Reactive Programming** - RxJS and signals for reactive data flow
- **Lazy Loading** - Optimized performance with lazy-loaded routes

## 🚀 Quick Start

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. **Navigate to the project directory:**

   ```bash
   cd angular-project
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the development server:**

   ```bash
   npm start
   ```

4. **Open your browser:**
   Navigate to `http://localhost:4200`

### Build for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## 📁 Project Structure

```
src/
├── app/
│   ├── models/                 # TypeScript interfaces and models
│   │   └── snippet.model.ts
│   ├── services/               # Business logic and data management
│   │   └── snippet.service.ts
│   ├── pages/                  # Feature components
│   │   ├── dashboard/          # Main dashboard
│   │   ├── snippet-list/       # Snippet listing and filtering
│   │   ├── snippet-form/       # Add/Edit snippet form
│   │   ├── snippet-detail/     # Snippet detail view
│   │   ├── search/             # Advanced search
│   │   ├── categories/         # Category management
│   │   ├── tags/               # Tag management
│   │   └── settings/           # Application settings
│   ├── app.ts                  # Main app component
│   ├── app.html                # App template
│   ├── app.css                 # Global styles
│   └── app.routes.ts           # Routing configuration
├── index.html                  # Main HTML file
├── main.ts                     # Application bootstrap
└── styles.css                  # Global styles
```

## 🎯 Usage Guide

### Adding Snippets

1. Click "Add New Snippet" from the dashboard or navigation
2. Fill in the title, description, and code
3. Select a language and category
4. Add tags for better organization
5. Save your snippet

### Searching Snippets

1. Use the search bar for quick text-based searches
2. Visit the Search page for advanced filtering
3. Filter by category, language, tags, or date range
4. Use the favorites filter to see only starred snippets

### Managing Categories

1. Go to the Categories page
2. Add new categories with custom colors
3. Categories help organize your snippets by type

### Managing Tags

1. Tags are automatically created when you add them to snippets
2. View all tags on the Tags page
3. See usage statistics for each tag

## 🛠️ Development

### Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm run watch` - Build and watch for changes
- `npm test` - Run unit tests

### Key Technologies

- **Angular 20** - Frontend framework
- **TypeScript** - Programming language
- **RxJS** - Reactive programming
- **CSS3** - Styling with modern features
- **HTML5** - Markup language

### Data Storage

All data is stored in the browser's localStorage:

- `code-snippet-manager` - Snippets data
- `snippet-categories` - Categories data
- `snippet-tags` - Tags data
- `snippet-manager-settings` - User preferences

## 🎨 Customization

### Themes

The application supports light and dark themes. You can change the theme in the Settings page.

### Colors

Category and tag colors are customizable. The application uses a modern color palette with CSS custom properties.

### Fonts

The application uses system fonts for optimal performance and cross-platform compatibility.

## 📱 Responsive Design

The application is fully responsive and works on:

- Desktop computers
- Tablets
- Mobile phones
- Various screen sizes

## 🔒 Data Privacy

- All data is stored locally in your browser
- No data is sent to external servers
- You have full control over your data
- Export/import functionality for data portability

## 🚀 Future Enhancements

Potential features for future versions:

- Cloud synchronization
- Team collaboration
- Code syntax highlighting with Monaco Editor
- Plugin system
- API integration
- Advanced search with regex support

## 🤝 Contributing

This is a demo project, but contributions are welcome! Feel free to:

- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Built with Angular 20
- Inspired by modern code snippet managers
- Uses modern web technologies and best practices

---

**Happy Coding! 🎉**

For questions or support, please refer to the Angular documentation or create an issue in the project repository.
