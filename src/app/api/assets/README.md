# Climate X Task – Asset Management App

This project is a full-stack Next.js application for managing company assets, including uploading, editing, filtering, and deleting asset data. It demonstrates a modular, testable architecture using modern React, TypeScript, and the Next.js App Router.

---

## 🏗️ Project Architecture

The app was built incrementally, with each commit focusing on a specific feature or refactor. Here’s an overview of the architecture and key decisions:

### 1. **Initial Setup**
- **Next.js App Router** with TypeScript.
- **Tailwind CSS** for styling.
- **Jest** for unit testing.
- **Custom in-memory storage** (`src/utils/storage.ts`) to persist assets during development.

### 2. **API Layer**
- **RESTful API endpoints** under `/src/app/api/assets/route.ts` and `/src/app/api/assets/upload/route.ts`.
- **Features:**
  - `GET /api/assets`: Fetch all assets or filter by companyId.
  - `PUT /api/assets`: Edit companyId or update asset fields.
  - `DELETE /api/assets`: Delete an asset or an entire company.
  - `POST /api/assets/upload`: Upload assets via JSON or CSV.

### 3. **Frontend Components**
- **`src/app/page.tsx`**: Main page, handles state, API calls, and renders UI.
- **`src/components/CompanyAssetsList.tsx`**: Lists companies and their assets, supports inline editing and deletion.
- **`src/components/AssetTable.tsx`**: Table for editing and deleting individual asset fields.
- **`src/components/CompanyFilterForm.tsx`**: Filter assets by companyId.
- **`src/components/AssetUploadForm.tsx`**: Upload assets via file.

### 4. **Testing**
- **Jest** with custom mocks for browser APIs (`Request`, `File`, etc.).
- **Unit tests** for API routes and storage logic.
- **Test files**: `src/app/api/assets/route.test.ts`, `src/app/api/assets/upload/route.test.ts`, `src/utils/storage.test.ts`.

### 5. **Refactoring & Modularity**
- Components and API logic are split for clarity and maintainability.
- All business logic is tested in isolation.
- UI is fully interactive: inline editing, filtering, uploading, and deleting.

---

## 🚀 How to Run the App

### 1. **Install dependencies**
```bash
npm install
```

### 2. **Run the development server**
```bash
npm run dev
```
Visit [http://localhost:3000](http://localhost:3000) to view the app.

### 3. **Run tests**
```bash
npm run test
```

---

## 🧩 Key Features

- **Upload assets** via JSON or CSV.
- **Filter** assets by company ID.
- **Edit** company IDs and asset fields inline.
- **Delete** individual assets or entire companies.
- **All actions** update the UI and persist in in-memory storage.

---

## 🗂️ File Structure

```
src/
  app/
    api/
      assets/
        route.ts         # Main API for CRUD
        upload/route.ts  # Upload API
    components/
      AssetTable.tsx
      CompanyAssetsList.tsx
      CompanyFilterForm.tsx
      AssetUploadForm.tsx
    page.tsx             # Main page
  utils/
    storage.ts           # In-memory storage
  types/
    asset.ts             # Asset type definition
```

---

## 📝 Development Notes

- **No database**: All data is stored in-memory for demo/testing.
- **No external dependencies** for file parsing or API mocking.
- **Jest setup**: Mocks browser APIs for compatibility with Next.js API routes.
- **Architecture**: Modular, with clear separation between API, UI, and storage.

---

## 📚 Example Usage

- **Upload**: Drag & drop a CSV or JSON file with asset data.
- **Edit**: Click on a company ID or asset field to edit inline.
- **Delete**: Use the "Delete" button to remove assets or companies.
- **Filter**: Enter a company ID to filter the asset list.

---

## 🚦 Part 2: Scalability & Extension Notes

### 🗂️ Large File Uploads (Memory & Latency Considerations)
- **Streaming Uploads:**  
  - Switch from reading the entire file into memory (`file.text()`) to streaming file parsing (e.g., using Node.js streams or libraries like `csv-parser`).
  - This allows processing files line-by-line, reducing memory footprint and enabling early validation/errors.
- **Chunked Uploads:**  
  - For very large files, implement chunked uploads (client splits file, server reassembles).
  - This prevents timeouts and allows resuming failed uploads.
- **Async Processing:**  
  - Offload heavy parsing or validation to background jobs (e.g., using a queue system like BullMQ or a serverless function).
  - Respond to the user immediately with an "upload received" message, then notify when processing is complete.
- **Temporary Storage:**  
  - Store files temporarily on disk or in object storage (e.g., AWS S3) before processing, to avoid memory spikes.

### 👥 Multiple Companies Uploading Simultaneously (Concurrency)
- **Persistent Database:**  
  - Move from in-memory storage to a scalable database (e.g., PostgreSQL, MongoDB, DynamoDB) to handle concurrent writes and reads safely.
  - Use transactions or atomic operations to prevent race conditions.
- **Horizontal Scaling:**  
  - Deploy multiple server instances behind a load balancer; ensure all are stateless and share the same database/storage.
- **Rate Limiting & Throttling:**  
  - Implement per-company or per-user rate limits to prevent abuse and ensure fair resource allocation.
- **Queueing:**  
  - Use a job queue for processing uploads, so spikes in traffic don’t overwhelm the server.

### 🧩 Handling Partial Data (e.g., Incomplete Addresses, Geocoding)
- **Flexible Schema:**  
  - Allow assets to be stored with missing fields (e.g., `latitude`, `longitude`, or `address` can be `null`).
  - Mark incomplete records with a status flag (e.g., `needs_geocoding: true`).
- **Background Enrichment:**  
  - Periodically scan for incomplete records and trigger background jobs to enrich them (e.g., geocode addresses using an external API).
  - Store geocoding results back in the database, updating the asset’s status.
- **User Feedback:**  
  - Show incomplete assets in the UI with a warning or prompt for user correction.
  - Allow users to manually trigger enrichment or provide missing data.
- **Error Handling:**  
  - Log and track failed enrichment attempts for later review or retries.

---

### 📈 Example Scalable Architecture Diagram

```
[Client]
   |
   v
[API Gateway / Load Balancer]
   |
   v
[App Servers] <----> [Job Queue] <----> [Worker(s) for parsing/geocoding]
   |
   v
[Database / Object Storage]
```

---

### 🛠️ Extending the App

- **Add authentication/authorization** for company/user isolation.
- **Integrate cloud storage** (e.g., S3) for file uploads.
- **Add WebSocket or polling** for real-time upload/progress notifications.
- **Support more asset fields** or validation rules by extending the schema and UI.
- **Add audit logs** for uploads, edits, and deletions.

---

## 💡 Credits

Created as a technical task for Climate X.  
Author: Esly Lescano

---