---
slug: job-board
title: "Project 10: Job board with employers, applicants, CV uploads and search"
after: ecommerce-store
---
# Project 10: Job board with employers, applicants, CV uploads and search

A job board connects two kinds of users: **employers** who post jobs and **job seekers** who search and apply. It's a great portfolio project because it has two user roles with different permissions, search with filters, file uploads (CVs), notifications and moderation. You could build a niche board that's genuinely useful: attachments and internships for students, casual jobs in one town, remote tech jobs, NGO jobs, or hospitality jobs.

**You'll practise:** multi-role authentication, authorisation (who can see what), search and filtering with SQL, secure file uploads, email notifications, pagination and SEO for listings.

**Lessons you need:** [the blog project](./?track=projects&lesson=blog-cms), [file uploads](./?track=php&lesson=file-uploads), [sessions and login](./?track=php&lesson=sessions-login), [WHERE and ORDER BY](./?track=sql&lesson=where-order), [JOINs](./?track=sql&lesson=joins), [web security](./?track=cybersecurity&lesson=web-security).

## Step 1: Roles and what they can do

| Action | Visitor | Job seeker | Employer | Admin |
|---|---|---|---|---|
| Search and view open jobs | Yes | Yes | Yes | Yes |
| Apply with CV and cover letter | | Yes | | |
| See own applications and their status | | Yes | | |
| Post, edit and close jobs | | | Yes (own only) | Yes |
| See applicants for a job and download CVs | | | Yes (own jobs only) | Yes |
| Approve employers, remove fake jobs | | | | Yes |

The phrase **"own only"** is where most security bugs in job boards hide. Every query that loads a job's applicants must check that the job belongs to the logged-in employer.

## Step 2: Database

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY, email VARCHAR(190) NOT NULL UNIQUE, password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL, role ENUM('seeker','employer','admin') NOT NULL, created_at DATETIME NOT NULL
);
CREATE TABLE companies (
  id INT AUTO_INCREMENT PRIMARY KEY, owner_id INT NOT NULL UNIQUE, name VARCHAR(150) NOT NULL, website VARCHAR(255),
  verified TINYINT NOT NULL DEFAULT 0, FOREIGN KEY (owner_id) REFERENCES users(id)
);
CREATE TABLE jobs (
  id INT AUTO_INCREMENT PRIMARY KEY, company_id INT NOT NULL, title VARCHAR(150) NOT NULL, slug VARCHAR(170) NOT NULL UNIQUE,
  county VARCHAR(50) NOT NULL, type ENUM('full-time','part-time','contract','internship','attachment','remote') NOT NULL,
  category VARCHAR(60) NOT NULL, salary_min INT NULL, salary_max INT NULL, description TEXT NOT NULL,
  closes_on DATE NOT NULL, status ENUM('pending','open','closed','rejected') NOT NULL DEFAULT 'pending', created_at DATETIME NOT NULL,
  FOREIGN KEY (company_id) REFERENCES companies(id), INDEX (status, closes_on), FULLTEXT (title, description)
);
CREATE TABLE applications (
  id INT AUTO_INCREMENT PRIMARY KEY, job_id INT NOT NULL, seeker_id INT NOT NULL, cv_file VARCHAR(100) NOT NULL,
  cover_letter TEXT, status ENUM('received','shortlisted','interview','rejected','hired') NOT NULL DEFAULT 'received',
  created_at DATETIME NOT NULL, UNIQUE (job_id, seeker_id),
  FOREIGN KEY (job_id) REFERENCES jobs(id), FOREIGN KEY (seeker_id) REFERENCES users(id)
);
```

`UNIQUE (job_id, seeker_id)` stops someone applying twice to the same job.

## Step 3: Search with filters

The search page combines optional filters: keyword, county, type, category and minimum salary. Try the queries on a small dataset here:

```try-sql
CREATE TABLE jobs (id INTEGER PRIMARY KEY, title TEXT, company TEXT, county TEXT, type TEXT, category TEXT,
                   salary_min INTEGER, closes_on TEXT, status TEXT);
INSERT INTO jobs VALUES
 (1, 'Junior Web Developer', 'Duka Digital', 'Nairobi', 'full-time', 'ICT', 45000, '2026-11-30', 'open'),
 (2, 'ICT Attachment (3 months)', 'County Government', 'Nakuru', 'attachment', 'ICT', NULL, '2026-10-31', 'open'),
 (3, 'Data Clerk', 'Afya Clinic', 'Kisumu', 'contract', 'Data', 30000, '2026-10-20', 'open'),
 (4, 'Accounts Assistant', 'Mavuno SACCO', 'Nakuru', 'full-time', 'Finance', 35000, '2026-09-30', 'open'),
 (5, 'Remote Customer Support Agent', 'HelpCo', 'Remote', 'remote', 'Support', 40000, '2026-12-15', 'open'),
 (6, 'IT Support Technician', 'Shule Bora', 'Nakuru', 'full-time', 'ICT', NULL, '2026-11-15', 'pending');

-- Open ICT jobs in Nakuru that haven't closed (pretend today is 2026-10-07)
SELECT title, company, type, COALESCE(salary_min, 'Not stated') AS salary_from, closes_on
FROM jobs
WHERE status = 'open' AND closes_on >= '2026-10-07'
  AND category = 'ICT' AND county = 'Nakuru'
ORDER BY closes_on;
```

Notice job 4 (closed date passed) and job 6 (pending approval) are correctly hidden. Try changing the filters: remove the county condition, or search titles with `title LIKE '%support%'`.

In PHP, build the WHERE clause from only the filters the user chose, **still using placeholders**:

```php
$where = ["status = 'open'", 'closes_on >= CURDATE()'];
$params = [];
if (($q = trim($_GET['q'] ?? '')) !== '') { $where[] = 'MATCH(title, description) AGAINST (?)'; $params[] = $q; }
if (!empty($_GET['county'])) { $where[] = 'county = ?'; $params[] = $_GET['county']; }
if (in_array($_GET['type'] ?? '', ['full-time','part-time','contract','internship','attachment','remote'], true)) { $where[] = 'type = ?'; $params[] = $_GET['type']; }
if (($min = (int)($_GET['min_salary'] ?? 0)) > 0) { $where[] = 'salary_max >= ?'; $params[] = $min; }
$sql = 'SELECT j.*, c.name AS company FROM jobs j JOIN companies c ON c.id = j.company_id WHERE ' . implode(' AND ', $where)
     . ' ORDER BY j.created_at DESC LIMIT 20 OFFSET ' . max(0, ((int)($_GET['page'] ?? 1) - 1) * 20);
$stmt = $pdo->prepare($sql);
$stmt->execute($params);
```

Only fixed strings you wrote go into the SQL text; every user value goes through `?`. The OFFSET is safe because it's forced to an integer.

Keep the filters in the URL (`?q=developer&county=Nakuru&type=internship`) so searches can be shared and bookmarked.

## Step 4: Applying with a CV (secure uploads)

CV uploads are an attack route: someone could upload a PHP file disguised as a PDF. Rules:

```php
$f = $_FILES['cv'] ?? null;
if (!$f || $f['error'] !== UPLOAD_ERR_OK) exit('Please attach your CV.');
if ($f['size'] > 2 * 1024 * 1024) exit('CV must be under 2 MB.');
$type = (new finfo(FILEINFO_MIME_TYPE))->file($f['tmp_name']);
$allowed = ['application/pdf' => 'pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' => 'docx'];
if (!isset($allowed[$type])) exit('Upload a PDF or Word (.docx) file.');
$name = bin2hex(random_bytes(16)) . '.' . $allowed[$type];
move_uploaded_file($f['tmp_name'], '/home/youruser/cv-uploads/' . $name);   // OUTSIDE the public web folder
```

- Check the **real type** with `finfo`, not the filename.
- **Rename** to a random name; never use the uploaded filename on disk.
- Store CVs **outside** `public_html`, and serve them through a PHP script that checks permission:

```php
// download-cv.php?application=123
$stmt = $pdo->prepare('SELECT a.cv_file FROM applications a JOIN jobs j ON j.id = a.job_id JOIN companies c ON c.id = j.company_id
                       WHERE a.id = ? AND c.owner_id = ?');
$stmt->execute([(int)$_GET['application'], $_SESSION['user_id']]);
$file = $stmt->fetchColumn() ?: exit('Not found');
header('Content-Type: ' . (str_ends_with($file, '.pdf') ? 'application/pdf' : 'application/octet-stream'));
header('Content-Disposition: attachment; filename="cv-' . (int)$_GET['application'] . substr($file, strrpos($file, '.')) . '"');
readfile('/home/youruser/cv-uploads/' . $file);
```

The JOIN with `c.owner_id = ?` is the "own jobs only" rule in action: an employer who changes the number in the URL gets "Not found".

## Step 5: Employer dashboard

- Post a job (status `pending` until an admin approves, to stop scams).
- My jobs: views count, number of applicants, close early, duplicate.
- Applicants list per job with status buttons (shortlist, interview, reject, hire). Changing status can email the applicant.

## Step 6: Job seeker dashboard

- Profile with a default CV.
- My applications with live status.
- Saved jobs and **job alerts**: "email me new ICT jobs in Nakuru". A daily cron job runs each saved search and emails new matches.

## Step 7: Fighting fake jobs

Fake job adverts are a serious problem in Kenya. Build protections in:
- New employers start **unverified**; their jobs need admin approval.
- Block words like "registration fee", "pay to apply" and "training fee" in job descriptions and flag them for review.
- A **Report this job** button.
- A clear notice on every job page: *"Never pay to apply for a job. Report any employer who asks for money."*

## Step 8: SEO for job listings

Google can show jobs in a special search feature if you add **JobPosting** structured data:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org/",
  "@type": "JobPosting",
  "title": "Junior Web Developer",
  "description": "<p>Build and maintain websites for our clients…</p>",
  "datePosted": "2026-10-01",
  "validThrough": "2026-11-30T23:59",
  "employmentType": "FULL_TIME",
  "hiringOrganization": { "@type": "Organization", "name": "Duka Digital" },
  "jobLocation": { "@type": "Place", "address": { "@type": "PostalAddress", "addressLocality": "Nairobi", "addressCountry": "KE" } }
}
</script>
```

Remove or mark closed jobs promptly; expired listings with structured data can hurt your site.

## Step 9: Tests

- Employer A tries to view applicants for employer B's job: refused
- Seeker uploads `cv.pdf.php` or a renamed `.exe`: refused
- Apply twice: refused with a friendly message
- Closed and pending jobs never appear in search
- Search with a quote or `%` character works and doesn't break the SQL

## Stretch goals

- One-click apply using the profile CV; application tracking with notes for employers.
- Salary insights page (average advertised salary by category, with honest caveats).
- An API for jobs (combine with the [REST API project](./?track=projects&lesson=rest-api)).
- M-Pesa payment for "featured" job posts.

## Summary

- Two roles with different powers; "own only" checks on every query.
- Search with optional filters built safely with placeholders; filters kept in the URL.
- CVs: real type check, random names, stored outside the web root, served through a permission check.
- Moderation and clear warnings protect users from fake jobs; JobPosting markup helps SEO.

```quiz
Q: Which constraint stops a seeker applying twice to the same job? (one word)
A: UNIQUE | unique key
Q: Which PHP class checks a file's real type? (name the class)
A: finfo
Q: Should uploaded CVs be stored inside or outside public_html?
A: outside | outside public_html
Q: Which schema.org type describes a job advert for Google?
A: JobPosting
```
