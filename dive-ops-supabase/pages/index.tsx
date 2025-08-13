export default function Home() {
  return (
    <div className="container">
      <div className="card">
        <h1>Welcome to Dive Ops</h1>
        <p>Dive management system</p>
        
        <div style={{ marginTop: '20px' }}>
          <h2>Features:</h2>
          <ul>
            <li>Dive log management</li>
            <li>Equipment tracking</li>
            <li>Dive site database</li>
            <li>Safety planning</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
