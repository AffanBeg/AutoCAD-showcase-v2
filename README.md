# 🎨 Showcase3D

> A modern web application for uploading, converting, and sharing CAD files with interactive 3D visualization

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.3-blue?style=flat-square&logo=react)](https://reactjs.org/)
[![Three.js](https://img.shields.io/badge/Three.js-0.160-black?style=flat-square&logo=three.js)](https://threejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-green?style=flat-square&logo=supabase)](https://supabase.com/)

## 📋 Overview

**Showcase3D** is a full-stack web application that allows engineers and designers to upload CAD files (STEP, OBJ, STL), automatically convert them to STL format using a cloud-based processing pipeline, and share interactive 3D models via public links. The application features real-time conversion status tracking, user authentication, and a responsive 3D viewer powered by Three.js.

### 🌟 Key Features

- **🔄 Automated CAD Conversion** - Upload STEP, OBJ, or STL files and automatically convert them to optimized STL format
- **☁️ Cloud Processing** - Leverages Google Cloud Engine (GCE) VMs with FreeCAD Docker containers for reliable conversions
- **🎯 Interactive 3D Viewer** - Real-time 3D model visualization using Three.js and React Three Fiber
- **🔐 User Authentication** - Secure authentication and user management via Supabase Auth
- **📊 Dashboard Management** - Track conversion status, manage showcases, and control visibility settings
- **🔗 Shareable Links** - Generate public, unlisted, or private links to share 3D models
- **📱 Responsive Design** - Modern, mobile-friendly UI built with Tailwind CSS
- **⚡ Real-time Updates** - Live status updates during file processing

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 14.2 (App Router)
- **UI Library:** React 18.3
- **3D Graphics:** Three.js, React Three Fiber, Drei
- **Styling:** Tailwind CSS
- **Language:** TypeScript
- **Validation:** Zod

### Backend
- **Database & Auth:** Supabase (PostgreSQL + Auth)
- **Storage:** Supabase Storage (file uploads & conversions)
- **Processing:** Python worker with FreeCAD
- **Infrastructure:** Google Cloud Engine (GCE) VM
- **Containerization:** Docker & Docker Compose

## 🚀 Getting Started

### Prerequisites

Before running this project locally, ensure you have:

- **Node.js** (v18.x or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** - Package manager
- **Supabase Account** - [Sign up](https://supabase.com/)
- **Git** - Version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/showcase3d.git
   cd showcase3d
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Copy the example environment file and configure it:
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` with your configuration:

   ```env
   # --- Supabase Configuration ---
   # Get these from: https://app.supabase.com/project/_/settings/api
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

   # --- Storage Buckets ---
   # Create these buckets in Supabase Storage dashboard
   SUPABASE_STORAGE_BUCKET_UPLOADS=cad-uploaded
   SUPABASE_STORAGE_BUCKET_CONVERTED=cad-converted

   # --- Application Settings ---
   NODE_ENV=development
   NEXT_PUBLIC_APP_NAME=Showcase3D
   NEXT_PUBLIC_APP_URL=http://localhost:3000

   # --- Google Cloud VM (Optional for local dev) ---
   # Only needed if running the conversion worker
   GCE_SSH_HOST=your-vm-ip
   GCE_SSH_USER=your-username
   GCE_SSH_KEY_PATH=path/to/your/ssh/key
   FREECAD_DOCKER_IMAGE=freecad/freecad:latest
   POLL_INTERVAL_SECONDS=5
   ```

4. **Configure Supabase**

   Create the following in your Supabase project:

   **a) Storage Buckets:**
   - Navigate to Storage in Supabase Dashboard
   - Create bucket `cad-uploaded` (for original files)
   - Create bucket `cad-converted` (for STL outputs)
   - Set appropriate permissions (authenticated users for uploads, public for converted)

   **b) Database Schema:**
   - Create a `showcases` table with columns:
     - `id` (uuid, primary key)
     - `user_id` (uuid, foreign key to auth.users)
     - `title` (text)
     - `slug` (text, unique)
     - `status` (text: 'uploaded' | 'processing' | 'ready' | 'failed')
     - `visibility` (text: 'public' | 'unlisted' | 'private')
     - `created_at` (timestamp)
     - `original_filename` (text)
     - `converted_filename` (text, nullable)

5. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

### 🔧 Running Locally (Development Mode)

Once installed, you can run the application in different modes:

**Development server with hot reload:**
```bash
npm run dev
```
Access at `http://localhost:3000`

**Production build (local):**
```bash
npm run build
npm run start
```

**Linting:**
```bash
npm run lint
```

### 📁 Project Structure

```
showcase3d/
├── app/                      # Next.js 14 App Router
│   ├── (auth)/              # Authentication routes (login)
│   ├── auth/callback/       # OAuth callback handler
│   ├── dashboard/           # User dashboard & showcase management
│   ├── s/[slug]/            # Public showcase viewer pages
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Homepage
├── components/              # React components
│   ├── AuthProvider.tsx     # Authentication context
│   ├── ShowcaseCard.tsx     # Showcase preview cards
│   └── ...                  # Other UI components
├── lib/                     # Utility functions
│   ├── db.ts               # Supabase database queries
│   └── supabase.ts         # Supabase client configuration
├── worker/                  # Python conversion worker
│   ├── worker.py           # Background job processor
│   ├── convert_to_stl.py   # FreeCAD conversion logic
│   ├── Dockerfile          # Docker container definition
│   └── docker-compose.yml  # Docker Compose configuration
├── public/                  # Static assets
├── styles/                  # Global styles
└── package.json            # Project dependencies
```

## ☁️ Cloud Architecture

The application uses a **distributed architecture** for scalable CAD file processing:

```
User → Next.js Frontend → Supabase (Storage + DB)
                              ↓
                    Google Cloud Engine VM
                              ↓
                    Docker Worker (FreeCAD)
                              ↓
                    Converted STL → Supabase Storage
```

1. **User uploads CAD file** via the Next.js frontend
2. **File stored** in Supabase Storage (`cad-uploaded` bucket)
3. **Worker polls** Supabase for new uploads (status: 'uploaded')
4. **FreeCAD processes** the file in a Docker container on GCE VM
5. **Converted STL** uploaded to Supabase Storage (`cad-converted` bucket)
6. **Status updated** to 'ready', user can view/share the 3D model

## 🐳 Deploy Conversion Worker (Google Cloud Engine)

The conversion worker runs on a GCE VM and processes CAD files in the background.

### 1️⃣ Set up GCE VM

Create a VM instance with:
- **OS:** Ubuntu 20.04 LTS or higher
- **Machine Type:** e2-medium (2 vCPU, 4 GB memory) minimum
- **Disk:** 20 GB SSD
- **Firewall:** Allow SSH (port 22)

### 2️⃣ SSH into the VM

```bash
# Replace with your actual IP and key path
ssh -i ~/.ssh/google_compute_engine -o "IdentitiesOnly=yes" username@35.192.97.17
```

### 3️⃣ Install Docker

```bash
# Update package list
sudo apt update

# Install Docker and Docker Compose
sudo apt install -y docker.io docker-compose

# Add your user to the docker group (avoid sudo)
sudo usermod -aG docker $USER

# Apply group changes
newgrp docker

# Verify installation
docker --version
docker-compose --version
```

### 4️⃣ Configure Worker Environment

```bash
# Create application directory
mkdir -p ~/app
cd ~/app

# Create .env file with Supabase credentials
nano .env
```

Add the following to `.env`:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
SUPABASE_STORAGE_BUCKET_UPLOADS=cad-uploaded
SUPABASE_STORAGE_BUCKET_CONVERTED=cad-converted
POLL_INTERVAL_SECONDS=5
```

**⚠️ Security Note:** Only use the `SUPABASE_SERVICE_ROLE_KEY` on the server. Never expose it in client-side code.

### 5️⃣ Deploy Worker Files

Transfer the `worker/` directory to the VM:
```bash
# From your local machine
scp -r -i ~/.ssh/google_compute_engine worker/ username@35.192.97.17:~/app/
```

### 6️⃣ Build and Run Worker

```bash
cd ~/app/worker

# Build and start the worker in detached mode
docker compose up -d --build

# View logs (real-time)
docker compose logs -f

# Check status
docker compose ps
```

### 7️⃣ Worker Management

```bash
# Stop the worker
docker compose down

# Restart the worker
docker compose restart

# Rebuild after code changes
docker compose up -d --build

# View recent logs
docker compose logs --tail=100
```

## 🌐 Deployment (Production)

### Frontend (Vercel - Recommended)

1. **Connect your GitHub repository** to Vercel
2. **Set environment variables** in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - All other variables from `.env.example`
3. **Deploy** - Vercel will automatically build and deploy

### Alternative: Deploy to Netlify, Railway, or any Node.js host

The application is a standard Next.js app and can be deployed to any platform supporting Node.js.

## 📝 Usage

1. **Sign up / Log in** using the authentication system
2. **Navigate to Dashboard** to view your showcases
3. **Upload a CAD file** (STEP, OBJ, or STL format)
4. **Monitor conversion status** in real-time
5. **View the 3D model** once conversion completes
6. **Share the link** with others (set visibility to public/unlisted)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

**Built with ❤️ using Next.js, Three.js, and Supabase**
