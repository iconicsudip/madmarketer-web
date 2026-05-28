'use client';

import { useState } from 'react';

type LinkItem = { label: string; url: string };
type MenuGroup = { title: string; links: LinkItem[] };

export default function FooterMenuEditor({ initialData }: { initialData: string }) {
  const [menus, setMenus] = useState<MenuGroup[]>(() => {
    try {
      const parsed = JSON.parse(initialData);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const handleAddGroup = () => {
    setMenus([...menus, { title: 'New Group', links: [] }]);
  };

  const handleRemoveGroup = (index: number) => {
    setMenus(menus.filter((_, i) => i !== index));
  };

  const handleUpdateGroupTitle = (index: number, newTitle: string) => {
    const updated = [...menus];
    updated[index].title = newTitle;
    setMenus(updated);
  };

  const handleAddLink = (groupIndex: number) => {
    const updated = [...menus];
    updated[groupIndex].links.push({ label: 'New Link', url: '#' });
    setMenus(updated);
  };

  const handleRemoveLink = (groupIndex: number, linkIndex: number) => {
    const updated = [...menus];
    updated[groupIndex].links.splice(linkIndex, 1);
    setMenus(updated);
  };

  const handleUpdateLink = (groupIndex: number, linkIndex: number, field: keyof LinkItem, value: string) => {
    const updated = [...menus];
    updated[groupIndex].links[linkIndex][field] = value;
    setMenus(updated);
  };

  const inputStyle = { width: '100%', padding: '0.5rem', background: '#222', border: '1px solid #444', color: '#fff', borderRadius: '4px' };
  const btnStyle = { background: '#333', color: '#fff', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' };

  return (
    <div style={{ marginBottom: '2rem' }}>
      <input type="hidden" name="footerMenus" value={JSON.stringify(menus)} />
      
      {menus.map((group, groupIdx) => (
        <div key={groupIdx} style={{ background: '#1a1a1a', padding: '1.5rem', borderRadius: '8px', border: '1px solid #333', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
              <label style={{ color: '#ccc', fontWeight: 'bold' }}>Group Title:</label>
              <input 
                value={group.title} 
                onChange={(e) => handleUpdateGroupTitle(groupIdx, e.target.value)} 
                style={{ ...inputStyle, width: '250px' }} 
              />
            </div>
            <button type="button" onClick={() => handleRemoveGroup(groupIdx)} style={{ ...btnStyle, background: 'rgba(237, 28, 36, 0.2)', color: '#ED1C24' }}>
              Delete Group
            </button>
          </div>

          <div style={{ paddingLeft: '1rem', borderLeft: '2px solid #333', marginBottom: '1rem' }}>
            {group.links.map((link, linkIdx) => (
              <div key={linkIdx} style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem', alignItems: 'center' }}>
                <input 
                  placeholder="Label" 
                  value={link.label} 
                  onChange={(e) => handleUpdateLink(groupIdx, linkIdx, 'label', e.target.value)} 
                  style={{ ...inputStyle, flex: 1 }} 
                />
                <input 
                  placeholder="URL (e.g. /about)" 
                  value={link.url} 
                  onChange={(e) => handleUpdateLink(groupIdx, linkIdx, 'url', e.target.value)} 
                  style={{ ...inputStyle, flex: 2 }} 
                />
                <button type="button" onClick={() => handleRemoveLink(groupIdx, linkIdx)} style={{ ...btnStyle, background: 'transparent', border: '1px solid #555' }}>
                  X
                </button>
              </div>
            ))}
          </div>
          
          <button type="button" onClick={() => handleAddLink(groupIdx)} style={{ ...btnStyle, background: '#444' }}>
            + Add Link
          </button>
        </div>
      ))}

      <button type="button" onClick={handleAddGroup} style={{ ...btnStyle, background: '#ED1C24', padding: '0.6rem 1.2rem', fontSize: '1rem' }}>
        + Add Menu Group
      </button>
    </div>
  );
}
