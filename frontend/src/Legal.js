import './style/root.css';


export default function LegalPage() {
  return (
    <section 
      className="legal-section" 
      style={{ 
        padding: "var(--navbar-height) 15vw", 
        margin: "0 auto", 
        lineHeight: "1.8", 
        backgroundColor: "var(--background-color)"
      }}
    >
      <h2 style={{ fontSize: "2rem", margin: "calc(var(--navbar-height) + 1rem)" }}>
        Legal Information
      </h2>

      <div>
        <h3 style={{ fontSize: "1.6rem", marginTop: "2rem"}}>
          Terms of Service
        </h3>
        <p style={{ fontSize: "1.2rem", marginTop: "2rem"}}>
          By using this service, you agree to the following terms...
        </p>

        <h3 style={{ fontSize: "1.6rem", marginTop: "2rem"}}>
          Privacy Policy
        </h3>
        <p style={{ fontSize: "1.2rem", marginTop: "2rem" }}>
          Your privacy is important to us. We will not share your information with third parties without your consent.
        </p>
      </div>
    </section>
  );
}