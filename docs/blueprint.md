# **App Name**: Blogify CMS

## Core Features:

- Real-Time Blog Display: Display blog posts in real-time using Firestore's onSnapshot listener.
- Admin Authentication: Secure admin dashboard access using a custom token.
- Post Creation: Create new blog posts with a title, content, author, and publish status.
- Post Editing: Edit existing blog posts and update Firestore in real-time.
- Post Deletion: Delete blog posts from Firestore, updating the public view in real-time.
- Admin Login Modal: A modal that authenticates the admin based on the secretadmin123 key.

## Style Guidelines:

- Primary color: Soft blue (#64B5F6) to provide a calm, trustworthy feel.
- Background color: Light gray (#F5F5F5), a desaturated variant of the primary color to ensure a neutral backdrop that enhances content visibility.
- Accent color: Subtle light green (#A5D6A7) for interactive elements, creating contrast but still complementary.
- Font: 'Inter' (sans-serif) for a modern, machined, objective feel, for both headings and body text.
- Use a responsive layout with Tailwind CSS for optimal viewing on different devices.
- Simple, outlined icons for clear and intuitive navigation.
- Subtle loading spinner while fetching data from Firestore.