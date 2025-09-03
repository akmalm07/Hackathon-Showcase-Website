import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import "./style/upload.css";

// Google Form URL(for uploading project)
const FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSf16w03pQmC7W9tVN0JasGeG1ciNbuKoXDfqOCO93WLRI42vA/viewform?usp=dialog";

function UploadButton() {
  return (
    <a href={FORM_URL} target="_blank" rel="noopener noreferrer" className="upload-btn">
      Upload Project <ArrowRight className="upload-icon" />
    </a>
  );
}

function UploadSection() {
  const location = useLocation();
  const [isAboutPage, setIsAboutPage] = useState(false);

  // this checks if user is in home/about page
  useEffect(() => {
    if (location.pathname === "/") {
      setIsAboutPage(true);
    } else {
      setIsAboutPage(false);
    }
  }, [location]);

  return (
    <section id="Upload-Sec" className={isAboutPage ? "about-page" : ""}>
      <div className="upload-info">
        <div className="upload-title">
          <h2>Are You Ready to Upload Your Project?</h2>
          <p>Upload Your Project Here!</p>
        </div>
        <UploadButton />
      </div>
    </section>
  );
}

export default function Upload() {
  return (
    <>
      <UploadSection />
    </>
  );
}
