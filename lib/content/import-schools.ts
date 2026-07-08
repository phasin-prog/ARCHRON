import fs from "fs";
import path from "path";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { createClient } from "@supabase/supabase-js";

// 1. Load .env.local manually
try {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, "utf-8");
    content.split("\n").forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) return;
      const index = trimmed.indexOf("=");
      if (index === -1) return;
      const key = trimmed.substring(0, index).trim();
      let val = trimmed.substring(index + 1).trim();
      if (val.startsWith("\"") && val.endsWith("\"")) {
        val = val.substring(1, val.length - 1);
      }
      process.env[key] = val;
    });
    console.log("Loaded .env.local successfully");
  }
} catch (e) {
  console.error("Error loading .env.local:", e);
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const r2Endpoint = process.env.R2_ENDPOINT;
const r2AccessKeyId = process.env.R2_ACCESS_KEY_ID;
const r2SecretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const r2Bucket = process.env.R2_BUCKET_NAME;
const r2PublicUrlBase = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || "";

if (!supabaseUrl || !supabaseServiceKey || !r2Endpoint || !r2AccessKeyId || !r2SecretAccessKey || !r2Bucket) {
  console.error("Error: Missing required environment variables.");
  process.exit(1);
}

// 2. Initialize Clients
const s3Client = new S3Client({
  region: "auto",
  endpoint: r2Endpoint,
  credentials: {
    accessKeyId: r2AccessKeyId,
    secretAccessKey: r2SecretAccessKey,
  },
  forcePathStyle: true,
});

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Helper to upload to R2
async function uploadContentToR2(text: string, fileName: string): Promise<{ key: string; url: string }> {
  const ext = fileName.split(".").pop()?.toLowerCase() || "md";
  const key = `uploads/${Date.now()}-${Math.random().toString(36).substring(2, 10)}.${ext}`;
  const buffer = Buffer.from(text, "utf-8");
  
  await s3Client.send(
    new PutObjectCommand({
      Bucket: r2Bucket,
      Key: key,
      Body: buffer,
      ContentType: "text/markdown",
      CacheControl: "public, max-age=31536000, immutable",
    })
  );
  
  const url = `${r2PublicUrlBase.replace(/\/$/, "")}/${key}`;
  return { key, url };
}

// 3. Mapping tables
const PSYCHOLOGY_SCHOOLS = new Set([
  "Adlerian",
  "Attachment  Mentalization  Developmental",
  "CBT",
  "Family Systems",
  "Freudian",
  "Humanistic Psychology",
  "IFS",
  "Jungian Thinkers Reference List",
  "Lacanian Psychoanalysis Thinkers Reference List",
  "Neuroscience",
  "Object Relations",
  "Transpersonal",
  "Trauma  Somatic  Dissociation",
  "Archetypal Psychology",
  "Personality Psychology",
  "Phenomenology Of concept",
  "Psychology of Religion",
  "Social Psychology",
  "Cultural",
  "Narrative Psychology",
  "Emotion Theory"
]);

const SCHOOL_THAI_NAMES: Record<string, string> = {
  "Adlerian": "จิตวิทยาแอดเลอร์ / จิตวิทยาปัจเจกบุคคล",
  "Aesthetics": "สุนทรียศาสตร์ / ปรัชญาศิลปะ",
  "AI Ethics": "จริยธรรมปัญญาประดิษฐ์",
  "Analytic Philosophy": "ปรัชญาวิเคราะห์ / ภาษาและตรรกวิทยา",
  "Ancient Greek Philosophy": "ปรัชญากรีกโบราณ / ปรัชญาคลาสสิก",
  "Animal Ethics": "จริยธรรมสัตว์",
  "Archetypal Psychology": "จิตวิทยาเชิงแม่แบบ",
  "Aristotelianism": "ลัทธิอริสโตเติล",
  "Attachment  Mentalization  Developmental": "จิตวิทยาพัฒนาการ / ความผูกพัน",
  "Buddhist Philosophy": "ปรัชญาพุทธ",
  "CBT": "กลุ่มพฤติกรรมบำบัดและความคิด (CBT/ACT/DBT)",
  "Chinese Philosophy": "ปรัชญาจีน",
  "Christian Philosophy": "ปรัชญาคริสต์",
  "Critical Theory": "ทฤษฎีวิพากษ์ (สำนักแฟรงก์เฟิร์ต)",
  "Cultural": "จิตวิทยาวัฒนธรรม",
  "Cybernetics": "ไซเบอร์เนติกส์ / ทฤษฎีระบบ",
  "Emotion Theory": "ทฤษฎีอารมณ์ความรู้สึก",
  "Environmental Philosophy": "ปรัชญาสิ่งแวดล้อม",
  "Epistemology": "ญาณวิทยา / ทฤษฎีความรู้",
  "Ethics": "จริยศาสตร์ / ปรัชญาศีลธรรม",
  "Existentialism": "อัตถิภาวนิยม / อับเซิร์ดดิสม์",
  "Family Systems": "ทฤษฎีระบบครอบครัวและการบำบัด",
  "Feminist Philosophy": "ปรัชญาเฟมินิสต์",
  "Freudian": "จิตวิเคราะห์แนวฟรอยด์",
  "Hellenistic Philosophy": "ปรัชญาเฮลเลนิสติก",
  "Hermeneutics": "ศาสตร์แห่งการตีความ",
  "Humanistic Psychology": "จิตวิทยามนุษยนิยม",
  "IFS": "จิตบำบัดระบบครอบครัวภายใน (IFS)",
  "Indian Philosophy": "ปรัชญาอินเดีย",
  "Indigenous Philosophy": "ปรัชญาชนเผ่าพื้นเมือง",
  "Islamic Philosophy": "ปรัชญาอิสลาม",
  "Jewish Philosophy": "ปรัชญายิว",
  "Jungian Thinkers Reference List": "จิตวิทยาเชิงลึกแนวคาร์ล ยุง",
  "Lacanian Psychoanalysis Thinkers Reference List": "จิตวิเคราะห์แนวลากอง",
  "Metaphysics": "อภิปรัชญา",
  "Narrative Psychology": "จิตวิทยาเชิงเล่าเรื่อง",
  "Neuroscience": "ประสาทวิทยาศาสตร์ / ประสาทจิตวิเคราะห์",
  "Object Relations": "ทฤษฎีความสัมพันธ์เชิงวัตถุ",
  "Personality Psychology": "จิตวิทยาบุคลิกภาพ",
  "Phenomenology Of concept": "ปรากฏการณ์วิทยาแห่งจิต",
  "Phenomenology": "ปรากฏการณ์วิทยา",
  "Philosophy of Language": "ปรัชญาภาษา",
  "Philosophy of Mind": "ปรัชญาแห่งจิต",
  "Philosophy of Race": "ปรัชญาเรื่องชาติพันธุ์",
  "Philosophy of Religion": "ปรัชญาศาสนา",
  "Philosophy of Science": "ปรัชญาวิทยาศาสตร์",
  "Philosophy of Technology": "ปรัชญาเทคโนโลยี",
  "Platonism": "ลัทธิเพลโต",
  "Political Philosophy": "ปรัชญาการเมือง",
  "Postcolonial Philosophy": "ปรัชญาหลังอาณานิคม",
  "Posthumanism": "แนวคิดหลังมนุษยนิยม",
  "Pragmatism": "ปฏิบัตินิยม",
  "Process Philosophy": "ปรัชญากระบวนการ",
  "Psychology of Religion": "จิตวิทยาศาสนา",
  "Queer Theory": "ทฤษฎีเควียร์ / เพศสภาพศึกษา",
  "Social Psychology": "จิตวิทยาสังคม",
  "Structuralism": "โครงสร้างนิยม / หลังโครงสร้างนิยม",
  "Transpersonal": "จิตวิทยาข้ามบุคคล",
  "Trauma  Somatic  Dissociation": "จิตวิทยาบาดแผลทางใจและกายสัมผัส"
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Map specific file names to existing standard school slugs
function getSchoolSlug(fileNameWithoutExt: string): string {
  if (fileNameWithoutExt === "Freudian") return "psychoanalysis";
  if (fileNameWithoutExt === "Jungian Thinkers Reference List") return "analytical-psychology";
  if (fileNameWithoutExt === "Ancient Greek Philosophy") return "classical-greek";
  return slugify(fileNameWithoutExt);
}

// 4. Parser Helper
interface ThinkerData {
  nameEn: string;
  nameTh: string;
  role: string;
  concepts: string;
  masterpieces: string[];
  bio: string;
}

const allFieldPrefixes = [
  "ผลงานหลัก:", "ผลงานสำคัญ:", "งานสำคัญ:", "บทบาท:", "สาย / สำนัก:", "สำนัก / สาย:", "ชื่อไทย:", "ชื่อไทย :", "สถานะ:", "แนวคิดสำคัญ:", "ความสำคัญ:"
];

const startThinkerIndicators = [
  "ชื่อไทย:", "ชื่อไทย :", "บทบาท:", "สาย / สำนัก:", "สำนัก / สาย:", "สถานะ:"
];

function isFieldLine(line: string): boolean {
  return allFieldPrefixes.some(ind => line.startsWith(ind));
}

function isStartFieldLine(line: string): boolean {
  return startThinkerIndicators.some(ind => line.startsWith(ind));
}

function isSectionHeader(line: string): boolean {
  const normalized = line.toLowerCase();
  return (
    /^\d+\.\s+/.test(line) || // matches "1. ", "2. ", "10. ", etc.
    /^[I|V|X]+\.\s+/.test(line) || // matches roman numerals like "I. ", "II. "
    /^[A-Z]\.\s+/.test(line) || // matches "A. ", "B. "
    normalized.startsWith("level ") ||
    normalized.includes("founder") ||
    normalized.includes("generation") ||
    normalized.includes("circle") ||
    normalized.includes("pioneer") ||
    normalized.includes("application") ||
    normalized.includes("scholar") ||
    normalized.includes("influenced") ||
    normalized.includes("concept") ||
    normalized.includes("reading") ||
    normalized.includes("institution") ||
    normalized.includes("warning") ||
    normalized.includes("reference list")
  );
}

function parseSchoolFile(filePath: string, schoolName: string): { intro: string; thinkers: ThinkerData[] } {
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n").map(l => l.trim());
  
  const introLines: string[] = [];
  const thinkers: ThinkerData[] = [];
  let currentThinker: any = null;
  
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line) {
      i++;
      continue;
    }
    
    // Stop parsing when hitting taxonomy sections
    if (line.startsWith("10. Core") || line.startsWith("11. Suggested") || line.includes("Website Taxonomy") || line.includes("หมวดหมู่แนะนำ") || line.includes("แนะนำการอ่าน")) {
      break;
    }
    
    let isThinker = false;
    if (line.length < 100 && !isFieldLine(line) && !isSectionHeader(line) && i + 1 < lines.length) {
      for (const offset of [1, 2]) {
        if (i + offset < lines.length) {
          const nextLine = lines[i + offset];
          if (isStartFieldLine(nextLine)) {
            isThinker = true;
            break;
          }
        }
      }
    }
    
    if (isThinker) {
      if (currentThinker && currentThinker.bioLines.length > 0) {
        thinkers.push(processThinker(currentThinker));
      }
      currentThinker = {
        nameEn: line,
        fields: {} as Record<string, string>,
        bioLines: [] as string[]
      };
      i++;
    } else if (currentThinker) {
      // Parse fields or add to bio
      let parsedField = false;
      for (const ind of allFieldPrefixes) {
        if (line.startsWith(ind)) {
          const val = line.substring(ind.length).trim();
          currentThinker.fields[ind] = val;
          parsedField = true;
          break;
        }
      }
      if (!parsedField) {
        currentThinker.bioLines.push(line);
      }
      i++;
    } else {
      introLines.push(line);
      i++;
    }
  }
  
  if (currentThinker && currentThinker.bioLines.length > 0) {
    thinkers.push(processThinker(currentThinker));
  }
  
  return {
    intro: introLines.join("\n"),
    thinkers
  };
}

function processThinker(raw: any): ThinkerData {
  const nameTh = raw.fields["ชื่อไทย:"] || raw.fields["ชื่อไทย :"] || "";
  const role = raw.fields["บทบาท:"] || raw.fields["สาย / สำนัก:"] || raw.fields["สำนัก / สาย:"] || raw.fields["สถานะ:"] || "";
  const concepts = raw.fields["แกนความคิด:"] || raw.fields["แนวคิดสำคัญ:"] || "";
  
  const worksStr = raw.fields["ผลงานหลัก:"] || raw.fields["ผลงานสำคัญ:"] || raw.fields["งานสำคัญ:"] || "";
  const masterpieces = worksStr ? worksStr.split(",").map((w: string) => w.trim()).filter(Boolean) : [];
  
  return {
    nameEn: raw.nameEn,
    nameTh: nameTh || raw.nameEn,
    role,
    concepts,
    masterpieces,
    bio: raw.bioLines.join("\n")
  };
}

// 5. Main Process function
async function main() {
  const isDryRun = process.argv.includes("--dry-run");
  console.log(`Starting school import process. Mode: ${isDryRun ? "DRY-RUN" : "LIVE-IMPORT"}`);
  
  const txtFolder = path.resolve(process.cwd(), "docs/txt_versions");
  const files = fs.readdirSync(txtFolder).filter(f => f.endsWith(".txt"));
  
  let schoolCount = 0;
  let thinkerCount = 0;
  
  for (const file of files) {
    const schoolName = file.replace(".txt", "");
    const filePath = path.join(txtFolder, file);
    
    console.log(`Parsing ${file}...`);
    const { intro, thinkers } = parseSchoolFile(filePath, schoolName);
    
    const schoolSlug = getSchoolSlug(schoolName);
    const framework = PSYCHOLOGY_SCHOOLS.has(schoolName) ? "psychology" : "philosophy";
    const schoolTitleTh = SCHOOL_THAI_NAMES[schoolName] || schoolName;
    
    // Process School Entry
    const schoolBodyMarkdown = `# ${schoolName}\n\n${intro}`;
    let schoolR2Key = null;
    let schoolR2Url = null;
    
    if (!isDryRun) {
      const uploadResult = await uploadContentToR2(schoolBodyMarkdown, `school-${schoolSlug}.md`);
      schoolR2Key = uploadResult.key;
      schoolR2Url = uploadResult.url;
      
      const { error: schoolErr } = await supabase
        .from("entries")
        .upsert({
          slug: schoolSlug,
          title: schoolTitleTh,
          original_term: schoolName,
          content_type: "school",
          status: "published",
          author_id: "system-seed",
          framework,
          short_description: intro.substring(0, 200).replace(/\n/g, " ") + "...",
          body_markdown: schoolBodyMarkdown,
          r2_content_key: schoolR2Key,
          r2_content_url: schoolR2Url,
          updated_at: new Date().toISOString()
        }, { onConflict: "slug" });
        
      if (schoolErr) {
        console.error(`Error inserting school ${schoolSlug}:`, schoolErr);
      } else {
        schoolCount++;
      }
    } else {
      console.log(`[DRY-RUN] Would create school: ${schoolSlug} (${schoolTitleTh})`);
      schoolCount++;
    }
    
    // Process Thinkers
    for (const thinker of thinkers) {
      const thinkerSlug = slugify(thinker.nameEn);
      
      const thinkerBodyMarkdown = `# ${thinker.nameEn} (${thinker.nameTh})
      
**บทบาท**: ${thinker.role}
**แกนความคิด**: ${thinker.concepts}

## รายชื่อผลงานสำคัญ
${thinker.masterpieces.map(w => `- ${w}`).join("\n")}

## ประวัติและผลงานเพิ่มเติม
${thinker.bio}`;

      let thinkerR2Key = null;
      let thinkerR2Url = null;
      
      if (!isDryRun) {
        const uploadResult = await uploadContentToR2(thinkerBodyMarkdown, `person-${thinkerSlug}.md`);
        thinkerR2Key = uploadResult.key;
        thinkerR2Url = uploadResult.url;
        
        const { error: thinkerErr } = await supabase
          .from("entries")
          .upsert({
            slug: thinkerSlug,
            title: thinker.nameTh,
            original_term: thinker.nameEn,
            content_type: "person",
            status: "published",
            author_id: "system-seed",
            framework,
            school: schoolSlug,
            short_description: thinker.role || `${thinker.nameEn} - นักคิดในสาย ${schoolName}`,
            body_markdown: thinkerBodyMarkdown,
            tags: thinker.masterpieces,
            r2_content_key: thinkerR2Key,
            r2_content_url: thinkerR2Url,
            updated_at: new Date().toISOString()
          }, { onConflict: "slug" });
          
        if (thinkerErr) {
          console.error(`  Error inserting thinker ${thinkerSlug}:`, thinkerErr);
        } else {
          thinkerCount++;
        }
      } else {
        console.log(`  [DRY-RUN] Would create thinker: ${thinkerSlug} (${thinker.nameTh}) under school ${schoolSlug}`);
        thinkerCount++;
      }
    }
  }
  
  console.log(`Import completed. Total schools processed: ${schoolCount}, Total thinkers processed: ${thinkerCount}`);
}

main().catch(err => {
  console.error("FATAL ERROR running import script:", err);
});
