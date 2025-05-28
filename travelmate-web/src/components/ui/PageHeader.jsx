import './PageHeader.css';

function PageHeader({ title, subtitle, action }) {
  return (
<div className="page-header">      <div>
        <h1 className="text-4xl font-extrabold text-purple-800 mb-1">{title}</h1>
        {subtitle && <p className="text-gray-600 text-lg">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export default PageHeader;
