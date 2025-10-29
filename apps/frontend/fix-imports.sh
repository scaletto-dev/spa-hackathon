#!/bin/bash
# Remove unused React imports in JSX files (React 17+)
find /d/THCode/AI/spa-hackathon/apps/frontend/src -type f -name "*.tsx" | while read -r file; do
    # Remove standalone "import React from 'react';"
    sed -i "/^import React from 'react';$/d" "$file"
    
    # Fix "import React, { ... }" to "import { ... }"
    sed -i "s/^import React, { \(.*\) } from 'react';$/import { \1 } from 'react';/" "$file"
done

echo "✅ Fixed unused React imports"
