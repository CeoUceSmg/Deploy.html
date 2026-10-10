/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';

export default function App() {
  useEffect(() => {
    window.location.replace('/deploy.html');
  }, []);

  return (
    <div className="min-h-screen bg-[#03040B] text-white flex items-center justify-center font-sans p-6">
      <div className="text-center max-w-sm">
        <div className="w-12 h-12 rounded-2xl bg-[#00E5FF]/10 border border-[#00E5FF]/30 flex items-center justify-center text-[#00E5FF] text-xl mx-auto mb-4 animate-pulse">
          <i className="fa-solid fa-rocket"></i>
        </div>
        <h2 className="text-lg font-bold text-white mb-1">Deployment Central</h2>
        <p className="text-xs text-gray-400 mb-4">Opening full deployment management workspace...</p>
        <a 
          href="/deploy.html" 
          className="text-xs bg-[#00E5FF] text-black font-bold px-4 py-2 rounded-lg uppercase tracking-wider inline-block hover:bg-white transition-colors"
        >
          Enter deploy.html
        </a>
      </div>
    </div>
  );
}
