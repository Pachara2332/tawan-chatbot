# Tawan Chatbot

Tawan Chatbot คือเว็บแชตบอตภาษาไทยที่สร้างด้วย Next.js และเชื่อมต่อกับ Google Gemini API เพื่อพูดคุย ตอบคำถาม และให้คำแนะนำกับผู้ใช้งานผ่านหน้าเว็บที่เรียบง่าย ใช้งานได้ทันทีจากเบราว์เซอร์

## คำอธิบายสั้นสำหรับ Description

เว็บแชตบอตภาษาไทยชื่อ Tawan สร้างด้วย Next.js และ Gemini 2.5 Flash สำหรับพูดคุย ตอบคำถาม และให้คำแนะนำอย่างเป็นมิตร

## ฟีเจอร์

- หน้าแชตแบบเรียลไทม์สำหรับส่งข้อความและรับคำตอบจาก AI
- ใช้โมเดล `gemini-2.5-flash` ผ่านแพ็กเกจ `@google/genai`
- API route ฝั่งเซิร์ฟเวอร์ที่ `/api/chat` สำหรับซ่อน API key จากฝั่ง client
- จำกัดประวัติข้อความล่าสุด 20 รายการก่อนส่งให้โมเดล
- มีสถานะกำลังโหลด ข้อความ error และการส่งด้วยปุ่ม Enter
- ออกแบบ UI ด้วย Tailwind CSS

## เทคโนโลยีที่ใช้

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Google Gen AI SDK
- ESLint

## การติดตั้ง

ติดตั้ง dependencies:

```bash
npm install
```

สร้างไฟล์ `.env` ที่ root ของโปรเจกต์ แล้วใส่ค่า API key:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

> หมายเหตุ: ในโปรเจกต์มีตัวแปร `OPENAI_API_KEY` ได้เช่นกัน แต่โค้ดแชตหลักตอนนี้เรียกใช้งานผ่าน `GEMINI_API_KEY`

## การรันโปรเจกต์

รัน development server:

```bash
npm run dev
```

เปิดเว็บที่:

```text
http://localhost:3000
```

## คำสั่งที่ใช้บ่อย

```bash
npm run dev
```

รันโปรเจกต์สำหรับพัฒนา

```bash
npm run build
```

Build โปรเจกต์สำหรับ production

```bash
npm run start
```

รัน production server หลังจาก build แล้ว

```bash
npm run lint
```

ตรวจสอบคุณภาพโค้ดด้วย ESLint

## โครงสร้างโปรเจกต์

```text
app/
  api/chat/route.ts   API route สำหรับเรียก Gemini
  globals.css         สไตล์หลักและ Tailwind CSS
  layout.tsx          layout หลักของแอป
  page.tsx            หน้าแชตหลัก
public/               ไฟล์ static
models.txt            รายการ/บันทึกเกี่ยวกับโมเดล
test-gemini.mjs       สคริปต์ทดสอบ Gemini SDK
```

## การ Deploy

โปรเจกต์นี้สามารถ deploy บนแพลตฟอร์มที่รองรับ Next.js ได้ เช่น Vercel หรือ Node.js hosting ทั่วไป โดยต้องตั้งค่า environment variable ต่อไปนี้บนระบบ deploy:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

จากนั้น build และรันด้วย:

```bash
npm run build
npm run start
```

## หมายเหตุด้านความปลอดภัย

- อย่า commit ไฟล์ `.env` หรือ API key ขึ้น repository
- ควรเก็บ API key ไว้ใน environment variables ของเครื่องหรือแพลตฟอร์ม deploy เท่านั้น
- หาก API key เคยถูกเผยแพร่โดยไม่ตั้งใจ ควรสร้าง key ใหม่และปิด key เดิมทันที
