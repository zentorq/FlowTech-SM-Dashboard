export default function BrandPanel() {
  return (
    <aside className="brand-panel">
      <div className="brand-content">
        {/* Save the provided logo as public/flowtech-logo.png */}
        <img src="/flowtech-logo.png" alt="FlowTech Media Solutions logo" className="brand-logo" />

        <h1>
          One dashboard.
          <br />
          Every insight.
        </h1>

        <p>
          Connect your social platforms and monitor your digital performance
          from one simple, powerful workspace.
        </p>

        <ul className="feature-list">
          <li><span className="check">✓</span> Unified analytics</li>
          <li><span className="check">✓</span> Real-time metrics</li>
          <li><span className="check">✓</span> Secure sessions</li>
          <li><span className="check">✓</span> Growth insights</li>
        </ul>
      </div>
    </aside>
  );
}
