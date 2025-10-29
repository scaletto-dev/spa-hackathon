#!/usr/bin/env python3
import re
import os
from pathlib import Path

frontend_src = Path('/d/THCode/AI/spa-hackathon/apps/frontend/src')

# Fix files with implicit any in props
def fix_component_props(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    
    # Fix pattern: function Component({ prop1, prop2 }) {
    # to: interface ComponentProps { prop1: any; prop2: any } function Component({ prop1, prop2 }: ComponentProps) {
    
    # For now, just add types for common patterns
    # Pattern 1: export function Component({ branches, selectedBranch, setSelectedBranch })
    pattern1 = r'export function (\w+)\(\{ ([^}]+) \}\) \{'
    matches = re.finditer(pattern1, content)
    
    for match in matches:
        component_name = match.group(1)
        props_str = match.group(2)
        props = [p.strip() for p in props_str.split(',')]
        
        # Generate interface
        interface_lines = [f'interface {component_name}Props {{']
        for prop in props:
            interface_lines.append(f'    {prop}: any; // TODO: Add proper type')
        interface_lines.append('}')
        interface_str = '\n'.join(interface_lines)
        
        # Replace
        new_signature = f'{interface_str}\n\nexport function {component_name}({{ {props_str} }}: {component_name}Props) {{'
        content = content.replace(match.group(0), new_signature)
    
    if content != original:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

# Process all tsx files
count = 0
for file_path in frontend_src.rglob('*.tsx'):
    if 'node_modules' in str(file_path):
        continue
    if fix_component_props(file_path):
        count += 1
        print(f'Fixed: {file_path}')

print(f'\n✅ Fixed {count} files')
