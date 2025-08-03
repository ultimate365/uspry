// utils/sitemap.ts
export async function GET() {
  const baseUrl = "https://uspry.vercel.app";
  const pages = [
    "accounts",
    "admission",
    "api",
    "autoresult",
    "blankMDMEntry",
    "cchPhotoCorner",
    "complain",
    "dashboard",
    "downloadAdmissionForm",
    "downloadMDMReport",
    "downloads",
    "downloadTeachersReturn",
    "examSeat",
    "expenses",
    "expensesTransactions",
    "fonts",
    "HolisticPRCard",
    "HolisticPRCardAny",
    "home",
    "login",
    "logout",
    "mdmdataentry",
    "MDMmonthlyReport",
    "MonthlyTeachersReturn",
    "Notification",
    "photocorner",
    "printAdmissionForm",
    "result",
    "sitemap.xml",
    "studentdata",
    "studentsignup",
    "TeacherPhotoCorner",
    "teachersignup",
    "teachersreturn",
    "transactions",
    "updateunp",
    "userStudents",
    "userTeachers",
    "vecAccount",
    "vecTransactions",
    "verifyLogin",
    "viewAdmission",
  ]; // Add actual paths

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages
    .map(
      (page) => `
    <url>
      <loc>${baseUrl}/${page}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
    </url>`
    )
    .join("")}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
