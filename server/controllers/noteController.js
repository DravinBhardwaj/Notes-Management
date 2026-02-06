import Note from "../models/Note.js";
import uploadPdf from "../utils/uploadPdf.js";
import PDFDocument from "pdfkit";
import axios from "axios";
import SystemConfig from "../models/SystemConfig.js"; // 🔥 IMPORTANT

/* ================= HELPERS ================= */

const cleanHtml = (html = "") => {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<\/div>/gi, "\n")
    .replace(/<p>/gi, "")
    .replace(/<div>/gi, "")
    .replace(/<[^>]*>/g, "")
    .replace(/\n{2,}/g, "\n\n") // avoid too many empty lines
    .trim();
};

const resolveGroupId = (req) => {
  if (req.user.role === "superadmin") return "__SYSTEM__";
  return req.user.groupId;
};

const ensureGroupId = (note, req) => {
  if (!note.groupId) {
    note.groupId = req.user.groupId;
  }
};

/* ================= CREATE NOTE ================= */

export const createNote = async (req, res) => {
  try {
    const { title, pages = [], visibility = "private" } = req.body;

    if (!title || pages.length === 0) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    //  students cannot create public notes
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
  type: "generated", //  REQUIRED
  visibility,
  pdfUrl,
  user: req.userId,
  groupId: resolveGroupId(req),
});


      res.status(201).json(note);
    });

    doc.fontSize(20).text(title, { underline: true });
    doc.moveDown();

    pages.forEach((page, index) => {
      if (index !== 0) doc.addPage();
      doc.fontSize(12).text(cleanHtml(page.html));
    });

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

    let query;

    if (isSuperAdmin) {
      query = {};
    } else if (isGroupAdmin) {
      //  group admin sees ALL notes of group (public + private)
      query = { groupId: req.user.groupId };
    } else {
      // 🎓 student
      query = {
        groupId: req.user.groupId,
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
    if (!note) return res.status(404).json({ message: "Note not found" });

    const isOwner = String(note.user) === String(req.userId);
    const isSuperAdmin = req.user.role === "superadmin";
    const isGroupAdmin = req.user.isGroupAdmin === true;

    //  cross-group block
    if (
      note.groupId !== "__SYSTEM__" &&
      note.groupId !== req.user.groupId &&
      !isSuperAdmin
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    //  private note access
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
    if (!note) return res.status(404).json({ message: "Note not found" });

    const isOwner = String(note.user) === String(req.userId);
    const isSuperAdmin = req.user.role === "superadmin";
    const isGroupAdmin = req.user.isGroupAdmin === true;

    if (
      note.groupId !== "__SYSTEM__" &&
      note.groupId !== req.user.groupId &&
      !isSuperAdmin
    ) {
      return res.status(403).json({
        message: "You cannot modify notes outside your group",
      });
    }

    if (!isOwner && !isSuperAdmin && !isGroupAdmin) {
      return res.status(403).json({ message: "Access denied" });
    }

    //  FETCH SYSTEM CONFIG
    const config = await SystemConfig.findOne();

    //  BLOCK private → public when posting is disabled
    if (
      visibility === "public" &&
      note.visibility === "private" &&
      config?.postingEnabled === false &&
      !isSuperAdmin
    ) {
      return res.status(403).json({
        message: "Public posting is disabled by Super Admin",
      });
    }

    ensureGroupId(note, req);

    //  VISIBILITY-ONLY UPDATE
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

    doc.fontSize(20).text(title ?? note.title, { underline: true });
    doc.moveDown();

    const pagesToRender = pages ?? note.pages;
    pagesToRender.forEach((page, index) => {
      if (index !== 0) doc.addPage();
      doc.fontSize(12).text(cleanHtml(page.html));
    });

    doc.end();
  } catch (err) {
    console.error("UPDATE NOTE ERROR:", err);
    res.status(500).json({ message: "Failed to update note" });
  }
};



/* ================= UPLOAD PDF ================= */


export const uploadPdfController = async (req, res) => {
  try {
    const pdfUrl = await uploadPdf(
      req.file.buffer,
      req.file.originalname.replace(/\.pdf$/i, "")
    );

    const note = await Note.create({
      title: req.file.originalname.replace(/\.pdf$/i, ""), // 🔥 FIX
      pages: [],
      type: "uploaded",
      visibility: "private",
      pdfUrl,
      user: req.userId,
      groupId: req.user.groupId,
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
    if (!note) return res.status(404).json({ message: "Note not found" });

    const isOwner = String(note.user) === String(req.userId);
    const isSuperAdmin = req.user.role === "superadmin";
    const isGroupAdmin = req.user.isGroupAdmin === true;

    if (!isOwner && !isSuperAdmin && !isGroupAdmin) {
      return res.status(403).json({ message: "Access denied" });
    }

    await note.deleteOne();
    res.json({ message: "Note deleted permanently" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const downloadNotePdf = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

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