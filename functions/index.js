import { onSchedule } from "firebase-functions/v2/scheduler";
import { initializeApp } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import sgMail from "@sendgrid/mail";

initializeApp();
const db = getFirestore();

// 本番はSecret Manager推奨
const parentEmail = process.env.PARENT_EMAIL || "parent@example.com";
const sendgridKey = process.env.SENDGRID_API_KEY || "";

if (sendgridKey) {
  sgMail.setApiKey(sendgridKey);
}

export const sendDailyReport = onSchedule(
  { schedule: "every day 20:00", timeZone: "Asia/Tokyo" },
  async () => {
    const since = Timestamp.fromDate(new Date(Date.now() - 24 * 60 * 60 * 1000));
    const studentsSnap = await db.collection("students").get();

    let lines = ["【日次学習レポート】"];

    for (const stu of studentsSnap.docs) {
      const studentId = stu.id;
      const sessions = await db
        .collection("students")
        .doc(studentId)
        .collection("sessions")
        .where("createdAt", ">=", since)
        .get();

      if (sessions.empty) continue;

      let solved = 0;
      let correct = 0;
      let currentLevel = 1;
      let name = studentId;

      sessions.forEach((s) => {
        const d = s.data();
        solved += d.solved || 0;
        correct += d.correct || 0;
        currentLevel = Math.max(currentLevel, d.currentLevel || 1);
        name = d.studentName || name;
      });

      const rate = solved ? Math.round((correct / solved) * 100) : 0;
      lines.push(`${name}: ${solved}問 / 正答${correct}問 / 正答率${rate}% / 現在Lv${currentLevel}`);
    }

    if (lines.length === 1) lines.push("本日の学習記録はありません。");

    if (!sendgridKey) {
      console.log(lines.join("\n"));
      return;
    }

    await sgMail.send({
      to: parentEmail,
      from: parentEmail, // SendGridで認証済みの送信元を指定
      subject: "才弥の数学クエスト 日次レポート",
      text: lines.join("\n")
    });
  }
);