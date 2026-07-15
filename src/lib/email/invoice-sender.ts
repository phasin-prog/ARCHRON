// ARCHRON — Resend Email Engine for Jungian Type Analysis Invoices & Reports
// Uses standard REST API fetch to https://api.resend.com/emails with process.env.RESEND_API_KEY

import type { InvoiceData } from "@/components/guide/types";

export interface SendEmailResult {
  ok: boolean;
  id?: string;
  error?: string;
}

export async function sendJungianInvoiceEmail(
  invoice: InvoiceData,
  type: "payment_confirmed" | "report_delivered" | "invoice_created"
): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { ok: false, error: "ไม่พบ RESEND_API_KEY ในระบบ environment variables (.env.local)" };
  }

  // Choose sender address — Resend requires using onboarding@resend.dev during testing/sandbox or custom domain like notifications@archron.app
  const fromAddress = process.env.RESEND_FROM_EMAIL || "Archron Studio <onboarding@resend.dev>";
  const toAddress = invoice.customerEmail;

  let subject = `[Archron] แจ้งสถานะใบแจ้งยอด #${invoice.invoiceNumber}`;
  let htmlContent = "";

  const brandAccent = "#5F8DCE";
  const brandBg = "#FAF8F5";
  const cardBg = "#FFFFFF";
  const textColor = "#1A1815";
  const subtextColor = "#6A6760";

  if (type === "payment_confirmed") {
    subject = `✨ [Archron] ยืนยันการชำระเงินและนัดหมายวิเคราะห์เชิงจิตวิทยา (#${invoice.invoiceNumber})`;
    htmlContent = `
    <!DOCTYPE html>
    <html lang="th">
    <head>
      <meta charset="utf-8">
      <title>${subject}</title>
      <style>
        body { font-family: 'Sarabun', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: ${brandBg}; color: ${textColor}; margin: 0; padding: 30px 15px; }
        .container { max-w: 600px; margin: 0 auto; background-color: ${cardBg}; border-radius: 16px; border: 1px solid #E5E2DC; padding: 36px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
        .header { border-bottom: 2px solid ${brandAccent}; padding-bottom: 20px; margin-bottom: 24px; text-align: center; }
        .logo { font-size: 22px; font-weight: bold; color: ${brandAccent}; letter-spacing: 2px; }
        .badge { display: inline-block; background-color: #EBF3FC; color: ${brandAccent}; font-size: 13px; font-weight: bold; padding: 6px 14px; border-radius: 20px; margin-top: 10px; }
        .details-box { background-color: #F8FAF9; border-left: 4px solid #10B981; padding: 18px; border-radius: 8px; margin: 24px 0; font-size: 14px; line-height: 1.7; }
        .footer { margin-top: 32px; padding-top: 20px; border-top: 1px solid #E5E2DC; font-size: 12px; color: ${subtextColor}; text-align: center; line-height: 1.6; }
        .btn { display: inline-block; background-color: ${brandAccent}; color: #FFFFFF; font-weight: bold; text-decoration: none; padding: 12px 28px; border-radius: 10px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">ARCHRON STUDIO</div>
          <div class="badge">✔ อนุมัติสลิปและยืนยันนัดหมายเรียบร้อยแล้ว</div>
        </div>
        <p>เรียนคุณ <strong>${invoice.customerName}</strong>,</p>
        <p>ทางทีมงาน Archron Studio ได้รับยอดชำระเงินจำนวน <strong>${invoice.amount.toFixed(2)} บาท</strong> สำหรับใบแจ้งยอดรหัส <strong>${invoice.invoiceNumber}</strong> เรียบร้อยแล้วค่ะ</p>
        
        <div class="details-box">
          <strong>📅 ข้อมูลการนัดหมายเซสชันวิเคราะห์เชิงลึก (90 นาที):</strong><br>
          • <strong>บริการ:</strong> ${invoice.serviceName}<br>
          • <strong>วันที่นัดหมาย:</strong> ${invoice.appointmentDate}<br>
          • <strong>เวลา:</strong> ${invoice.appointmentTime} น.<br>
          • <strong>สถานะ:</strong> อนุมัติและล็อกคิวเรียบร้อย (Confirmed & Paid)
        </div>

        <p>คุณสามารถเข้าสู่ระบบ <strong>Archron Client Portal</strong> เพื่อดูรายละเอียด เตรียมข้อคำถาม และรอรับลิงก์ห้องปรึกษา หรือดาวน์โหลดรายงานหลังจบเซสชันได้ตลอดเวลา</p>
        
        <div style="text-align: center;">
          <a href="https://archron.app/guide" class="btn">เข้าสู่ Client Portal ของคุณ</a>
        </div>

        <div class="footer">
          หากท่านต้องการเปลี่ยนแปลงวันเวลา หรือสอบถามข้อมูลเพิ่มเติม สามารถติดต่อทีมงานได้ที่ support@archron.app<br>
          Archron — คลังความรู้และสถาบันวิเคราะห์เชิงจิตวิทยา (Jungian Typology)
        </div>
      </div>
    </body>
    </html>
    `;
  } else if (type === "report_delivered") {
    subject = `📑 [Archron] รายงานผลวิเคราะห์ Jungian Type Analysis (#${invoice.invoiceNumber}) พร้อมให้ดาวน์โหลดแล้ว`;
    htmlContent = `
    <!DOCTYPE html>
    <html lang="th">
    <head>
      <meta charset="utf-8">
      <title>${subject}</title>
      <style>
        body { font-family: 'Sarabun', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: ${brandBg}; color: ${textColor}; margin: 0; padding: 30px 15px; }
        .container { max-w: 600px; margin: 0 auto; background-color: ${cardBg}; border-radius: 16px; border: 1px solid #E5E2DC; padding: 36px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
        .header { border-bottom: 2px solid #10B981; padding-bottom: 20px; margin-bottom: 24px; text-align: center; }
        .logo { font-size: 22px; font-weight: bold; color: ${brandAccent}; letter-spacing: 2px; }
        .badge { display: inline-block; background-color: #ECFDF5; color: #059669; font-size: 13px; font-weight: bold; padding: 6px 14px; border-radius: 20px; margin-top: 10px; }
        .details-box { background-color: #F0F9FF; border-left: 4px solid ${brandAccent}; padding: 18px; border-radius: 8px; margin: 24px 0; font-size: 14px; line-height: 1.7; }
        .footer { margin-top: 32px; padding-top: 20px; border-top: 1px solid #E5E2DC; font-size: 12px; color: ${subtextColor}; text-align: center; line-height: 1.6; }
        .btn { display: inline-block; background-color: #059669; color: #FFFFFF; font-weight: bold; text-decoration: none; padding: 14px 32px; border-radius: 10px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">ARCHRON STUDIO</div>
          <div class="badge">📑 รายงานผลวิเคราะห์เสร็จสมบูรณ์ (R2 Cloud Storage)</div>
        </div>
        <p>เรียนคุณ <strong>${invoice.customerName}</strong>,</p>
        <p>ขอขอบคุณที่ร่วมค้นหาและทำความเข้าใจโครงสร้างทางจิตใจ (Psychological Types) กับ Archron Studio ในเซสชันที่ผ่านมาค่ะ</p>
        
        <div class="details-box">
          <strong>🧭 สรุปข้อมูลรายงานวิเคราะห์เชิงลึก:</strong><br>
          • <strong>รหัสเซสชัน:</strong> ${invoice.invoiceNumber}<br>
          • <strong>บริการ:</strong> ${invoice.serviceName}<br>
          • <strong>ไฟล์รายงาน:</strong> เอกสาร PDF สรุปฟังก์ชันจิตวิทยา 8 ฟังก์ชัน พร้อมแนวทางการพัฒนาตนเองเฉพาะบุคคล
        </div>

        <p>ทีมผู้เชี่ยวชาญได้ทำการอัปโหลดรายงานฉบับเต็มลงบนระบบ Cloud Storage ปลอดภัยเรียบร้อยแล้ว คุณสามารถเปิดอ่านหรือดาวน์โหลด PDF ได้จากปุ่มด้านล่างทันที:</p>
        
        <div style="text-align: center;">
          <a href="${invoice.reportPdfUrl || 'https://archron.app/guide'}" class="btn">📥 ดาวน์โหลดรายงานวิเคราะห์ PDF</a>
        </div>

        <div class="footer">
          หากมีข้อสงสัยหรือต้องการรับคำปรึกษาเพิ่มเติมในระยะยาว สามารถเข้าสู่ระบบ Client Portal หรือติดต่อทีมงานได้ตลอดเวลาค่ะ<br>
          Archron — คลังความรู้และสถาบันวิเคราะห์เชิงจิตวิทยา
        </div>
      </div>
    </body>
    </html>
    `;
  } else {
    subject = `📄 [Archron] ใบแจ้งยอดรอชำระ (#${invoice.invoiceNumber}) — Jungian Type Analysis`;
    htmlContent = `
    <!DOCTYPE html>
    <html lang="th">
    <head>
      <meta charset="utf-8">
      <title>${subject}</title>
      <style>
        body { font-family: 'Sarabun', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: ${brandBg}; color: ${textColor}; margin: 0; padding: 30px 15px; }
        .container { max-w: 600px; margin: 0 auto; background-color: ${cardBg}; border-radius: 16px; border: 1px solid #E5E2DC; padding: 36px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
        .header { border-bottom: 2px solid ${brandAccent}; padding-bottom: 20px; margin-bottom: 24px; text-align: center; }
        .logo { font-size: 22px; font-weight: bold; color: ${brandAccent}; letter-spacing: 2px; }
        .details-box { background-color: #FFFBEB; border-left: 4px solid #F59E0B; padding: 18px; border-radius: 8px; margin: 24px 0; font-size: 14px; line-height: 1.7; }
        .footer { margin-top: 32px; padding-top: 20px; border-top: 1px solid #E5E2DC; font-size: 12px; color: ${subtextColor}; text-align: center; line-height: 1.6; }
        .btn { display: inline-block; background-color: ${brandAccent}; color: #FFFFFF; font-weight: bold; text-decoration: none; padding: 12px 28px; border-radius: 10px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">ARCHRON STUDIO</div>
        </div>
        <p>เรียนคุณ <strong>${invoice.customerName}</strong>,</p>
        <p>ระบบได้ทำการสร้างใบแจ้งยอดและล็อกช่วงเวลานัดหมายของคุณเรียบร้อยแล้ว โดยมีรายละเอียดดังนี้:</p>
        
        <div class="details-box">
          <strong>รหัสใบแจ้งยอด:</strong> ${invoice.invoiceNumber}<br>
          <strong>บริการ:</strong> ${invoice.serviceName}<br>
          <strong>วันเวลานัดหมาย:</strong> ${invoice.appointmentDate} เวลา ${invoice.appointmentTime} น.<br>
          <strong>ยอดชำระ:</strong> ${invoice.amount.toFixed(2)} บาท<br>
          <strong>ช่องทาง:</strong> ${invoice.paymentMethod} (${invoice.promptPayNumber})
        </div>

        <p>กรุณาชำระเงินและสแกนแนบสลิปผ่านทางหน้าเว็บหรือ Client Portal เพื่อให้ทีมงานยืนยันคิวโดยเร็วที่สุด</p>
        
        <div style="text-align: center;">
          <a href="https://archron.app/guide" class="btn">เข้าสู่หน้าระบบเพื่อแนบสลิป</a>
        </div>

        <div class="footer">
          Archron — คลังความรู้และสถาบันวิเคราะห์เชิงจิตวิทยา
        </div>
      </div>
    </body>
    </html>
    `;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromAddress,
        to: [toAddress],
        subject,
        html: htmlContent,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      return { ok: false, error: data.message || data.error || "เกิดข้อผิดพลาดจาก Resend API" };
    }

    return { ok: true, id: data.id };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "การเชื่อมต่อ Resend ล้มเหลว" };
  }
}
