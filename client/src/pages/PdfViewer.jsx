import { useLocation } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf";
import { useState, useRef, useEffect } from "react";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const PdfViewer = () => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const pdfUrl = params.get("url");

  const [numPages, setNumPages] = useState(0);
  const [scale, setScale] = useState(1);
  const [autoScale, setAutoScale] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInput, setPageInput] = useState("1");

  const pageRefs = useRef([]);

  /* ================= AUTO RESPONSIVE SCALE ================= */
  useEffect(() => {
    if (!autoScale) return;

    const updateScale = () => {
      if (window.innerWidth < 640) {
        setScale(0.8);       // mobile
      } else if (window.innerWidth < 1024) {
        setScale(1.0);       // tablet
      } else {
        setScale(1.2);       // desktop
      }
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [autoScale]);

  /* ================= SCROLL → PAGE SYNC ================= */
  const handleScroll = () => {
    for (let i = 0; i < pageRefs.current.length; i++) {
      const page = pageRefs.current[i];
      if (!page) continue;

      const rect = page.getBoundingClientRect();
      if (rect.top >= 0 && rect.top < window.innerHeight / 2) {
        setCurrentPage(i + 1);
        setPageInput(String(i + 1));
        break;
      }
    }
  };

  /* ================= GO TO PAGE ================= */
  const goToPage = () => {
    const pageNum = Number(pageInput);
    if (
      pageNum >= 1 &&
      pageNum <= numPages &&
      pageRefs.current[pageNum - 1]
    ) {
      pageRefs.current[pageNum - 1].scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  if (!pdfUrl) {
    return <p className="text-center mt-10">No PDF URL provided</p>;
  }

  return (
    <div className="flex flex-col h-[90vh] bg-gray-900 rounded-lg overflow-hidden">

      {/* ================= TOOLBAR ================= */}
      <div className="
        flex flex-col sm:flex-row
        sm:items-center sm:justify-between
        gap-3 px-4 py-3
        bg-gray-800 text-white
      ">
        {/* ZOOM */}
        <div className="flex items-center gap-2 justify-center sm:justify-start">
          <button
            onClick={() => {
              setAutoScale(false);
              setScale((s) => Math.max(0.6, s - 0.1));
            }}
            className="px-3 py-1 bg-gray-700 rounded"
          >
            −
          </button>

          <span className="text-sm">{Math.round(scale * 100)}%</span>

          <button
            onClick={() => {
              setAutoScale(false);
              setScale((s) => Math.min(2.5, s + 0.1));
            }}
            className="px-3 py-1 bg-gray-700 rounded"
          >
            +
          </button>
        </div>

        {/* PAGE INFO */}
        <span className="text-sm text-center">
          Page {currentPage} / {numPages}
        </span>

        {/* GO TO PAGE */}
        <div className="flex items-center gap-2 justify-center sm:justify-end">
          <input
            type="number"
            min="1"
            max={numPages}
            value={pageInput}
            onChange={(e) => setPageInput(e.target.value)}
            className="w-16 px-2 py-1 rounded bg-gray-700 text-white text-sm outline-none"
          />
          <button
            onClick={goToPage}
            className="px-3 py-1 bg-gray-700 rounded text-sm"
          >
            Go
          </button>
        </div>
      </div>

      {/* ================= PDF SCROLL AREA ================= */}
      <div
        className="flex-1 overflow-auto bg-gray-900 px-2 sm:px-6 py-6"
        onScroll={handleScroll}
      >
        <Document
          file={pdfUrl}
          onLoadSuccess={({ numPages }) => {
            setNumPages(numPages);
            setCurrentPage(1);
            setPageInput("1");
          }}
          loading={<p className="text-white">Loading PDF…</p>}
        >
          {Array.from({ length: numPages }, (_, i) => (
            <div
              key={i}
              ref={(el) => (pageRefs.current[i] = el)}
              className="flex justify-center mb-6"
            >
              <Page
                pageNumber={i + 1}
                scale={scale}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                className="bg-white shadow-lg max-w-full"
              />
            </div>
          ))}
        </Document>
      </div>
    </div>
  );
};

export default PdfViewer;
