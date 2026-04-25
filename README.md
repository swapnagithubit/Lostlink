# LostLink

A full-stack web application to help users find and report lost or found items. Connect with your community to recover lost belongings and help others find theirs.

## Features

- **Report Lost Items**: Create detailed reports with photos and descriptions
- **Report Found Items**: Help reunite found items with their owners
- **Search & Browse**: Browse listings of lost and found items
- **User Authentication**: Secure user registration and login
- **Item Matching**: Smart matching algorithm to connect lost and found items
- **Dashboard**: Personal dashboard to manage your reports
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Project Structure

```
LostLink/
├── backend/              # Node.js/Express API server
│   ├── config/          # Database configuration
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Authentication middleware
│   ├── models/          # Database models (User, Item)
│   ├── routes/          # API routes
│   ├── utils/           # Utility functions (matcher algorithm)
│   ├── server.js        # Express server entry point
│   └── package.json     # Backend dependencies
│
└── lostfrontend/        # Next.js/React frontend
    ├── app/             # Next.js app directory
    │   ├── dashboard/   # User dashboard
    │   ├── items/       # Items listing and detail pages
    │   ├── login/       # Login page
    │   ├── report/      # Report found/lost items
    │   └── signup/      # Registration page
    ├── components/      # React components
    ├── lib/             # Utilities and API client
    ├── hooks/           # Custom React hooks
    ├── public/          # Static assets
    └── package.json     # Frontend dependencies
```

## Tech Stack

### Backend
- **Node.js** with Express.js
- **Database**: (configured in `backend/config/db.js`)
- **Authentication**: JWT-based authentication

### Frontend
- **Next.js** 14+ (React framework)
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **shadcn/ui** component library

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or pnpm

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/swapnagithubit/Lostlink.git
cd LostLink
```

2. **Backend Setup**
```bash
cd backend
npm install
# Configure your database in config/db.js
npm start
```

3. **Frontend Setup**
```bash
cd ../lostfrontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Usage

### For Lost Item Owners
1. Sign up or log in
2. Go to "Report Lost Item"
3. Provide item details, photos, and location
4. Monitor your dashboard for matches

### For Good Samaritans
1. Sign up or log in
2. Go to "Report Found Item"
3. Add item details and photos
4. Help reunite items with their owners

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login

### Items
- `GET /api/items` - Get all items
- `GET /api/items/:id` - Get item details
- `POST /api/items` - Create new item report
- `PUT /api/items/:id` - Update item
- `DELETE /api/items/:id` - Delete item

## Matching Algorithm

The matcher utility (`backend/utils/matcher.js`) uses intelligent algorithms to suggest potential matches between lost and found items based on:
- Item type and category
- Location proximity
- Description similarity
- Time proximity

## Contributing

We welcome contributions! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Support

For issues, questions, or suggestions, please create an issue on GitHub.

---

**Made with ❤️ to help reunite lost items with their owners**
