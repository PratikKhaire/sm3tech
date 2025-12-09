# SM3Tech Codebase Index

> Business compliance & audit management system built with Next.js 14

---

## 🛠️ Tech Stack

| Technology           | Purpose                      |
| -------------------- | ---------------------------- |
| Next.js 14           | React framework (App Router) |
| TypeScript           | Type safety                  |
| Tailwind CSS         | Styling                      |
| MongoDB/Mongoose     | Database                     |
| Clerk                | Authentication               |
| shadcn/ui + Radix UI | UI components                |
| UploadThing          | File uploads                 |
| React Query          | Data fetching                |
| Framer Motion        | Animations                   |
| Recharts             | Charts                       |
| Zod                  | Form validation              |

---

## 📂 Directory Structure

```
sm3tech/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (home)/             # Public pages
│   │   │   ├── services/       # Service pages
│   │   │   │   ├── all/
│   │   │   │   ├── factory-act/
│   │   │   │   └── mpcb/
│   │   │   └── inspection-view/
│   │   ├── (main)/             # Protected pages
│   │   │   └── agency/
│   │   │       └── (auth)/
│   │   ├── admin/              # Admin pages
│   │   ├── api/                # API routes
│   │   │   ├── admin/
│   │   │   ├── user/
│   │   │   ├── uploadthing/
│   │   │   └── webhooks/
│   │   ├── error/
│   │   ├── test-admin/
│   │   └── unauthorized/
│   ├── components/
│   │   ├── forms/              # Form components
│   │   ├── ui/                 # shadcn UI (48 components)
│   │   └── global/
│   ├── controllers/            # Business logic
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Utilities
│   └── models/                 # Database models
├── public/                     # Static assets
└── scripts/
```

---

## 📄 Key Files

### Database Models (`src/models/`)

| File                             | Purpose                    |
| -------------------------------- | -------------------------- |
| `agency.model.ts`                | Agency/company data schema |
| `document.model.ts`              | Document metadata          |
| `factoryLicenseDetails.model.ts` | Factory license records    |
| `user.model.ts`                  | User accounts              |

### Library (`src/lib/`)

| File             | Purpose                  |
| ---------------- | ------------------------ |
| `auth.ts`        | Authentication helpers   |
| `db.ts`          | MongoDB connection       |
| `queries.ts`     | Database CRUD operations |
| `uploadthing.ts` | File upload config       |
| `utils.ts`       | General utilities        |

### Controllers (`src/controllers/`)

| File                   | Purpose               |
| ---------------------- | --------------------- |
| `agency.controller.ts` | Agency business logic |
| `user.controller.ts`   | User business logic   |

### Main Components (`src/components/`)

| File              | Purpose               |
| ----------------- | --------------------- |
| `Dashboard.tsx`   | Main dashboard view   |
| `Home.tsx`        | Homepage component    |
| `header.tsx`      | Navigation header     |
| `side-nav.tsx`    | Sidebar navigation    |
| `file-upload.tsx` | File upload component |

### Forms (`src/components/forms/`)

| Form                                | Purpose                |
| ----------------------------------- | ---------------------- |
| `agency-details.tsx`                | Agency registration    |
| `factorylicense-details.tsx`        | Factory license form   |
| `consent-to-establish.tsx`          | CTE application        |
| `consent-to-operate.tsx`            | CTO application        |
| `plan-approval.tsx`                 | Plan approval form     |
| `safety-audit-report.tsx`           | Safety audit form      |
| `stability-certificate-details.tsx` | Stability certificates |
| `testing-calibration.tsx`           | Testing & calibration  |
| `admin-view.tsx`                    | Admin form view        |
| `user-view.tsx`                     | User form view         |

### Hooks (`src/hooks/`)

| File             | Purpose              |
| ---------------- | -------------------- |
| `use-scroll.tsx` | Scroll behavior hook |

---

## 🔌 API Routes (`src/app/api/`)

| Route               | Purpose                |
| ------------------- | ---------------------- |
| `/api/admin/`       | Admin operations       |
| `/api/user/`        | User operations        |
| `/api/uploadthing/` | File upload endpoints  |
| `/api/webhooks/`    | Clerk webhook handlers |

---

## 🎨 UI Components (`src/components/ui/`)

48 shadcn/ui components including:

- Layout: `card`, `accordion`, `tabs`, `sheet`, `dialog`
- Forms: `input`, `select`, `checkbox`, `radio-group`, `switch`, `form`
- Feedback: `toast`, `alert`, `progress`, `skeleton`
- Navigation: `navigation-menu`, `menubar`, `breadcrumb`, `pagination`
- Data Display: `table`, `avatar`, `badge`, `calendar`, `chart`
- Overlay: `dropdown-menu`, `popover`, `tooltip`, `hover-card`

---

## 🚀 Scripts

```bash
npm run dev     # Development server
npm run build   # Production build
npm run start   # Production server
npm run lint    # ESLint
```

---

## 📝 Configuration Files

| File                 | Purpose               |
| -------------------- | --------------------- |
| `next.config.mjs`    | Next.js config        |
| `tailwind.config.ts` | Tailwind CSS config   |
| `tsconfig.json`      | TypeScript config     |
| `components.json`    | shadcn/ui config      |
| `.env`               | Environment variables |
