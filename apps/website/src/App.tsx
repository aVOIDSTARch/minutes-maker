import { useState } from "react";
import "../styles/App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="app">
      <header>
        <h1>My App</h1>
      </header>

      <main>
        <p>Count: {count}</p>
        <button onClick={() => setCount((c) => c + 1)}>Increment</button>
      </main>

      <footer>
        <small>© {new Date().getFullYear()}</small>
      </footer>
    </div>
  );
}

export default App;
