import Note from "../models/Note.js";
import uploadPdf from "../utils/uploadPdf.js";
import PDFDocument from "pdfkit";
import axios from "axios";
import SystemConfig from "../models/SystemConfig.js";

/* ================= HELPERS ================= */

const cleanHtml = (html = "") => {
  return html
    .replace(/&nbsp;/gi, " ")
    .replace(/<div><br><\/div>/gi, "\n")
    .replace(/<div>/gi, "\n")
    .replace(/<\/div>/gi, "")
    .replace(/<p>/gi, "\n")
    .replace(/<\/p>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
};

const normalizeGroupId = (id) => id?.toLowerCase();

/* ================= CREATE NOTE ================= */

export const createNote = async (req, res) => {
  try {
    if (req.user.role === "superadmin") {
      return res.status(403).json({
        message: "Super admin cannot create notes",
      });
    }

    const { title, pages = [], visibility = "private" } = req.body;

    if (!title || pages.length === 0) {
      return res.status(400).json({
        message: "Title and content are required",
      });
    }

    if (
      visibility === "public" &&
      req.user.role === "student" &&
      !req.user.isGroupAdmin
    ) {
      return res.status(403).json({
        message: "Only admins can create public notes",
      });
    }

    const doc = new PDFDocument({ margin: 50 });
    const buffers = [];

    doc.on("data", buffers.push.bind(buffers));

    doc.on("end", async () => {
      const pdfUrl = await uploadPdf(
        Buffer.concat(buffers),
        `${title.replace(/\s+/g, "_")}-${Date.now()}`
      );

      const note = await Note.create({
        title,
        pages,
        type: "generated",
        visibility,
        pdfUrl,
        user: req.userId,
        groupId: normalizeGroupId(req.user.groupId),
      });

      res.status(201).json(note);
    });

    /* ================= FIRST PAGE ================= */

    const firstPage = pages[0];

    // Draw first page background
    doc
      .rect(0, 0, doc.page.width, doc.page.height)
      .fill(firstPage.bgColor || "#FFFFFF");

    doc.fillColor("#000000");

    // Title as heading (NOT separate page)
    doc.fontSize(20).text(title, 50, 50, {
      width: doc.page.width - 100,
    });

    doc.moveDown();

    // First page content
   doc.fontSize(12).text(
  cleanHtml(firstPage.html),
  50,
  doc.y,
  {
    width: doc.page.width - 100,
    lineGap: 4,
  }
);

    /* ================= REMAINING PAGES ================= */

    for (let i = 1; i < pages.length; i++) {
      const p = pages[i];

      doc.addPage();

      doc
        .rect(0, 0, doc.page.width, doc.page.height)
        .fill(p.bgColor || "#FFFFFF");

      doc.fillColor("#000000");

      doc.fontSize(12).text(cleanHtml(p.html), 50, 50, {
        width: doc.page.width - 100,
      });
    }

    doc.end();
  } catch (err) {
    console.error("CREATE NOTE ERROR:", err);
    res.status(500).json({ message: "Failed to create note" });
  }
};

/* ================= GET NOTES ================= */

export const getNotes = async (req, res) => {
  try {
    const isSuperAdmin = req.user.role === "superadmin";
    const isGroupAdmin = req.user.isGroupAdmin === true;
    const groupId = normalizeGroupId(req.user.groupId);

    let query;

    if (isSuperAdmin) {
      query = {};
    } else if (isGroupAdmin) {
      query = { groupId };
    } else {
      query = {
        groupId,
        $or: [{ visibility: "public" }, { user: req.userId }],
      };
    }

    const notes = await Note.find(query)
      .sort({ createdAt: -1 })
      .select("-pages");

    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= GET NOTE BY ID ================= */

export const getNoteById = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note)
      return res.status(404).json({ message: "Note not found" });

    const isOwner = String(note.user) === String(req.userId);
    const isSuperAdmin = req.user.role === "superadmin";
    const isGroupAdmin = req.user.isGroupAdmin === true;

    if (
      !isSuperAdmin &&
      normalizeGroupId(note.groupId) !==
        normalizeGroupId(req.user.groupId) &&
      !isOwner
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    if (
      note.visibility === "private" &&
      !isOwner &&
      !isSuperAdmin &&
      !isGroupAdmin
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(note);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= UPDATE NOTE ================= */

export const updateNote = async (req, res) => {
  try {
    const { title, pages, visibility } = req.body;

    const note = await Note.findById(req.params.id);
    if (!note)
      return res.status(404).json({ message: "Note not found" });

    const isOwner = String(note.user) === String(req.userId);
    const isSuperAdmin = req.user.role === "superadmin";
    const isGroupAdmin = req.user.isGroupAdmin === true;

    if (
      !isSuperAdmin &&
      normalizeGroupId(note.groupId) !==
        normalizeGroupId(req.user.groupId) &&
      !isOwner
    ) {
      return res.status(403).json({
        message: "You cannot modify notes outside your group",
      });
    }

    if (!isOwner && !isGroupAdmin && !isSuperAdmin) {
      return res.status(403).json({ message: "Access denied" });
    }

    const config = await SystemConfig.findOne();

    if (
      visibility === "public" &&
      note.visibility === "private" &&
      config?.postingEnabled === false &&
      !isSuperAdmin
    ) {
      return res.status(403).json({
        message: "Posting window is disabled by super admin",
      });
    }

    if (visibility && !title && !pages) {
      note.visibility = visibility;
      await note.save();
      return res.json(note);
    }

    const doc = new PDFDocument({ margin: 50 });
    const buffers = [];

    doc.on("data", buffers.push.bind(buffers));

    doc.on("end", async () => {
      note.title = title ?? note.title;
      note.pages = pages ?? note.pages;
      note.visibility = visibility ?? note.visibility;

      note.pdfUrl = await uploadPdf(
        Buffer.concat(buffers),
        `${note.title.replace(/\s+/g, "_")}-${Date.now()}`
      );

      await note.save();
      res.json(note);
    });

    const updatedPages = pages ?? note.pages;
    const finalTitle = title ?? note.title;

    /* ================= FIRST PAGE ================= */

    const firstPage = updatedPages[0];

    doc
      .rect(0, 0, doc.page.width, doc.page.height)
      .fill(firstPage.bgColor || "#FFFFFF");

    doc.fillColor("#000000");

    // Title
    doc.fontSize(20).text(finalTitle, 50, 50, {
      width: doc.page.width - 100,
    });

    doc.moveDown(1.5);

    // First page content (FIXED)
    doc.fontSize(12).text(
      cleanHtml(firstPage.html),
      50,
      doc.y,
      {
        width: doc.page.width - 100,
        lineGap: 4,
      }
    );

    /* ================= OTHER PAGES ================= */

    for (let i = 1; i < updatedPages.length; i++) {
      const p = updatedPages[i];

      doc.addPage();

      doc
        .rect(0, 0, doc.page.width, doc.page.height)
        .fill(p.bgColor || "#FFFFFF");

      doc.fillColor("#000000");

      doc.fontSize(12).text(
        cleanHtml(p.html),
        50,
        50,
        {
          width: doc.page.width - 100,
          lineGap: 4,
        }
      );
    }

    doc.end();
  } catch (err) {
    console.error("UPDATE NOTE ERROR:", err);
    res.status(500).json({ message: "Failed to update note" });
  }
};

/* ================= UPLOAD PDF ================= */

export const uploadPdfController = async (req, res) => {
  try {
    if (req.user.role === "superadmin") {
      return res.status(403).json({
        message: "Super admin cannot upload notes",
      });
    }

    const pdfUrl = await uploadPdf(
      req.file.buffer,
      req.file.originalname.replace(/\.pdf$/i, "")
    );

    const note = await Note.create({
      title: req.file.originalname.replace(/\.pdf$/i, ""),
      pages: [],
      type: "uploaded",
      visibility: "private",
      pdfUrl,
      user: req.userId,
      groupId: normalizeGroupId(req.user.groupId),
    });

    res.status(201).json(note);
  } catch (err) {
    console.error("UPLOAD PDF ERROR:", err);
    res.status(500).json({ message: "PDF upload failed" });
  }
};

/* ================= DELETE NOTE ================= */

export const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note)
      return res.status(404).json({ message: "Note not found" });

    const isOwner = String(note.user) === String(req.userId);
    const isSuperAdmin = req.user.role === "superadmin";
    const isGroupAdmin = req.user.isGroupAdmin === true;

    if (!isOwner && !isGroupAdmin && !isSuperAdmin) {
      return res.status(403).json({ message: "Access denied" });
    }

    await note.deleteOne();
    res.json({ message: "Note deleted permanently" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= DOWNLOAD PDF ================= */

export const downloadNotePdf = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note)
      return res.status(404).json({ message: "Note not found" });

    const response = await axios.get(note.pdfUrl, {
      responseType: "arraybuffer",
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${note.title}.pdf"`
    );

    res.send(Buffer.from(response.data));
  } catch (error) {
    console.error("DOWNLOAD PDF ERROR:", error);
    res.status(500).json({ message: "Failed to download PDF" });
  }
};