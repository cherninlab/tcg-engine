import React from 'react';
import { COLORS, TYPOGRAPHY, COMPONENTS, BORDERS, EFFECTS } from '../../theme/designSystem';

export interface TabItem {
  key: string;
  label: React.ReactNode;
  content?: React.ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  items: TabItem[];
  activeKey: string;
  onChange: (key: string) => void;
  className?: string;
  style?: React.CSSProperties;
  tabContainerStyle?: React.CSSProperties;
  contentStyle?: React.CSSProperties;
}

export const Tabs: React.FC<TabsProps> = ({
  items,
  activeKey,
  onChange,
  className = '',
  style = {},
  tabContainerStyle = {},
  contentStyle = {},
}) => {
  const handleTabClick = (key: string, disabled?: boolean) => {
    if (disabled) return;
    onChange(key);
  };

  const activeTab = items.find((item) => item.key === activeKey);

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flexDirection: 'column',
        ...style,
      }}
    >
      {/* Tab Navigation */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          padding: '8px',
          backgroundColor: COLORS.BG_DARK,
          borderRadius: BORDERS.RADIUS.MD,
          ...tabContainerStyle,
        }}
      >
        {items.map((item) => (
          <button
            key={item.key}
            onClick={() => handleTabClick(item.key, item.disabled)}
            style={{
              flex: 1,
              height: COMPONENTS.TABS.HEIGHT,
              borderRadius: BORDERS.RADIUS.SM,
              border: 'none',
              background: item.key === activeKey
                ? `linear-gradient(180deg, ${COLORS.PRIMARY.FROM} 0%, ${COLORS.PRIMARY.TO} 100%)`
                : 'none',
              cursor: item.disabled ? 'not-allowed' : 'pointer',
              opacity: item.disabled ? 0.6 : 1,
              padding: '0 16px',
              transition: 'background 0.2s ease',
              fontFamily: TYPOGRAPHY.FONT_FAMILY.PRIMARY,
              fontSize: TYPOGRAPHY.FONT_SIZE.LG,
              color: COLORS.TEXT.PRIMARY,
              textShadow: EFFECTS.TEXT_SHADOW,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab?.content && (
        <div
          style={{
            marginTop: '16px',
            ...contentStyle,
          }}
        >
          {activeTab.content}
        </div>
      )}
    </div>
  );
};

export default Tabs;
