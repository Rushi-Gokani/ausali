import { useEffect, useMemo, useState } from 'react';
import './AdminPage.css';

const adminApiUrl = import.meta.env.VITE_ADMIN_QUOTES_API_URL
  || (typeof window !== 'undefined' && window.location.port === '5173'
    ? 'http://localhost/ausali-api/admin-quotes.php'
    : '/api/admin-quotes.php');

const productLabels = {
  'sliding-gate': 'Sliding Gate',
  'pedestrian-gate': 'Pedestrian Gate',
  'front-fence': 'Front Fence',
  'utility-enclosures': 'Utility Enclosures',
  'facade-screen': 'Facade Screen',
  balustrades: 'Balustrades & Handrails',
  'decorative-screens': 'Decorative Screens',
  'sun-hoods': 'Sun Hoods',
  'window-shades': 'Window Shades',
  'entry-features': 'Entry Features',
};

const styleLabels = {
  'horizontal-slats': 'Horizontal Slats',
  'vertical-slats': 'Vertical Slats',
  'batten-style': 'Batten Style',
  louvre: 'Louvre',
  'cnc-decorative': 'CNC Decorative Screen',
  hampton: 'Hampton Style',
  'flat-bar': 'Flat Bar Style',
  'minimal-solid': 'Minimal / Solid Panel',
  'address-feature': 'Address Feature',
  'custom-design': 'Custom Design',
};

const timberFinishLabels = {
  'black-wenge': 'Black Wenge',
  'grey-ash': 'Grey Ash',
  hinoki: 'Hinoki',
  merbau: 'Merbau',
  'nordic-oak': 'Nordic Oak',
  'norwegian-beech': 'Norwegian Beech',
  'queensland-walnut': 'Queensland Walnut',
  spruce: 'Spruce',
  sycamore: 'Sycamore',
  'tassie-oak': 'Tassie Oak',
  other: 'Other timber finish',
};

const adminRecordTabs = [
  { id: 'full-package', label: 'Full Package' },
  { id: 'supply-only', label: 'Supply Only' },
  { id: 'installation', label: 'Installation' },
  { id: 'talk-to-team', label: 'Team Help' },
  { id: 'contact-us', label: 'Contact Us' },
];

function readable(value) {
  if (value === null || value === undefined || value === '') {
    return 'Not provided';
  }

  if (typeof value !== 'string') {
    return String(value);
  }

  return value
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatDate(value) {
  if (!value) return 'Not provided';
  const date = new Date(value.replace(' ', 'T'));
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

function productName(id) {
  return productLabels[id] || readable(id);
}

function styleName(id) {
  return styleLabels[id] || readable(id);
}

function timberFinishName(id) {
  return timberFinishLabels[id] || readable(id);
}

function adminColourValue(style = {}) {
  if (style.finish === 'timber-finish') {
    if (style.woodFinish === 'other' && style.customFinish) {
      return style.customFinish;
    }

    return timberFinishName(style.woodFinish);
  }

  return style.colour;
}

function adminCustomColourValue(style = {}) {
  if (style.finish === 'timber-finish') {
    return style.customFinish;
  }

  return style.customColour;
}

function AdminPage() {
  const [adminEmail, setAdminEmail] = useState(() => sessionStorage.getItem('ausaliAdminEmail') || 'admin@ausali.com');
  const [adminPassword, setAdminPassword] = useState('');
  const [records, setRecords] = useState([]);
  const [selectedUid, setSelectedUid] = useState(null);
  const [activeRecordTab, setActiveRecordTab] = useState('full-package');
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState({ loading: false, error: '', loaded: false });

  const selectedRecord = records.find((record) => record.uid === selectedUid) || null;

  const stats = useMemo(() => {
    const byPathway = records.reduce((totals, record) => {
      const key = readable(record.pathway);
      totals[key] = (totals[key] || 0) + 1;
      return totals;
    }, {});

    return {
      total: records.length,
      latest: records[0]?.createdAt || '',
      byPathway,
    };
  }, [records]);

  const loadRecords = async (event) => {
    event?.preventDefault();

    if (!adminEmail.trim() || !adminPassword) {
      setStatus({ loading: false, error: 'Enter your admin email and password.', loaded: false });
      return;
    }

    setStatus({ loading: true, error: '', loaded: false });

    try {
      const response = await fetch(adminApiUrl, {
        headers: {
          'X-Admin-Email': adminEmail.trim(),
          'X-Admin-Password': adminPassword,
        },
      });

      const result = await response.json().catch(() => ({
        ok: false,
        message: 'The server returned an invalid response.',
      }));

      if (!response.ok || !result.ok) {
        throw new Error(result.message || 'Unable to load quote requests.');
      }

      sessionStorage.setItem('ausaliAdminEmail', adminEmail.trim());
      setRecords(result.records || []);
      setSelectedUid(null);
      setStatus({ loading: false, error: '', loaded: true });
    } catch (error) {
      setRecords([]);
      setSelectedUid(null);
      setStatus({
        loading: false,
        error: error.message || 'Unable to load quote requests.',
        loaded: false,
      });
    }
  };

  useEffect(() => {
    if (!sessionStorage.getItem('ausaliAdminEmail')) {
      sessionStorage.setItem('ausaliAdminEmail', adminEmail);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('ausaliAdminEmail');
    setAdminEmail('admin@ausali.com');
    setAdminPassword('');
    setRecords([]);
    setSelectedUid(null);
    setStatus({ loading: false, error: '', loaded: false });
  };

  if (!status.loaded) {
    return (
      <section className="admin-page admin-login-page">
        <div className="admin-login-shell">
          <div className="admin-login-copy">
            <span>AUSALI ADMIN</span>
            <h1>Quote Manager</h1>
            <p>Sign in to view every quote enquiry, contact detail, selected product, style, colour and project note.</p>
          </div>

          <form className="admin-login-card" onSubmit={loadRecords}>
            <div className="admin-login-card-head">
              <span>Secure Area</span>
              <h2>Admin Login</h2>
            </div>
            <label>
              <span>Email</span>
              <input
                type="email"
                value={adminEmail}
                placeholder="admin@ausali.com"
                onChange={(event) => setAdminEmail(event.target.value)}
              />
            </label>
            <label>
              <span>Password</span>
              <input
                type="password"
                value={adminPassword}
                placeholder="Enter password"
                onChange={(event) => setAdminPassword(event.target.value)}
              />
            </label>
            {status.error ? <p className="admin-error">{status.error}</p> : null}
            <button type="submit" disabled={status.loading}>
              {status.loading ? 'Checking...' : 'Login'}
            </button>
          </form>
        </div>
      </section>
    );
  }

  const tabCounts = adminRecordTabs.reduce((counts, tab) => ({
    ...counts,
    [tab.id]: records.filter((record) => record.pathway === tab.id).length,
  }), {});

  const filteredRecords = records.filter((record) => {
    if (record.pathway !== activeRecordTab) return false;

    const needle = query.trim().toLowerCase();
    if (!needle) return true;

    return [
      record.referenceCode,
      record.pathway,
      record.projectType,
      record.customerName,
      record.customerEmail,
      record.customerPhone,
      record.suburb,
      record.postcode,
      record.createdAt,
      record.details?.service,
      record.details?.budget,
      record.details?.message,
    ].some((value) => String(value || '').toLowerCase().includes(needle));
  });

  const activeTabLabel = adminRecordTabs.find((tab) => tab.id === activeRecordTab)?.label || 'Records';

  return (
    <section className="admin-page admin-dashboard-page">
      <header className="admin-topbar">
        <div>
          <span>AUSALI ADMIN</span>
          <h1>Quote Requests</h1>
        </div>
        <div className="admin-topbar-actions">
          <button type="button" onClick={loadRecords} disabled={status.loading}>
            {status.loading ? 'Refreshing...' : 'Refresh'}
          </button>
          <button type="button" className="admin-muted-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {status.error ? <p className="admin-error">{status.error}</p> : null}

      <div className="admin-stats">
        <StatCard label="Total records" value={stats.total} />
        <StatCard label="Latest enquiry" value={formatDate(stats.latest)} />
        <StatCard
          label="Pathways"
          value={Object.entries(stats.byPathway).map(([label, count]) => `${label}: ${count}`).join(' | ') || 'No records'}
        />
      </div>

      <div className="admin-record-tabs" role="tablist" aria-label="Admin form lists">
        {adminRecordTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeRecordTab === tab.id}
            className={activeRecordTab === tab.id ? 'active' : ''}
            onClick={() => {
              setActiveRecordTab(tab.id);
              setSelectedUid(null);
            }}
          >
            <span>{tab.label}</span>
            <strong>{tabCounts[tab.id] || 0}</strong>
          </button>
        ))}
      </div>

      <div className="admin-tab-list-panel">
        <div className="admin-records-top">
          <div>
            <span>Records</span>
            <h2>{activeTabLabel}</h2>
          </div>
          <input
            type="search"
            placeholder="Search by name, email, phone, suburb..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>

        <div className="admin-table-wrap">
          {filteredRecords.length ? (
            <table className="admin-record-table">
              <thead>
                <tr>
                  <th>Reference</th>
                  <th>Name</th>
                  <th>Contact</th>
                  <th>Suburb</th>
                  <th>Submitted</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record) => (
                  <tr key={record.uid}>
                    <td>{record.referenceCode}</td>
                    <td>{record.customerName || 'No name'}</td>
                    <td>{record.customerEmail || record.customerPhone || 'No contact'}</td>
                    <td>{record.suburb || 'Not provided'}</td>
                    <td>{formatDate(record.createdAt)}</td>
                    <td>
                      <button type="button" onClick={() => setSelectedUid(record.uid)}>
                        Open
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="admin-empty">No matching records in this tab.</p>
          )}
        </div>
      </div>

      {selectedRecord ? (
        <div className="admin-drawer-backdrop" onClick={() => setSelectedUid(null)}>
          <aside className="admin-detail-drawer" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="admin-drawer-close" onClick={() => setSelectedUid(null)}>
              Close
            </button>
            <RecordDetail record={selectedRecord} />
          </aside>
        </div>
      ) : null}
    </section>
  );
}

function StatCard({ label, value }) {
  return (
    <article className="admin-stat-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

function RecordDetail({ record }) {
  const [activeTab, setActiveTab] = useState('contact');
  const site = record.site || {};
  const contact = record.contact || {};
  const details = record.details || {};
  const isContact = record.recordType === 'contact';
  const isInstallation = record.pathway === 'installation';
  const isSupplyOnly = record.pathway === 'supply-only';
  const tabs = isContact ? [
    {
      id: 'contact',
      label: 'Contact',
      content: (
        <DetailSection title="Contact Details">
          <InfoGrid
            items={[
              ['Name', contact.name || record.customerName],
              ['Email', contact.email || record.customerEmail],
              ['Phone', contact.phone || record.customerPhone],
              ['Suburb', record.suburb],
            ]}
          />
        </DetailSection>
      ),
    },
    {
      id: 'message',
      label: 'Message',
      content: (
        <DetailSection title="Contact Form Message">
          <InfoGrid
            items={[
              ['Service required', details.service],
              ['Estimated budget', details.budget],
              ['Project details', details.message],
            ]}
          />
        </DetailSection>
      ),
    },
  ] : [
    {
      id: 'contact',
      label: 'Contact',
      content: (
        <DetailSection title="Customer & Contact">
          <InfoGrid
            items={[
              ['Name', contact.name || record.customerName],
              ['Email', contact.email || record.customerEmail],
              ['Phone', contact.phone || record.customerPhone],
              ['Notes', contact.notes],
            ]}
          />
        </DetailSection>
      ),
    },
    isInstallation ? {
      id: 'installation',
      label: 'Installation',
      content: (
        <DetailSection title="Installation">
          <InfoGrid
            items={[
              ['Products or work required', details.installDescription],
              ['Supplied by', details.suppliedBy],
              ['Product stage', details.productStage],
              ['Manufacturer / product reference', details.manufacturerRef],
              ['Installation notes', details.installNotes],
            ]}
          />
        </DetailSection>
      ),
    } : {
      id: 'products',
      label: 'Products',
      content: (
        <DetailSection title="Selected Products & Styles">
          {Array.isArray(record.products) && record.products.length ? (
            <div className="admin-product-list">
              {record.products.map((productId) => {
                const style = record.styles?.[productId] || {};
                return (
                  <article key={productId}>
                    <h3>{productName(productId)}</h3>
                    <InfoGrid
                      items={[
                        ['Style', styleName(style.style)],
                        ['Finish', readable(style.finish)],
                        [style.finish === 'timber-finish' ? 'Timber finish' : 'Colour', adminColourValue(style)],
                        [style.finish === 'timber-finish' ? 'Other finish/reference' : 'Custom colour/code', adminCustomColourValue(style)],
                      ]}
                    />
                  </article>
                );
              })}
            </div>
          ) : (
            <p className="admin-empty">No products selected for this pathway.</p>
          )}
        </DetailSection>
      ),
    },
    {
      id: 'details',
      label: 'Details',
      content: (
        <DetailSection title="Project Details">
          <InfoGrid
            items={[
              ['Dimensions', details.dimensions],
              ['Access / site notes', details.access],
              ['Other notes', details.notes],
            ]}
          />
        </DetailSection>
      ),
    },
    {
      id: isSupplyOnly ? 'fulfillment' : 'site',
      label: isSupplyOnly ? 'Fulfillment' : 'Site',
      content: (
        <DetailSection title={isSupplyOnly ? 'Fulfillment' : 'Site & Timing'}>
          {isSupplyOnly ? (
            <InfoGrid
              items={[
                ['Preference', site.fulfillmentMethod],
                ['Delivery suburb', site.suburb || record.suburb],
                ['Postcode', site.postcode || record.postcode],
                ['Delivery address', site.address],
                ['Preferred timing', site.preferredDate],
                ['Delivery or collection notes', site.siteDetails],
              ]}
            />
          ) : (
            <InfoGrid
              items={[
                ['Suburb', site.suburb || record.suburb],
                ['Postcode', site.postcode || record.postcode],
                ['Street address', site.address],
                ['Preferred date', site.preferredDate],
                ['Project stage', site.stage],
                ['Site details', site.siteDetails],
              ]}
            />
          )}
        </DetailSection>
      ),
    },
    {
      id: 'inspiration',
      label: 'Inspiration',
      content: (
        <DetailSection title="Inspiration">
          {Array.isArray(record.inspiration) && record.inspiration.length ? (
            <div className="admin-chip-row">
              {record.inspiration.map((item) => <span key={item}>{readable(item)}</span>)}
            </div>
          ) : (
            <p className="admin-empty">No inspiration selected.</p>
          )}
        </DetailSection>
      ),
    },
  ];
  const visibleTab = tabs.some((tab) => tab.id === activeTab) ? activeTab : tabs[0].id;

  return (
    <div className="record-detail-wrap">
      <header className="record-detail-header">
        <div>
          <span>Reference</span>
          <h2>{record.referenceCode}</h2>
          <p>Submitted {formatDate(record.createdAt)}</p>
        </div>
        <dl>
          <div>
            <dt>Pathway</dt>
            <dd>{readable(record.pathway)}</dd>
          </div>
          <div>
            <dt>Project</dt>
            <dd>{readable(record.projectType)}</dd>
          </div>
          <div>
            <dt>SQL table</dt>
            <dd>{record.formTable || 'quote_requests'}</dd>
          </div>
        </dl>
      </header>

      <div className="admin-detail-tabs" role="tablist" aria-label="Quote record sections">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={visibleTab === tab.id}
            className={visibleTab === tab.id ? 'active' : ''}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="admin-detail-tab-panel" role="tabpanel">
        {tabs.find((tab) => tab.id === visibleTab)?.content}
      </div>
    </div>
  );
}

function DetailSection({ title, children }) {
  return (
    <section className="admin-detail-section">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

function InfoGrid({ items }) {
  return (
    <dl className="admin-info-grid">
      {items.map(([label, value]) => (
        <div key={label}>
          <dt>{label}</dt>
          <dd>{readable(value)}</dd>
        </div>
      ))}
    </dl>
  );
}

export default AdminPage;
