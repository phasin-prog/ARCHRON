-- =====================================================================
-- Archron — Cloudflare R2 Sync Structure & Seed SQL
-- =====================================================================
-- วัตถุประสงค์: 
--  1. สร้างโครงสร้างเชื่อมโยง R2 (r2_content_key, r2_content_url)
--  2. สร้างตารางการตั้งค่า Webhook (public.settings)
--  3. เปิดใช้ pg_net extension สำหรับส่งข้อมูล HTTP Trigger ไปยัง Next.js API
--  4. สร้าง Trigger Function และ Trigger คอยดักจับและส่งเนื้อหาไปจัดเก็บ R2
--  5. นำเข้าข้อมูลสำนักคิดและนักปราชญ์ฉบับเต็มเพื่อทดสอบการซิงก์
-- =====================================================================

-- 1) เพิ่มคอลัมน์เก็บ R2 Link ในตาราง entries
ALTER TABLE public.entries 
ADD COLUMN IF NOT EXISTS r2_content_key text,
ADD COLUMN IF NOT EXISTS r2_content_url text;

-- 2) สร้างตารางเก็บตั้งค่า Webhook Sync
CREATE TABLE IF NOT EXISTS public.settings (
  key text PRIMARY KEY,
  value text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ใส่ค่าดีฟอลต์สำหรับ Endpoint และ API Secret
-- หมายเหตุ: หากรันใน Production ให้แก้ไขค่า 'api_sync_url' และ 'api_sync_secret' ให้ตรงกับระบบจริงของคุณ
INSERT INTO public.settings (key, value)
VALUES 
  ('api_sync_url', 'http://localhost:3000/api/sync-content'),
  ('api_sync_secret', 'archron_secret_sync_key_2026')
ON CONFLICT (key) 
DO UPDATE SET value = EXCLUDED.value, updated_at = now();

-- 3) เปิดการทำงานของ pg_net Extension (หากยังไม่ได้เปิดใช้ในโครงการ Supabase)
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- 4) สร้าง Trigger Function สำหรับยิง HTTP POST ไป Next.js API
CREATE OR REPLACE FUNCTION public.sync_entry_to_r2_trigger()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions, net
AS $$
DECLARE
  v_url text;
  v_secret text;
  v_payload jsonb;
BEGIN
  -- ดึงค่าจากตาราง settings
  SELECT value INTO v_url FROM public.settings WHERE key = 'api_sync_url';
  SELECT value INTO v_secret FROM public.settings WHERE key = 'api_sync_secret';
  
  -- ถ้าไม่ได้ตั้งค่า URL หรือค่าว่าง ให้ข้ามการประมวลผล
  IF v_url IS NULL OR v_url = '' THEN
    RETURN NEW;
  END IF;

  -- ป้องกัน Infinite loop และลดการยิงซ้ำ (ยิงเฉพาะเมื่อมีการเปลี่ยนแปลง ฟิลด์ที่สำคัญ)
  IF TG_OP = 'UPDATE' THEN
    IF COALESCE(old.body_markdown, '') = COALESCE(new.body_markdown, '') 
       AND old.status = new.status 
       AND old.title = new.title THEN
      RETURN NEW;
    END IF;
  END IF;

  -- ซิงก์เฉพาะข้อมูลที่เป็น 'published' และมีเนื้อหา (school, person, article)
  IF new.status = 'published' AND (new.content_type = 'school' OR new.content_type = 'person' OR new.content_type = 'article') THEN
    v_payload := jsonb_build_object(
      'slug', new.slug,
      'content_type', new.content_type,
      'title', new.title,
      'body_markdown', COALESCE(new.body_markdown, '')
    );

    -- เรียกใช้ pg_net เพื่อยิง POST Request แบบ Asynchronous
    PERFORM net.http_post(
      url := v_url,
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'x-api-secret', COALESCE(v_secret, '')
      ),
      body := v_payload
    );
  END IF;

  RETURN NEW;
END;
$$;

-- 5) ผูก Trigger เข้ากับตาราง entries
DROP TRIGGER IF EXISTS entries_sync_r2_trigger ON public.entries;
CREATE TRIGGER entries_sync_r2_trigger
  AFTER INSERT OR UPDATE OF status, body_markdown, title ON public.entries
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_entry_to_r2_trigger();

-- 6) นำเข้าข้อมูล Seed สำนักคิด 5 กลุ่ม และนักคิด 6 ท่านฉบับเต็ม
-- เมื่อทำการ INSERT แล้ว Trigger จะส่งข้อมูลประวัติ/เนื้อหาเหล่านี้ไปอัปโหลดเก็บใน R2 อัตโนมัติ!
INSERT INTO public.entries (
  slug,
  title,
  status,
  content_type,
  author_id,
  original_term,
  framework,
  school,
  short_description,
  body_markdown,
  visual_explanation,
  technical_meaning,
  tags
) VALUES 
-- -------------------------------------------------------------
-- [SCHOOL] classical-greek (กรีกโบราณ)
-- -------------------------------------------------------------
(
  'classical-greek',
  'กรีกโบราณ',
  'published',
  'school',
  'system-seed',
  'Classical Greek',
  'philosophy',
  NULL,
  $$สำนักปรัชญากรีกโบราณผู้วางรากฐานแนวคิดจริยศาสตร์ ตรรกศาสตร์ เมตาฟิสิกส์ และระเบียบสังคมของโลกตะวันตก$$,
  $$สำนักปรัชญากรีกโบราณก่อตัวขึ้นในช่วงศตวรรษที่ 5-4 ก่อนคริสตกาล ณ กรุงเอเธนส์ การเปลี่ยนผ่านจากการตั้งคำถามต่อธรรมชาติของจักรวาล (Cosmology) มาสู่การตั้งคำถามต่อตัวตนมนุษย์และสังคมของโสกราตีส ได้ริเริ่มยุคทองทางปรัชญาที่ถ่ายทอดผ่านเพลโตและส่งต่อมาถึงอริสโตเติล แนวคิดของสำนักนี้ยังคงเป็นพื้นฐานของศาสตร์วิชาร่วมสมัยแทบทุกแขนงจนถึงปัจจุบัน$$,
  NULL,
  NULL,
  NULL
),
-- [PERSON] plato (เพลโต)
(
  'plato',
  'เพลโต',
  'published',
  'person',
  'system-seed',
  'Plato',
  NULL,
  'classical-greek',
  '428 – 348 BC',
  $$เพลโต (Plato) เป็นนักปรัชญาชาวกรีกโบราณ ศิษย์ของโสกราตีสและเป็นอาจารย์ของอริสโตเติล ผู้ก่อตั้งสถาบันการศึกษา Academy ในกรุงเอเธนส์ ซึ่งถือเป็นมหาวิทยาลัยแห่งแรกของโลกตะวันตก ผลงานสนทนาของเขาเน้นศึกษาเรื่องความดี ความถูกต้อง ทฤษฎีรูปแบบ (Theory of Forms) และภาพอุปมาอุปไมยเรื่องถ้ำ (Allegory of the Cave) ซึ่งอธิบายว่าโลกกายภาพเป็นเพียงเงาสะท้อนของความจริงสูงสุดในโลกแห่งแบบฉบับ$$,
  'The measure of a man is what he does with power.',
  $$เป็นศิษย์ผู้จดบันทึกคำสอนของโสกราตีส (Socrates) และต่อมาเป็นอาจารย์ผู้ถ่ายทอดความรู้ให้กับอริสโตเติล (Aristotle) ณ สำนัก Academy$$,
  ARRAY['อุตมรัฐ (The Republic)', 'ฟีโด (Phaedo)', 'เมโน (Meno)']::text[]
),
-- [PERSON] aristotle (อริสโตเติล)
(
  'aristotle',
  'อริสโตเติล',
  'published',
  'person',
  'system-seed',
  'Aristotle',
  NULL,
  'classical-greek',
  '384 – 322 BC',
  $$อริสโตเติล (Aristotle) เป็นนักปรัชญาและนักพหุสูตชาวกรีกโบราณ ผู้ก่อตั้งสำนักคิดแบบเพอริพาทีติก (Lyceum) งานเขียนของเขาครอบคลุมวิชาฟิสิกส์ ชีววิทยา จิตวิทยา จริยศาสตร์ การเมือง ตรรกศาสตร์ และวรรณคดีวิจารณ์ เขาเน้นศึกษาผ่านการสังเกตเชิงประจักษ์และการจำแนกประเภทความรู้ ซึ่งมีอิทธิพลต่อความคืบหน้าของวิทยาศาสตร์และปรัชญายุคกลางอย่างมหาศาล$$,
  'Knowing yourself is the beginning of all wisdom.',
  $$เข้าเรียนที่สำนัก Academy ของเพลโตเป็นเวลากว่า 20 ปี ก่อนจะพัฒนาทฤษฎีปรัชญาแนวทางประจักษ์นิยมของตนเองที่โต้แย้งและก้าวข้ามทฤษฎีแบบฉบับของเพลโต$$,
  ARRAY['นิกโคมาเชียน เอธิกส์ (Nicomachean Ethics)', 'การเมือง (Politics)', 'กวีนิพนธ์ (Poetics)']::text[]
),

-- -------------------------------------------------------------
-- [SCHOOL] positivism (ปฏิฐานนิยม)
-- -------------------------------------------------------------
(
  'positivism',
  'ปฏิฐานนิยม',
  'published',
  'school',
  'system-seed',
  'Positivism',
  'philosophy',
  NULL,
  $$สำนักปรัชญาที่ยึดถือว่าความรู้ที่แท้จริงมีรากฐานมาจากข้อเท็จจริงเชิงประจักษ์และระเบียบวิธีทางวิทยาศาสตร์เท่านั้น$$,
  $$ลัทธิปฏิฐานนิยมได้รับการพัฒนาขึ้นโดยออกุสต์ กองต์ ในศตวรรษที่ 19 เพื่อหาทางจัดระเบียบสังคมฝรั่งเศสที่ระส่ำระสายหลังการปฏิวัติ โดยเสนอให้แยกความรู้ทางวิทยาศาสตร์ออกจากคำสอนทางศาสนาและความเชื่อทางอภิปรัชญา กองต์เชื่อว่าสังคมมนุษย์มีวิวัฒนาการผ่านสามขั้น และขั้นสุดท้ายคือ 'ขั้นปฏิฐาน' หรือขั้นบวกที่เป็นวิทยาศาสตร์เต็มตัว ซึ่งเป็นต้นกำเนิดของวิชาสังคมวิทยา$$,
  NULL,
  NULL,
  NULL
),
-- [PERSON] auguste-comte (ออกุสต์ กองต์)
(
  'auguste-comte',
  'ออกุสต์ กองต์',
  'published',
  'person',
  'system-seed',
  'Auguste Comte',
  NULL,
  'positivism',
  '1798 – 1857',
  $$ออกุสต์ กองต์ (Auguste Comte) เป็นนักปรัชญาชาวฝรั่งเศส ผู้วางรากฐานลัทธิปฏิฐานนิยม (Positivism) และเป็นผู้บัญญัติคำว่า 'สังคมวิทยา' (Sociology) ขึ้นเป็นคนแรก แนวคิดของเขามุ่งหวังที่จะนำวิธีการทางวิทยาศาสตร์กายภาพมาใช้ศึกษากลไกการทำงานของสังคมมนุษย์ เพื่อสถาปนาความสงบเรียบร้อยและความคืบหน้าให้เกิดขึ้นในสังคม$$,
  'Love as a principle and order as the basis; progress as the goal.',
  $$เคยเป็นเลขานุการและร่วมงานกับ อองรี เดอ แซง-ซีมง (Henri de Saint-Simon) นักคิดสังคมนิยมรุ่นแรก ผู้ส่งอิทธิพลต่อแนวคิดทางสังคมของเขาอย่างลึกซึ้ง$$,
  ARRAY['หลักปรัชญาปฏิฐานนิยม (Course of Positive Philosophy)', 'ระบบการเมืองปฏิฐานนิยม (System of Positive Polity)']::text[]
),

-- -------------------------------------------------------------
-- [SCHOOL] behaviorism (พฤติกรรมนิยม)
-- -------------------------------------------------------------
(
  'behaviorism',
  'พฤติกรรมนิยม',
  'published',
  'school',
  'system-seed',
  'Behaviorism',
  'psychology',
  NULL,
  $$สำนักคิดทางจิตวิทยาที่อธิบายพฤติกรรมมนุษย์ผ่านการวางเงื่อนไขและการตอบสนองต่อสิ่งเร้า โดยละเว้นการตีความสภาวะจิตใจภายใน$$,
  $$สำนักพฤติกรรมนิยมเติบโตขึ้นในสหรัฐอเมริกาช่วงต้นศตวรรษที่ 20 เพื่อคัดค้านวิธีการตรวจสอบจิตใจภายใน (Introspection) ที่วัดผลไม่ได้ โดยชูพฤติกรรมภายนอกที่สังเกตและวัดผลทางวิทยาศาสตร์ได้เป็นเป้าหมายหลักของการศึกษา จิตวิทยาสายนี้มีบทบาทอย่างยิ่งในทฤษฎีการเรียนรู้ การปรับเปลี่ยนพฤติกรรม และระบบการศึกษาในอดีต$$,
  NULL,
  NULL,
  NULL
),
-- [PERSON] b.f.-skinner (บี. เอฟ. สกินเนอร์)
(
  'b.f.-skinner',
  'บี. เอฟ. สกินเนอร์',
  'published',
  'person',
  'system-seed',
  'B.F. Skinner',
  NULL,
  'behaviorism',
  '1904 – 1990',
  $$บี. เอฟ. สกินเนอร์ (Burrhus Frederic Skinner) เป็นนักจิตวิทยาและนักประพฤติศาสตร์ชาวอเมริกัน ผู้คิดค้นทฤษฎีการวางเงื่อนไขแบบการกระทำ (Operant Conditioning) และกล่องการทดลอง Skinner Box ทฤษฎีของเขาอธิบายว่า พฤติกรรมของมนุษย์ถูกกำหนด ควบคุม และปรับปรุงได้โดยใช้ระบบการเสริมแรง (Reinforcement) ทั้งเชิงบวกและเชิงลบ$$,
  'Education is what survives when what has been learned has been forgotten.',
  $$ได้รับอิทธิพลจากทฤษฎีการเรียนรู้เชิงพฤติกรรมของ จอห์น บี. วัตสัน (John B. Watson) และอิวาน พาฟลอฟ (Ivan Pavlov)$$,
  ARRAY['วอลเดน ทู (Walden Two)', 'พฤติกรรมของสิ่งมีชีวิต (The Behavior of Organisms)', 'เทคโนโลยีการสอน (The Technology of Teaching)']::text[]
),

-- -------------------------------------------------------------
-- [SCHOOL] psychoanalysis (จิตวิเคราะห์)
-- -------------------------------------------------------------
(
  'psychoanalysis',
  'จิตวิเคราะห์',
  'published',
  'school',
  'system-seed',
  'Psychoanalysis',
  'psychology',
  NULL,
  $$ศาสตร์และวิธีการบำบัดรักษาทางจิตที่มุ่งสำรวจพลังขับและโครงสร้างของจิตไร้สำนึกผ่านกระบวนการทางคลินิก$$,
  $$สำนักจิตวิเคราะห์ก่อตั้งขึ้นโดย ซิกมุนด์ ฟรอยด์ ในกรุงเวียนนาช่วงปลายศตวรรษที่ 19 โดยเสนอว่า จิตใจมนุษย์ประกอบด้วยจิตสำนึก จิตกึ่งสำนึก และจิตไร้สำนึกซึ่งส่งผลโดยตรงต่อการทำพฤติกรรมมนุษย์ พลังขับทางเพศและความขัดแย้งที่ถูกกดทับไว้ในวัยเด็ก คือกลไกสำคัญเบื้องหลังสภาวะจิตใจของมนุษย์$$,
  NULL,
  NULL,
  NULL
),
-- [PERSON] sigmund-freud (ซิกมุนด์ ฟรอยด์)
(
  'sigmund-freud',
  'ซิกมุนด์ ฟรอยด์',
  'published',
  'person',
  'system-seed',
  'Sigmund Freud',
  NULL,
  'psychoanalysis',
  '1856 – 1939',
  $$ซิกมุนด์ ฟรอยด์ (Sigmund Freud) จิตแพทย์และประสาทแพทย์ชาวออสเตรีย ผู้ก่อตั้งแนวคิดจิตวิเคราะห์ (Psychoanalysis) ทฤษฎีของเขาเกี่ยวกับโครงสร้างสามส่วนของจิต (Id, Ego, Superego) กลไกการป้องกันตัวเอง (Defense Mechanisms) และการตีความสัญลักษณ์ความฝัน ได้เปิดพรมแดนใหม่ในการทำความเข้าใจสภาวะจิตของมนุษย์$$,
  'Where Id was, there Ego shall be.',
  $$เป็นอาจารย์และผู้ร่วมงานใกล้ชิดของ Carl Jung ในช่วงต้นศตวรรษที่ 20 ก่อนที่จะมีความเห็นขัดแย้งทางวิชาการและแยกทางกันอย่างถาวร$$,
  ARRAY['การตีความความฝัน (The Interpretation of Dreams)', 'สามความเรียงเรื่องทฤษฎีทางเพศ (Three Essays on the Theory of Sexuality)']::text[]
),

-- -------------------------------------------------------------
-- [SCHOOL] analytical-psychology (จิตวิทยาวิเคราะห์)
-- -------------------------------------------------------------
(
  'analytical-psychology',
  'จิตวิทยาวิเคราะห์',
  'published',
  'school',
  'system-seed',
  'Analytical Psychology',
  'psychology',
  NULL,
  $$สำนักจิตวิทยาเชิงลึกที่ศึกษาความสัมพันธ์ระหว่าง Ego จิตไร้สำนึกส่วนบุคคล และจิตไร้สำนึกร่วม ผ่านระบบสัญลักษณ์และแบบแผนร่วม$$,
  $$สำนักคิดจิตวิทยาวิเคราะห์ถูกก่อตั้งขึ้นโดย Carl Jung ภายหลังแยกทางจาก Sigmund Freud ในปี 1913 ยุงต้องการก้ามข้ามกรอบความคิดที่ยึดติดกับพลังขับทางเพศของฟรอยด์ โดยขยายไปศึกษาความฝัน ตำนาน ศาสนาเปรียบเทียบ และแบบแผนร่วมทางศิลปะของมนุษยชาติ เพื่อชี้ให้เห็นโครงสร้างร่วมทางจิตวิญญาณของบุคคล$$,
  NULL,
  NULL,
  NULL
),
-- [PERSON] carl-jung (คาร์ล ยุง)
(
  'carl-jung',
  'คาร์ล ยุง',
  'published',
  'person',
  'system-seed',
  'Carl Jung',
  NULL,
  'analytical-psychology',
  '1875 – 1961',
  $$คาร์ล กุสทัฟ ยุง (Carl Gustav Jung) จิตแพทย์และนักคิดชาวสวิส ผู้ก่อตั้งสำนักคิดจิตวิทยาวิเคราะห์ (Analytical Psychology) งานบุกเบิกของเขารวมถึงทฤษฎีแบบแผนดั้งเดิม (Archetypes), จิตไร้สำนึกร่วม (Collective Unconscious), สัญลักษณ์ตนเอง (Self), บุคลิกภาพแบบ Introvert/Extrovert และกระบวนการปัจเจกภาพเพื่อบรรลุศักยภาพจิตภายใน$$,
  'Who looks outside, dreams; who looks inside, awakes.',
  $$เคยศึกษาเล่าเรียนและร่วมงานอย่างลึกซึ้งกับ ซิกมุนด์ ฟรอยด์ (Sigmund Freud) ก่อนจะแยกตัวออกมาก่อตั้งสำนักคิดของตนเองเนื่องจากข้อโต้แย้งทางวิชาการ$$,
  ARRAY['จิตวิทยาและเคมีสัมพันธ์โบราณ (Psychology and Alchemy)', 'ประเภททางจิตวิทยา (Psychological Types)', 'หนังสือแดง (The Red Book)']::text[]
)

-- 7) ตรวจสอบความถูกต้องและอัปเดตเมื่อซ้ำ (Upsert Logic)
ON CONFLICT (slug) 
DO UPDATE SET
  title = EXCLUDED.title,
  status = EXCLUDED.status,
  content_type = EXCLUDED.content_type,
  author_id = EXCLUDED.author_id,
  original_term = EXCLUDED.original_term,
  framework = EXCLUDED.framework,
  school = EXCLUDED.school,
  short_description = EXCLUDED.short_description,
  body_markdown = EXCLUDED.body_markdown,
  visual_explanation = EXCLUDED.visual_explanation,
  technical_meaning = EXCLUDED.technical_meaning,
  tags = EXCLUDED.tags,
  updated_at = now();
