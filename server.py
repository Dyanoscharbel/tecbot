#!/usr/bin/env python3
"""
Simple HTTP server for serving the TEKBOT Robotics Challenge 2025 documentation.
Optimized for Replit environment with proper CORS headers and cache control.
"""

import http.server
import socketserver
import os
import sys
from urllib.parse import unquote

class DocServer(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory="docs", **kwargs)
    
    def end_headers(self):
        # Add CORS headers to allow cross-origin requests
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        
        # Disable caching for better development experience in Replit
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        
        super().end_headers()
    
    def do_OPTIONS(self):
        # Handle preflight CORS requests
        self.send_response(200)
        self.end_headers()
    
    def do_GET(self):
        # Handle markdown file requests with proper content type
        path = self.translate_path(self.path)
        if path.endswith('.md'):
            self.send_response(200)
            self.send_header('Content-type', 'text/plain; charset=utf-8')
            self.end_headers()
            try:
                with open(path, 'rb') as f:
                    self.copyfile(f, self.wfile)
            except FileNotFoundError:
                self.send_error(404)
            return
        
        # Default handling for other files
        super().do_GET()

def main():
    PORT = 5000
    HOST = "0.0.0.0"  # Bind to all interfaces for Replit
    
    print(f"🚀 Starting TEKBOT Documentation Server...")
    print(f"📁 Serving files from: {os.path.abspath('docs')}")
    print(f"🌐 Server running at: http://{HOST}:{PORT}")
    print(f"📚 Access the documentation at: http://{HOST}:{PORT}")
    print("=" * 50)
    
    try:
        with socketserver.TCPServer((HOST, PORT), DocServer) as httpd:
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
        sys.exit(0)
    except Exception as e:
        print(f"❌ Error starting server: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()