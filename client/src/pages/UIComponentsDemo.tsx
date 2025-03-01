import React, { useState } from 'react';
import { Button, Card, Modal, Notification, Tabs, Tooltip } from '../../../common/src/components/ui';
import { COLORS } from '../../../common/src/theme/designSystem';

const UIComponentsDemo: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('buttons');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationVariant, setNotificationVariant] = useState<'success' | 'error' | 'info' | 'warning'>('success');
  const [notificationMessage, setNotificationMessage] = useState('');

  const triggerNotification = (variant: 'success' | 'error' | 'info' | 'warning', message: string) => {
    setNotificationVariant(variant);
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const tabItems = [
    {
      key: 'buttons',
      label: 'Buttons',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <Card title="Primary Buttons">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
              <Button variant="primary">Primary Button</Button>
              <Button variant="primary" square>P</Button>
              <Tooltip content="This is a primary button with a tooltip">
                <Button variant="primary">Hover Me</Button>
              </Tooltip>
            </div>
          </Card>

          <Card title="Secondary Buttons">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
              <Button variant="secondary">Secondary Button</Button>
              <Button variant="secondary" square>S</Button>
              <Button
                variant="secondary"
                onClick={() => triggerNotification('info', 'Info notification shown!')}
              >
                Show Notification
              </Button>
            </div>
          </Card>

          <Card title="Success Buttons">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
              <Button variant="success">Success Button</Button>
              <Button variant="success" square>✓</Button>
              <Button
                variant="success"
                onClick={() => triggerNotification('success', 'Success notification shown!')}
              >
                Show Success
              </Button>
            </div>
          </Card>

          <Card title="Special Buttons">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
              <Button variant="special">Special Button</Button>
              <Button variant="special" square>★</Button>
              <Button
                variant="special"
                onClick={() => triggerNotification('warning', 'Warning notification shown!')}
              >
                Show Warning
              </Button>
            </div>
          </Card>

          <Card title="Danger Buttons">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
              <Button variant="danger">Danger Button</Button>
              <Button variant="danger" square>!</Button>
              <Button
                variant="danger"
                onClick={() => {
                  triggerNotification('error', 'Error notification shown!');
                }}
              >
                Show Error
              </Button>
            </div>
          </Card>

          <Card title="Modal Demo">
            <Button variant="primary" onClick={() => setIsModalOpen(true)}>
              Open Modal
            </Button>
          </Card>
        </div>
      ),
    },
    {
      key: 'cards',
      label: 'Cards',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <Card title="Basic Card">
            <p style={{ color: COLORS.TEXT.PRIMARY }}>
              This is a basic card component used to group related content.
            </p>
          </Card>

          <Card title="Card with Actions">
            <p style={{ color: COLORS.TEXT.PRIMARY, marginBottom: '16px' }}>
              Cards can contain actions at the bottom.
            </p>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <Button variant="secondary" size="small">Cancel</Button>
              <Button variant="primary" size="small">Confirm</Button>
            </div>
          </Card>

          <Card title="Game Card Example">
            <div style={{
              display: 'flex',
              gap: '16px',
              alignItems: 'center'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                backgroundColor: COLORS.PRIMARY.FROM,
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: COLORS.TEXT.PRIMARY,
                fontSize: '24px',
                fontWeight: 'bold'
              }}>
                TCG
              </div>
              <div>
                <h3 style={{ margin: '0 0 8px', color: COLORS.TEXT.PRIMARY }}>Game Title</h3>
                <p style={{ margin: 0, color: COLORS.TEXT.MUTED }}>
                  Description of the game goes here. This is a short preview.
                </p>
              </div>
            </div>
          </Card>
        </div>
      ),
    },
    {
      key: 'modals',
      label: 'Modals',
      content: (
        <Card title="Modal Options">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p style={{ color: COLORS.TEXT.PRIMARY }}>
              Click the buttons below to see different modal examples:
            </p>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <Button
                variant="primary"
                onClick={() => {
                  setIsModalOpen(true);
                }}
              >
                Standard Modal
              </Button>
            </div>
          </div>
        </Card>
      ),
    },
    {
      key: 'notifications',
      label: 'Notifications',
      content: (
        <Card title="Notification Options">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p style={{ color: COLORS.TEXT.PRIMARY }}>
              Click the buttons below to see different notification examples:
            </p>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <Button
                variant="success"
                onClick={() => triggerNotification('success', 'Success notification!')}
              >
                Success
              </Button>
              <Button
                variant="primary"
                onClick={() => triggerNotification('info', 'Info notification!')}
              >
                Info
              </Button>
              <Button
                variant="secondary"
                onClick={() => triggerNotification('warning', 'Warning notification!')}
              >
                Warning
              </Button>
              <Button
                variant="danger"
                onClick={() => triggerNotification('error', 'Error notification!')}
              >
                Error
              </Button>
            </div>
          </div>
        </Card>
      ),
    },
  ];

  return (
    <div style={{
      padding: '32px',
      backgroundColor: COLORS.BG_PAGE,
      minHeight: '100vh',
      fontFamily: "'Russo One', system-ui, -apple-system, sans-serif",
    }}>
      <h1 style={{
        fontSize: '36px',
        textAlign: 'center',
        marginBottom: '32px',
        color: COLORS.TEXT.PRIMARY,
      }}>
        TCG Engine UI Components
      </h1>

      <Tabs
        items={tabItems}
        activeKey={activeTab}
        onChange={setActiveTab}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Demo Modal"
        actions={
          <>
            <Button variant="danger" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button
              variant="primary"
              onClick={() => {
                setIsModalOpen(false);
                triggerNotification('success', 'Modal action confirmed!');
              }}
            >
              Confirm
            </Button>
          </>
        }
      >
        <p style={{ color: COLORS.TEXT.PRIMARY }}>
          This is a modal dialog that can be used for confirmations,
          forms, or any content that requires user attention.
        </p>
      </Modal>

      <Notification
        isVisible={showNotification}
        variant={notificationVariant}
        message={notificationMessage}
        onClose={() => setShowNotification(false)}
      />
    </div>
  );
};

export default UIComponentsDemo;
