# FixYourCity

A modern community issue reporting application built with Laravel, React, and TypeScript. Users can report local problems like trash, broken roads, and broken lights. Admins can verify, reject, and resolve reports.

## Tech Stack

- **Backend**: Laravel 11+ with Eloquent ORM
- **Frontend**: React 18+ with TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Maps**: MapLibre GL JS
- **Package Manager**: pnpm
- **Database**: SQLite (default)
- **Build Tool**: Vite

## Prerequisites

Make sure you have the following installed:

- PHP 8.3+
- Composer
- Node.js 18+
- pnpm
- Git

### Verify installations

```bash
php -v
composer -V
node -v
pnpm -v
git --version
```

## Quick Start

### 1. Clone and Navigate

```bash
git clone <repository-url>
cd FixYourCity
```

### 2. Install Dependencies

```bash
composer install
pnpm install
```

### 3. Setup Environment

```bash
cp .env.example .env
php artisan key:generate
```

### 4. Database Setup

```bash
php artisan migrate
php artisan db:seed
```

### 5. Run Development Server

**Terminal 1 - Backend**:
```bash
php artisan serve
```

**Terminal 2 - Frontend**:
```bash
pnpm run dev
```

Visit `http://localhost:8000` in your browser.

## Project Structure

```
FixYourCity/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   ├── Middleware/
│   │   └── Requests/
│   ├── Models/
│   │   ├── Report.php
│   │   ├── User.php
│   │   ├── Comment.php
│   │   ├── City.php
│   │   └── ...
│   └── Policies/
├── resources/
│   ├── js/
│   │   ├── pages/
│   │   ├── components/
│   │   └── hooks/
│   └── views/
├── routes/
│   ├── web.php
│   └── api.php
├── database/
│   ├── migrations/
│   ├── factories/
│   └── seeders/
└── config/
```

## Database Schema

### Users
- id, email, password, name, role (user/admin/moderator)

### Reports
- id, user_id, title, description, category, status, latitude, longitude, city_id

### ReportImages
- id, report_id, image_path

### Comments
- id, report_id, user_id, content

### Cities
- id, name

### Verifications
- id, report_id, verified_by, status, note

### ReportStatusHistories
- id, report_id, from_status, to_status, changed_by

## Features

### Public Features
- View all reports on homepage
- See reports with map markers
- Filter reports by category and status

### User Features
- Register and login
- Create new report with:
  - Title and description
  - Category selection
  - Location via map or current location
  - Image upload
- View own reports
- Add comments to reports

### Admin Features
- Access admin dashboard
- View all reports
- Change report status (verified, rejected, resolved)
- Delete reports
- View user management

## User Roles

- **User**: Can create and view reports
- **Admin**: Full access to dashboard and report management
- **Moderator**: Can verify and change status of reports

## Environment Variables

Create a `.env` file with:

```
APP_NAME=FixYourCity
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=sqlite
DB_DATABASE=database/database.sqlite

MAIL_MAILER=log
```

## Available Commands

### Backend

```bash
php artisan serve                 # Start Laravel server
php artisan migrate              # Run migrations
php artisan migrate:fresh --seed # Reset and seed database
php artisan tinker               # Interactive shell
```

### Frontend

```bash
pnpm run dev      # Start dev server
pnpm run build    # Build for production
pnpm run preview  # Preview production build
pnpm run lint     # Run linter
```

## Routes

### Public Routes
- `GET /` - Homepage with all reports
- `GET /reports/{id}` - View report details
- `GET /login` - Login page
- `GET /register` - Registration page

### Authenticated Routes
- `GET /reports/create` - Create new report
- `POST /reports` - Store report
- `GET /reports/{id}/edit` - Edit report
- `PUT /reports/{id}` - Update report
- `DELETE /reports/{id}` - Delete report
- `POST /comments` - Add comment

### Admin Routes
- `GET /dashboard` - Admin dashboard
- `PUT /reports/{id}/status` - Update report status
- `DELETE /reports/{id}` - Delete report
- `GET /users` - User management

## Development Tips

1. **Hot Reload**: Both backend and frontend support hot reload during development
2. **Type Safety**: Use TypeScript for all React code
3. **Form Validation**: Use Form Request classes in Laravel
4. **Components**: Use shadcn/ui components for consistency
5. **Styling**: Use Tailwind CSS classes for styling

## Production Build

```bash
pnpm run build
php artisan migrate --force
```

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -am 'Add feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support

For issues or questions, please create an issue in the repository.

Why:
- `inertiajs/inertia-laravel`: Laravel side of Inertia
- `laravel/fortify`: Auth endpoints (login, register, password, etc.)
- `laravel/wayfinder`: Route helper generator for frontend

### Step C: Add frontend packages (React + Inertia React + Vite plugins)

```bash
pnpm add react react-dom @inertiajs/react @inertiajs/vite
pnpm add -D vite @vitejs/plugin-react laravel-vite-plugin @laravel/vite-plugin-wayfinder typescript @types/react @types/react-dom
```

Why:
- React renders UI
- Inertia React adapter lets React pages receive Laravel props
- Vite compiles frontend assets fast
- Wayfinder Vite plugin generates route helpers automatically

### Step D: Configure Vite plugins

Create/update `vite.config.ts`:

```ts
import inertia from '@inertiajs/vite';
import { wayfinder } from '@laravel/vite-plugin-wayfinder';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    laravel({
      // Laravel will compile these frontend entry points
      input: ['resources/css/app.css', 'resources/js/app.tsx'],
      refresh: true,
    }),
    inertia(),
    react(),
    wayfinder({
      // Also generate helper variants for form actions
      formVariants: true,
    }),
  ],
});
```

### Step E: Create Inertia React entry file

Create `resources/js/app.tsx`:

```tsx
import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';

createInertiaApp({
  resolve: (name) => {
    // Load page components dynamically from resources/js/pages
    const pages = import.meta.glob('./pages/**/*.tsx', { eager: true });
    return pages[`./pages/${name}.tsx`];
  },
  setup({ el, App, props }) {
    createRoot(el).render(<App {...props} />);
  },
});
```

### Step F: Configure environment and database

```bash
cp .env.example .env
php artisan key:generate
```

For SQLite:

```bash
touch database/database.sqlite
```

Update `.env`:

```env
DB_CONNECTION=sqlite
DB_DATABASE=/absolute/path/to/fixyourcity/database/database.sqlite
```

Then run migrations:

```bash
php artisan migrate
```

### Step G: Run development servers

Terminal 1:

```bash
php artisan serve
```

Terminal 2:

```bash
pnpm dev
```

Open the URL shown by Laravel (usually `http://127.0.0.1:8000`).

### Step H: Link uploaded files storage

```bash
php artisan storage:link
```

Why:
- Report images are stored under `storage/app/public`
- This command makes them accessible via `/storage/...` in browser

---

## 4) Folder Structure Explained

Example structure (important parts):

```txt
fixyourcity/
  app/
    Http/
      Controllers/
      Requests/
    Models/
    Policies/
  database/
    migrations/
    seeders/
  resources/
    css/
    js/
      components/
      pages/
      routes/
      app.tsx
  routes/
    web.php
  storage/
  vite.config.ts
  composer.json
  package.json
```

What each part does:
- `app/Models`: Eloquent models (database tables as classes)
- `app/Http/Controllers`: Route handlers (business logic)
- `app/Http/Requests`: Validation rules per action
- `app/Policies`: Authorization rules (who can do what)
- `database/migrations`: Database schema history
- `resources/js/pages`: Inertia page components
- `resources/js/components`: Reusable UI parts
- `resources/js/routes`: Wayfinder-generated route helpers
- `routes/web.php`: Main web routes

---

## 5) Backend Development (Laravel)

### A) Routes

`routes/web.php` connects URLs to controller methods.

```php
<?php

use App\Http\Controllers\ReportController;
use Illuminate\Support\Facades\Route;

Route::get('/', [ReportController::class, 'index'])->name('home');
Route::resource('reports', ReportController::class);
```

What this means:
- `GET /` -> list reports
- `Route::resource(...)` creates standard CRUD routes (`index`, `create`, `store`, `show`, `edit`, `update`, `destroy`)

### B) Model

`app/Models/Report.php`

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'description',
        'category',
        'status',
        'latitude',
        'longitude',
        'city_id',
    ];

    public function user()
    {
        // Each report belongs to one user
        return $this->belongsTo(User::class);
    }
}
```

### C) Migration

`database/migrations/xxxx_xx_xx_create_reports_table.php`

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->text('description');
            $table->string('category');
            $table->string('status')->default('pending');
            $table->decimal('latitude', 10, 7);
            $table->decimal('longitude', 10, 7);
            $table->foreignId('city_id')->nullable()->constrained()->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reports');
    }
};
```

### D) Form Request (validation)

`app/Http/Requests/ReportStoreRequest.php`

```php
<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ReportStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Only logged-in users can create reports
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'category' => ['required', 'in:trash,road,light,other'],
            'latitude' => ['required', 'numeric'],
            'longitude' => ['required', 'numeric'],
        ];
    }
}
```

### E) Controller CRUD example

`app/Http/Controllers/ReportController.php`

```php
<?php

namespace App\Http\Controllers;

use App\Http\Requests\ReportStoreRequest;
use App\Models\Report;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function index()
    {
        // Load newest reports first and send to React page
        $reports = Report::with('user')->latest()->paginate(10);

        return Inertia::render('reports/index', [
            'reports' => $reports,
        ]);
    }

    public function store(ReportStoreRequest $request)
    {
        // Use validated data to prevent unsafe input
        Report::create([
            ...$request->validated(),
            'user_id' => $request->user()->id,
            'status' => 'pending',
        ]);

        return redirect()->route('reports.index');
    }
}
```

---

## 6) Frontend Development (React + Inertia)

### Pages

In Inertia, each server render points to a React page file.

Example page: `resources/js/pages/reports/index.tsx`

```tsx
import { Head, Link } from '@inertiajs/react';

type Report = {
  id: number;
  title: string;
  status: string;
};

type Props = {
  reports: {
    data: Report[];
  };
};

export default function ReportsIndex({ reports }: Props) {
  return (
    <>
      <Head title="Reports" />

      <h1>Reports</h1>

      {reports.data.map((report) => (
        <div key={report.id}>
          {/* Show report title and status */}
          <h2>{report.title}</h2>
          <p>{report.status}</p>
          <Link href={`/reports/${report.id}`}>View</Link>
        </div>
      ))}
    </>
  );
}
```

### Props and data flow

Important idea:
- Laravel controller returns `Inertia::render('reports/index', [...props])`
- React page receives the same props as function parameters

Analogy:
- Controller is a teacher handing worksheet data
- React page is the student showing that worksheet on screen

---

## 7) Using shadcn/ui

### Install and initialize

```bash
pnpm dlx shadcn@latest init
```

You will choose:
- Framework: React
- TSX: yes
- CSS file: `resources/css/app.css`
- Component alias: `@/components`

### Add components

```bash
pnpm dlx shadcn@latest add button input card dialog table select
```

This generates files in `resources/js/components/ui/`.

### Use components in a page

```tsx
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function ExampleForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Report</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Input + button from shadcn/ui */}
        <Input placeholder="Report title" />
        <Button className="mt-2">Submit</Button>
      </CardContent>
    </Card>
  );
}
```

Why shadcn is useful:
- You own the component code (not a locked black-box package)
- Easy to customize styles
- Consistent UI across pages

---

## 8) Using Wayfinder

Wayfinder generates route helpers in `resources/js/routes/...` from Laravel routes.

### Generate helpers

```bash
php artisan wayfinder:generate --with-form
```

### Example usage in React

```tsx
import { Link, router } from '@inertiajs/react';
import { home } from '@/routes';
import { destroy } from '@/routes/reports';

export default function Example() {
  const handleDelete = (reportId: number) => {
    // Route helper avoids hardcoded URL mistakes
    router.delete(destroy(reportId).url);
  };

  return (
    <>
      <Link href={home().url}>Home</Link>
      <button onClick={() => handleDelete(10)}>Delete report #10</button>
    </>
  );
}
```

Why this matters:
- If a backend route changes, regenerate helpers and update safely
- Better autocompletion and fewer broken links/forms

---

## 9) Full Example Feature (Very Important): Create Report

This walkthrough connects backend + frontend + UI in one feature.

### Step 1: Migration for reports

Create migration:

```bash
php artisan make:migration create_reports_table
```

Use schema from section 5C, then run:

```bash
php artisan migrate
```

### Step 2: Create model

```bash
php artisan make:model Report
```

Add `fillable` fields and relations (section 5B).

### Step 3: Create form request

```bash
php artisan make:request ReportStoreRequest
```

Add `authorize()` and `rules()` (section 5D).

### Step 4: Create controller

```bash
php artisan make:controller ReportController --resource
```

Implement `index`, `create`, `store`.

Example `store` logic:
- Validate request
- Attach current user
- Save report
- Redirect back to list

### Step 5: Register routes

```php
<?php

use App\Http\Controllers\ReportController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function () {
    // Only authenticated users can access report creation
    Route::resource('reports', ReportController::class);
});
```

### Step 6: Build Create page in React

`resources/js/pages/reports/create.tsx`

```tsx
import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function ReportsCreate() {
  const form = useForm({
    title: '',
    description: '',
    category: 'other',
    latitude: '',
    longitude: '',
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    // Sends data to Laravel route: POST /reports
    form.post('/reports');
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={form.data.title}
          onChange={(e) => form.setData('title', e.target.value)}
        />
        {/* Show validation error from Laravel */}
        {form.errors.title && <p className="text-red-600 text-sm">{form.errors.title}</p>}
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={form.data.description}
          onChange={(e) => form.setData('description', e.target.value)}
        />
      </div>

      <Button type="submit" disabled={form.processing}>
        {form.processing ? 'Saving...' : 'Create Report'}
      </Button>
    </form>
  );
}
```

### Step 7: Add list page to verify creation

In `index()` controller, load and return reports via Inertia.

In `reports/index.tsx`, show the list.

Now test flow:
1. Open create page
2. Submit form
3. Laravel validates + saves
4. Redirect to reports list
5. New report appears

That is a complete full-stack feature.

---

## 10) Common Mistakes + Debugging Tips

### Mistake 1: White screen / page not loading

Check:
```bash
pnpm dev
php artisan serve
```

Both servers must run.

### Mistake 2: 419 CSRF error on form submit

- Usually session/CSRF mismatch
- Make sure requests are sent through Inertia helpers (`form.post`, `router.post`)
- Clear caches:

```bash
php artisan optimize:clear
```

### Mistake 3: Uploaded images not showing

Run:

```bash
php artisan storage:link
```

And ensure image URL uses `/storage/...`.

### Mistake 4: Route helper missing

Regenerate Wayfinder:

```bash
php artisan wayfinder:generate --with-form
```

### Mistake 5: Migration/table errors

If local/dev only and safe to reset:

```bash
php artisan migrate:fresh --seed
```

### Mistake 6: React TypeScript errors from wrong prop shapes

- Match frontend `type Props` to backend Inertia payload keys exactly.
- If Laravel sends `reports`, React should expect `reports`.

### Quick logs checklist

Backend logs:
```bash
php artisan pail
```

Browser logs:
- Open DevTools -> Console

Database sanity check:
```bash
php artisan tinker
```

---

## 11) Summary

You now understand how all parts connect:

1. **Laravel** defines routes, validation, models, and business logic.
2. **Inertia** passes backend data directly to frontend pages.
3. **React** renders pages and handles interactions.
4. **shadcn/ui** provides clean reusable UI components.
5. **Wayfinder** keeps frontend routing aligned with backend routes.

If you can build the `Create Report` feature end to end, you can rebuild the rest of this project using the same pattern.

---

## Practical Commands for This Repository

Use these in this project root (`FixYourCity`):

```bash
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan storage:link
pnpm install
php artisan serve
pnpm dev
```

Optional checks:

```bash
php artisan test
pnpm lint:check
pnpm types:check
```
